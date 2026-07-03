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
      error: 'Connect TikTok before loading videos',
    });
  }
  
  const { cursor, max_count } = request.body || {};

  const body = {
    max_count: max_count || 10,
  };
  if (cursor) {
    body.cursor = cursor;
  }

  const videoResponse = await fetch(`${TIKTOK_API_BASE}/v2/video/list/?fields=id,title,cover_image_url,like_count,comment_count,share_count,view_count`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const videoData = await videoResponse.json();

  if (!videoResponse.ok || videoData.error?.code !== 'ok') {
    return response.status(400).json({
      ok: false,
      error: videoData.error?.code || 'TikTok video list request failed',
      message: videoData.error?.message,
      data: videoData.data,
    });
  }

  return response.status(200).json({
    ok: true,
    data: videoData.data,
  });
}
