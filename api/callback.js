/* global process */

const TIKTOK_TOKEN_URL = 'https://open.tiktokapis.com/v2/oauth/token/';
const REDIRECT_URI = 'https://solarkhmer.vercel.app/callback';

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { code, error, error_description: errorDescription } = request.query;

  if (error) {
    return response.status(400).json({
      ok: false,
      error,
      error_description: errorDescription,
    });
  }

  if (!code || typeof code !== 'string') {
    return response.status(400).json({
      ok: false,
      error: 'Missing TikTok authorization code',
    });
  }

  if (!process.env.TIKTOK_CLIENT_KEY || !process.env.TIKTOK_CLIENT_SECRET) {
    return response.status(500).json({
      ok: false,
      error: 'TikTok credentials are not configured',
    });
  }

  const body = new URLSearchParams({
    client_key: process.env.TIKTOK_CLIENT_KEY,
    client_secret: process.env.TIKTOK_CLIENT_SECRET,
    code,
    grant_type: 'authorization_code',
    redirect_uri: REDIRECT_URI,
  });

  const tokenResponse = await fetch(TIKTOK_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  const tokenData = await tokenResponse.json();

  if (!tokenResponse.ok || tokenData.error) {
    return response.status(400).json({
      ok: false,
      error: tokenData.error || 'TikTok token exchange failed',
      error_description: tokenData.error_description,
      log_id: tokenData.log_id,
    });
  }

  return response.status(200).json({
    ok: true,
    message: 'TikTok authorization successful',
    open_id: tokenData.open_id,
    scope: tokenData.scope,
    token_type: tokenData.token_type,
    expires_in: tokenData.expires_in,
    refresh_expires_in: tokenData.refresh_expires_in,
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token,
  });
}
