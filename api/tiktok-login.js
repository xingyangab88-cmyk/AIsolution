/* global process */

const REDIRECT_URI = 'https://solarkhmer.vercel.app/callback';
const requestedScopes = 'user.info.basic,video.upload,video.publish,user.info.stats,video.list';

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');

  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const environment = request.query?.environment === 'sandbox' ? 'sandbox' : 'production';
  const mode = request.query?.mode === 'code' ? 'code_only' : 'token';
  const clientKey =
    environment === 'sandbox'
      ? process.env.TIKTOK_SANDBOX_CLIENT_KEY || process.env.TIKTOK_CLIENT_KEY
      : process.env.TIKTOK_CLIENT_KEY;

  if (!clientKey) {
    return response.status(500).json({
      ok: false,
      error: 'TikTok client key is not configured',
    });
  }

  const authorizeUrl = new URL('https://www.tiktok.com/v2/auth/authorize/');
  authorizeUrl.searchParams.set('client_key', clientKey);
  authorizeUrl.searchParams.set('scope', requestedScopes);
  authorizeUrl.searchParams.set('response_type', 'code');
  authorizeUrl.searchParams.set('redirect_uri', REDIRECT_URI);
  authorizeUrl.searchParams.set('state', `solarkhmer_${mode}_${environment}`);

  return response.redirect(302, authorizeUrl.toString());
}
