export const mockCreatorInfo = {
  nickname: 'Creator Name',
  username: 'creatorname',
  avatar_url: 'https://placehold.co/160x160/111827/ffffff?text=TK',
  privacy_level_options: ['PUBLIC_TO_EVERYONE', 'MUTUAL_FOLLOW_FRIENDS', 'SELF_ONLY'],
  comment_disabled: false,
  duet_disabled: false,
  stitch_disabled: true,
  max_video_post_duration_sec: 600,
};

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
  mediaType,
}) => {
  const formData = new FormData();
  formData.append('media', file);
  formData.append('caption', caption);
  formData.append('privacy_level', privacyLevel);
  formData.append('media_type', mediaType);
  formData.append('disable_comment', String(!allowComments));
  formData.append('disable_duet', String(!allowDuet));
  formData.append('disable_stitch', String(!allowStitch));
  formData.append('brand_organic_toggle', String(promotesContent && yourBrand));
  formData.append('brand_content_toggle', String(promotesContent && brandedContent));

  const response = await fetch('/api/tiktok/publish', {
    method: 'POST',
    body: formData,
  });
  const data = await response.json();

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || data.error || 'TikTok publish failed');
  }

  return data;
};
