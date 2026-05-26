/* global process */

const TIKTOK_API_BASE = 'https://open.tiktokapis.com';
const REDIRECT_URI = 'https://solarkhmer.vercel.app/callback';

const cookieOptions = [
  'Path=/',
  'HttpOnly',
  'Secure',
  'SameSite=Lax',
];

const makeCookie = (name, value, maxAgeSeconds) =>
  `${name}=${encodeURIComponent(value)}; ${[
    ...cookieOptions,
    `Max-Age=${maxAgeSeconds}`,
  ].join('; ')}`;

const getTikTokCredentials = (state = '') => {
  const isSandbox = String(state).includes('sandbox');

  return {
    clientKey: isSandbox
      ? process.env.TIKTOK_SANDBOX_CLIENT_KEY || process.env.TIKTOK_CLIENT_KEY
      : process.env.TIKTOK_CLIENT_KEY,
    clientSecret: isSandbox
      ? process.env.TIKTOK_SANDBOX_CLIENT_SECRET || process.env.TIKTOK_CLIENT_SECRET
      : process.env.TIKTOK_CLIENT_SECRET,
  };
};

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');

  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).send('Method not allowed');
  }

  const {
    code,
    state = '',
    error,
    error_description: errorDescription,
  } = request.query;

  if (error) {
    return response.redirect(
      302,
      `/tiktok-demo?auth=error&message=${encodeURIComponent(errorDescription || error)}`,
    );
  }

  if (!code || typeof code !== 'string') {
    return response.redirect(302, '/api/tiktok-login');
  }

  const { clientKey, clientSecret } = getTikTokCredentials(state);

  if (!clientKey || !clientSecret) {
    return response.status(500).send('TikTok client key or secret is not configured.');
  }

  const tokenBody = new URLSearchParams({
    client_key: clientKey,
    client_secret: clientSecret,
    code,
    grant_type: 'authorization_code',
    redirect_uri: REDIRECT_URI,
  });

  const tokenResponse = await fetch(`${TIKTOK_API_BASE}/v2/oauth/token/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache',
    },
    body: tokenBody,
  });
  const tokenData = await tokenResponse.json();

  if (!tokenResponse.ok || tokenData.error) {
    return response.status(400).json({
      ok: false,
      error: tokenData.error || 'TikTok token exchange failed',
      message: tokenData.error_description,
      data: tokenData,
    });
  }

  const accessTokenMaxAge = Number(tokenData.expires_in || 86400);
  const refreshTokenMaxAge = Number(tokenData.refresh_expires_in || 31536000);
  const cookies = [
    makeCookie('tiktok_access_token', tokenData.access_token, accessTokenMaxAge),
  ];

  if (tokenData.refresh_token) {
    cookies.push(makeCookie('tiktok_refresh_token', tokenData.refresh_token, refreshTokenMaxAge));
  }

  response.setHeader('Set-Cookie', cookies);
  return response.redirect(302, '/post-to-tiktok?auth=success');
}
