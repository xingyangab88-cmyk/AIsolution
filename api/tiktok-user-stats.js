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
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const accessToken = getCookie(request, 'tiktok_access_token');

  if (!accessToken) {
    return response.status(401).json({
      ok: false,
      error: 'Connect TikTok before loading user stats',
    });
  }

  const userResponse = await fetch(`${TIKTOK_API_BASE}/v2/user/info/?fields=follower_count,following_count,likes_count,video_count`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const userData = await userResponse.json();

  if (!userResponse.ok || userData.error?.code !== 'ok') {
    return response.status(400).json({
      ok: false,
      error: userData.error?.code || 'TikTok user stats request failed',
      message: userData.error?.message,
      data: userData.data,
    });
  }

  return response.status(200).json({
    ok: true,
    stats: userData.data.user,
  });
}
