const normalizeCreatorInfo = (payload) => {
  const data = payload?.creator || payload?.data || payload;

  return {
    nickname: data.nickname || data.creator_nickname || 'TikTok Creator',
    username: data.username || data.creator_username || data.display_name || 'creator',
    avatar_url: data.avatar_url || data.creator_avatar_url || '',
    privacy_level_options: data.privacy_level_options || ['SELF_ONLY'],
    comment_disabled: Boolean(data.comment_disabled),
    duet_disabled: Boolean(data.duet_disabled),
    stitch_disabled: Boolean(data.stitch_disabled),
    max_video_post_duration_sec: Number(data.max_video_post_duration_sec || 600),
    reach_max_post_limit: Boolean(data.reach_max_post_limit),
    access_token: payload?.access_token || data.access_token || '',
  };
};

export const fetchTikTokCreatorInfo = async () => {
  const response = await fetch('/api/tiktok-creator', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || data.error || 'Unable to load TikTok creator info');
  }

  return normalizeCreatorInfo(data);
};

const readJsonResponse = async (response) => {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(text.slice(0, 160) || `Unexpected response from server (${response.status})`);
  }
};

export const fetchTikTokPostStatus = async (publishId) => {
  const response = await fetch('/api/tiktok-status', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ publishId }),
  });
  const data = await readJsonResponse(response);

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || data.error || 'Unable to fetch TikTok post status');
  }

  return data.status;
};

export const publishTikTokPost = async ({
  file,
  caption,
  privacyLevel,
  allowComments,
  allowDuet,
  allowStitch,
  promotesContent,
  yourBrand,
  brandedContent,
  isAigc,
  mediaType,
}) => {
  const response = await fetch('/api/tiktok-post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mode: 'publish',
      title: caption,
      source: 'FILE_UPLOAD',
      videoSize: file.size,
      privacyLevel,
      disableComment: !allowComments,
      disableDuet: !allowDuet,
      disableStitch: !allowStitch,
      brandOrganicToggle: promotesContent && yourBrand,
      brandContentToggle: promotesContent && brandedContent,
      isAigc,
      mediaType,
    }),
  });
  const data = await readJsonResponse(response);

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || data.error || 'TikTok publish failed');
  }

  if (data.upload_url) {
    const uploadResponse = await fetch(data.upload_url, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type || 'video/mp4',
        'Content-Range': `bytes 0-${file.size - 1}/${file.size}`,
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error(`TikTok file upload failed with HTTP ${uploadResponse.status}`);
    }
  }

  return data;
};
