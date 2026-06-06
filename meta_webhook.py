import os
import json
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import PlainTextResponse
from pymongo import MongoClient


def load_env_value(name: str) -> str:
    if os.getenv(name):
        return os.getenv(name, "")

    env_path = Path(__file__).with_name(".env")
    if not env_path.exists():
        return ""

    for line in env_path.read_text(encoding="utf-8").splitlines():
        key, separator, value = line.partition("=")
        if separator and key.strip() == name:
            return value.strip().strip('"').strip("'")

    return ""


app = FastAPI()


def graph_api_get(path: str, params: dict) -> dict:
    query = urllib.parse.urlencode(params)
    url = f"https://graph.facebook.com/v25.0/{path}?{query}"
    request = urllib.request.Request(url, headers={"Accept": "application/json"})

    with urllib.request.urlopen(request, timeout=20) as response:
        return json.loads(response.read().decode("utf-8"))


def get_lead_details(leadgen_id: str) -> dict:
    access_token = load_env_value("META_PAGE_ACCESS_TOKEN")
    if not access_token:
        raise RuntimeError("META_PAGE_ACCESS_TOKEN is not configured")

    return graph_api_get(
        leadgen_id,
        {
            "access_token": access_token,
            "fields": (
                "id,created_time,ad_id,ad_name,adset_id,adset_name,"
                "campaign_id,campaign_name,form_id,field_data,platform"
            ),
        },
    )


def save_lead(lead: dict, webhook_value: dict) -> None:
    mongo_uri = load_env_value("MONGO_URI")
    if not mongo_uri:
        print("MONGO_URI is not configured. Lead detail:", lead)
        return

    database_name = load_env_value("MONGO_DATABASE") or "solor_energy"
    collection_name = load_env_value("MONGO_LEAD_COLLECTION") or "lead_store"
    client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
    collection = client[database_name][collection_name]

    collection.update_one(
        {"leadgen_id": lead["id"]},
        {
            "$set": {
                "leadgen_id": lead["id"],
                "lead": lead,
                "webhook_value": webhook_value,
                "updated_at": datetime.now(timezone.utc),
            },
            "$setOnInsert": {
                "created_at": datetime.now(timezone.utc),
                "source": "meta_lead_ads",
            },
        },
        upsert=True,
    )


def extract_leadgen_values(payload: dict) -> list[dict]:
    values = []

    for entry in payload.get("entry", []):
        for change in entry.get("changes", []):
            if change.get("field") == "leadgen" and change.get("value"):
                values.append(change["value"])

    return values


@app.get("/webhook/facebook")
async def verify_facebook_webhook(
    hub_mode: str = Query(..., alias="hub.mode"),
    hub_verify_token: str = Query(..., alias="hub.verify_token"),
    hub_challenge: str = Query(..., alias="hub.challenge"),
):
    if (
        hub_mode == "subscribe"
        and hub_verify_token == load_env_value("META_WEBHOOK_VERIFY_TOKEN")
    ):
        return PlainTextResponse(hub_challenge)

    raise HTTPException(status_code=403, detail="Invalid webhook verify token")


@app.post("/webhook/facebook")
async def receive_facebook_webhook(payload: dict):
    print("Meta webhook payload:", payload)

    saved = 0
    errors = []

    for value in extract_leadgen_values(payload):
        leadgen_id = value.get("leadgen_id")
        if not leadgen_id:
            continue

        try:
            lead = get_lead_details(leadgen_id)
            save_lead(lead, value)
            saved += 1
        except Exception as error:
            print("Failed to process Meta lead:", leadgen_id, error)
            errors.append({"leadgen_id": leadgen_id, "error": str(error)})

    return {"status": "ok", "saved": saved, "errors": errors}
