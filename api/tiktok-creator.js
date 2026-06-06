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
      error: 'Connect TikTok before loading creator information',
    });
  }

  const creatorResponse = await fetch(`${TIKTOK_API_BASE}/v2/post/publish/creator_info/query/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=UTF-8',
    },
  });

  const creatorData = await creatorResponse.json();

  if (!creatorResponse.ok || creatorData.error?.code !== 'ok') {
    return response.status(400).json({
      ok: false,
      error: creatorData.error?.code || 'TikTok creator info request failed',
      message: creatorData.error?.message,
      log_id: creatorData.error?.log_id,
      data: creatorData.data,
    });
  }

  return response.status(200).json({
    ok: true,
    access_token: accessToken,
    creator: creatorData.data,
  });
}
