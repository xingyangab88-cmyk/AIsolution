/* global process */

const TIKTOK_TOKEN_URL = 'https://open.tiktokapis.com/v2/oauth/token/';
const REDIRECT_URI = 'https://solarkhmer.vercel.app/callback';
const TIKTOK_SANDBOX_CLIENT_KEY = 'sbaw777avskqma5t3i';

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');

  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { code, error, error_description: errorDescription, state } = request.query;

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

  const isSandbox = typeof state === 'string' && state.includes('sandbox');
  const clientKey = isSandbox
    ? TIKTOK_SANDBOX_CLIENT_KEY
    : process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = isSandbox
    ? process.env.TIKTOK_SANDBOX_CLIENT_SECRET
    : process.env.TIKTOK_CLIENT_SECRET;

  if (!clientKey || !clientSecret) {
    return response.status(500).json({
      ok: false,
      error: 'TikTok credentials are not configured',
    });
  }

  const body = new URLSearchParams({
    client_key: clientKey,
    client_secret: clientSecret,
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

  const accessCookie = [
    `tiktok_access_token=${encodeURIComponent(tokenData.access_token)}`,
    'HttpOnly',
    'Secure',
    'SameSite=Lax',
    'Path=/',
    `Max-Age=${tokenData.expires_in || 86400}`,
  ].join('; ');
  const refreshCookie = [
    `tiktok_refresh_token=${encodeURIComponent(tokenData.refresh_token)}`,
    'HttpOnly',
    'Secure',
    'SameSite=Lax',
    'Path=/',
    `Max-Age=${tokenData.refresh_expires_in || 31536000}`,
  ].join('; ');
  const openIdCookie = [
    `tiktok_open_id=${encodeURIComponent(tokenData.open_id)}`,
    'HttpOnly',
    'Secure',
    'SameSite=Lax',
    'Path=/',
    `Max-Age=${tokenData.expires_in || 86400}`,
  ].join('; ');

  response.setHeader('Set-Cookie', [accessCookie, refreshCookie, openIdCookie]);

  return response.redirect(302, '/tiktok-demo?auth=success');
}
