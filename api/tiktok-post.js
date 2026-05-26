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
      error: 'Connect TikTok before posting',
    });
  }

  const {
    mode = 'publish',
    title = 'SolarKhmer service update',
    source = 'PULL_FROM_URL',
    videoUrl,
    videoSize,
    privacyLevel = 'SELF_ONLY',
    disableComment = true,
    disableDuet = true,
    disableStitch = true,
    brandOrganicToggle = false,
    brandContentToggle = false,
  } = request.body || {};

  const usesFileUpload = source === 'FILE_UPLOAD';
  const parsedVideoSize = Number(videoSize);

  if (!usesFileUpload && (!videoUrl || typeof videoUrl !== 'string')) {
    return response.status(400).json({
      ok: false,
      error: 'Video URL is required',
    });
  }

  if (usesFileUpload && (!Number.isFinite(parsedVideoSize) || parsedVideoSize <= 0)) {
    return response.status(400).json({
      ok: false,
      error: 'Video file size is required',
    });
  }

  const isPublish = mode === 'publish';
  const endpoint = isPublish
    ? '/v2/post/publish/video/init/'
    : '/v2/post/publish/inbox/video/init/';
  const sourceInfo = usesFileUpload
    ? {
        source: 'FILE_UPLOAD',
        video_size: parsedVideoSize,
        chunk_size: parsedVideoSize,
        total_chunk_count: 1,
      }
    : {
        source: 'PULL_FROM_URL',
        video_url: videoUrl,
      };
  const payload = isPublish
    ? {
        post_info: {
          title,
          privacy_level: privacyLevel,
          disable_duet: Boolean(disableDuet),
          disable_comment: Boolean(disableComment),
          disable_stitch: Boolean(disableStitch),
          brand_organic_toggle: Boolean(brandOrganicToggle),
          brand_content_toggle: Boolean(brandContentToggle),
        },
        source_info: sourceInfo,
      }
    : {
        source_info: sourceInfo,
      };

  const postResponse = await fetch(`${TIKTOK_API_BASE}${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(payload),
  });

  const postData = await postResponse.json();

  if (!postResponse.ok || postData.error?.code !== 'ok') {
    return response.status(400).json({
      ok: false,
      error: postData.error?.code || 'TikTok post request failed',
      message: postData.error?.message,
      log_id: postData.error?.log_id,
      data: postData.data,
    });
  }

  return response.status(200).json({
    ok: true,
    mode,
    publish_id: postData.data?.publish_id,
    upload_url: postData.data?.upload_url,
    message: isPublish
      ? `Video publish initialized with ${privacyLevel} privacy`
      : 'Video draft upload initialized',
    data: postData.data,
  });
}
