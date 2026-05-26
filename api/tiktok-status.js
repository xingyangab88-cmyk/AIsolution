const TIKTOK_API_BASE = 'https://open.tiktokapis.com';

const getCookie = (request, name) => {
  const cookies = request.headers.cookie || '';
  const match = cookies
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : '';
};

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const accessToken = getCookie(request, 'tiktok_access_token');

  if (!accessToken) {
    return response.status(401).json({
      ok: false,
      error: 'Connect TikTok before checking post status',
    });
  }

  const { publishId } = request.body || {};

  if (!publishId || typeof publishId !== 'string') {
    return response.status(400).json({
      ok: false,
      error: 'publishId is required',
    });
  }

  const statusResponse = await fetch(`${TIKTOK_API_BASE}/v2/post/publish/status/fetch/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({
      publish_id: publishId,
    }),
  });
  const statusData = await statusResponse.json();

  if (!statusResponse.ok || statusData.error?.code !== 'ok') {
    return response.status(400).json({
      ok: false,
      error: statusData.error?.code || 'TikTok status request failed',
      message: statusData.error?.message,
      log_id: statusData.error?.log_id,
      data: statusData.data,
    });
  }

  return response.status(200).json({
    ok: true,
    publish_id: publishId,
    status: statusData.data,
  });
}
