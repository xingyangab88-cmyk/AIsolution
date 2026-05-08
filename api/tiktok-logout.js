export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const expiredCookies = ['tiktok_access_token', 'tiktok_refresh_token', 'tiktok_open_id'].map(
    (cookieName) =>
      `${cookieName}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
  );

  response.setHeader('Set-Cookie', expiredCookies);

  return response.status(200).json({
    ok: true,
    message: 'TikTok session cleared',
  });
}
