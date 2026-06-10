import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Check,
  ChevronDown,
  Clock3,
  FileVideo,
  Image as ImageIcon,
  Loader2,
  MessageCircle,
  Music2,
  Send,
  Sparkles,
  UserRound,
} from 'lucide-react';
import {
  fetchTikTokCreatorInfo,
  fetchTikTokPostStatus,
  publishTikTokPost,
} from '../lib/tiktokPostingApi';
import './PostToTikTok.css';

const directPostApproved = import.meta.env.VITE_TIKTOK_DIRECT_POST_APPROVED === 'true';

const privacyLabels = {
  PUBLIC_TO_EVERYONE: 'Public',
  MUTUAL_FOLLOW_FRIENDS: 'Friends',
  FOLLOWER_OF_CREATOR: 'Followers',
  SELF_ONLY: 'Only me',
};

const formatDuration = (seconds) => {
  if (!Number.isFinite(seconds)) return 'Awaiting media';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
};

const Toast = ({ toast, onClose }) => {
  if (!toast) return null;

  return (
    <div className="tiktok-toast">
      <div className="flex items-start gap-3">
        <span className={toast.type === 'success' ? 'text-emerald-300' : 'text-red-300'}>
          {toast.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{toast.title}</p>
          <p className="mt-1 text-slate-300">{toast.message}</p>
        </div>
        <button className="text-slate-400 hover:text-white" type="button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

const FieldError = ({ children }) => (
  <p className="tiktok-field-error">
    <AlertCircle size={15} />
    {children}
  </p>
);

const Section = ({ icon, title, children }) => {
  const IconComponent = icon;

  return (
  <section className="tiktok-card">
    <div className="tiktok-card-title">
      <div className="tiktok-card-icon">
        <IconComponent size={20} />
      </div>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
    </div>
    {children}
  </section>
  );
};

const CreatorSkeleton = () => (
  <div className="animate-pulse tiktok-skeleton">
    <div className="flex items-center gap-4">
      <div className="h-16 w-16 rounded-full bg-white/10" />
      <div className="tiktok-skeleton-lines">
        <div className="h-4 w-36 rounded bg-white/10" />
        <div className="h-3 w-24 rounded bg-white/10" />
      </div>
    </div>
  </div>
);

const wait = (milliseconds) => new Promise((resolve) => {
  window.setTimeout(resolve, milliseconds);
});

const ConnectedAccount = ({ creatorInfo, loading, error, onConnect }) => (
  <Section icon={UserRound} title="Connected account">
    {loading ? (
      <CreatorSkeleton />
    ) : !creatorInfo ? (
      <div className="tiktok-empty-account">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-slate-800 text-lg font-bold">
            TK
          </div>
          <div>
            <p className="text-sm text-slate-400">TikTok account</p>
            <p className="text-xl font-semibold text-white">Not connected</p>
            <p className="text-slate-300">Continue with TikTok to load your account here.</p>
          </div>
        </div>
        {error && <FieldError>{error}</FieldError>}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            className="tiktok-primary-small"
            type="button"
            onClick={onConnect}
          >
            <Send size={16} />
            Continue with TikTok
          </button>
        </div>
      </div>
    ) : (
      <>
        <div className="tiktok-account-row">
          <div className="flex min-w-0 items-center gap-4">
            {creatorInfo.avatar_url ? (
              <img
                className="h-16 w-16 rounded-full border border-white/10 object-cover"
                src={creatorInfo.avatar_url}
                alt={`${creatorInfo.nickname} TikTok avatar`}
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-slate-800 text-lg font-bold">
                TK
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm text-slate-400">Connected account</p>
              <p className="truncate text-xl font-semibold text-white">{creatorInfo.nickname}</p>
              <p className="truncate text-slate-300">@{creatorInfo.username}</p>
            </div>
          </div>
        </div>
        {creatorInfo.access_token && (
          <div className="tiktok-token-box">
            <p>Access token</p>
            <code>{creatorInfo.access_token}</code>
            <button
              className="tiktok-secondary-small"
              type="button"
              onClick={() => navigator.clipboard?.writeText(creatorInfo.access_token)}
            >
              Copy token
            </button>
          </div>
        )}
      </>
    )}
  </Section>
);

const VideoPreview = ({ file, previewUrl, duration, durationError, onDurationLoaded, onFileChange, mediaType }) => (
  <Section icon={FileVideo} title="Media preview">
    <div className="tiktok-media-grid">
      <div className="tiktok-video-shell">
        {previewUrl && mediaType === 'video' && (
          <video
            className="tiktok-video"
            src={previewUrl}
            controls
            onLoadedMetadata={(event) => onDurationLoaded(event.currentTarget.duration)}
          />
        )}
        {previewUrl && mediaType === 'photo' && (
          <img
            className="tiktok-image-preview object-contain h-full w-full"
            src={previewUrl}
            alt="Preview"
            onLoad={() => onDurationLoaded(null)}
          />
        )}
        {!previewUrl && (
          <div className="tiktok-video-empty">
            <FileVideo size={42} />
            <span>Select media to preview before posting</span>
          </div>
        )}
      </div>
      <div className="tiktok-media-details">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-200">Upload media</span>
          <input
            className="tiktok-file-input"
            type="file"
            accept="video/mp4,video/quicktime,video/webm,image/jpeg,image/png,image/webp"
            onChange={onFileChange}
          />
        </label>
        <div className="tiktok-file-meta">
          <p className="truncate font-semibold text-white">{file?.name || 'No file selected'}</p>
          <p className="mt-2 flex items-center gap-2 text-sm text-slate-300">
            <Clock3 size={16} />
            {mediaType === 'photo' ? 'Photo post' : formatDuration(duration)}
          </p>
        </div>
        {durationError && <FieldError>{durationError}</FieldError>}
      </div>
    </div>
  </Section>
);

const CaptionField = ({ caption, setCaption, error }) => (
  <Section icon={MessageCircle} title="Caption">
    <label htmlFor="tiktok-caption" className="mb-2 block text-sm font-semibold text-slate-200">
      Caption
    </label>
    <textarea
      id="tiktok-caption"
      className="tiktok-textarea"
      value={caption}
      onChange={(event) => setCaption(event.target.value)}
      placeholder="Write your caption. Hashtags are allowed."
    />
    <p className="mt-2 text-sm text-slate-400">{caption.length} characters</p>
    {error && <FieldError>{error}</FieldError>}
  </Section>
);

const PrivacySelector = ({ options, value, setValue, error, brandedContentSelected }) => (
  <Section icon={ChevronDown} title="Privacy">
    <label htmlFor="privacy-level" className="mb-2 block text-sm font-semibold text-slate-200">
      Privacy
    </label>
    <select
      id="privacy-level"
      className="tiktok-select"
      value={value}
      onChange={(event) => setValue(event.target.value)}
    >
      <option value="">Select who can view this post</option>
      {options.map((option) => (
        <option
          key={option}
          value={option}
          disabled={brandedContentSelected && option === 'SELF_ONLY'}
          title={brandedContentSelected && option === 'SELF_ONLY' ? "Branded content visibility cannot be set to private." : undefined}
        >
          {privacyLabels[option] || option}
          {brandedContentSelected && option === 'SELF_ONLY'
            ? ' - unavailable for branded content'
            : ''}
        </option>
      ))}
    </select>
    {brandedContentSelected && (
      <p className="tiktok-help-text">Branded content visibility cannot be set to private.</p>
    )}
    {error && <FieldError>{error}</FieldError>}
  </Section>
);

const InteractionSettings = ({ mediaType, creatorInfo, interactions, setInteractions }) => {
  const items = [
    { key: 'allowComments', label: 'Allow comments', disabled: creatorInfo.comment_disabled },
    { key: 'allowDuet', label: 'Allow duet', disabled: creatorInfo.duet_disabled, videoOnly: true },
    { key: 'allowStitch', label: 'Allow stitch', disabled: creatorInfo.stitch_disabled, videoOnly: true },
    { key: 'autoAddMusic', label: 'Auto-add music', photoOnly: true },
  ].filter((item) => {
    if (item.videoOnly && mediaType !== 'video') return false;
    if (item.photoOnly && mediaType !== 'photo') return false;
    return true;
  });

  return (
    <Section icon={Sparkles} title="Interaction settings">
      <div className="space-y-3">
        {items.map((item) => (
          <label
            key={item.key}
            className={`tiktok-check-row ${item.disabled ? 'is-disabled' : ''}`}
            title={item.disabled ? 'Turned off in your TikTok account settings.' : undefined}
          >
            <input
              className="h-5 w-5 rounded border-white/20 bg-slate-950 text-cyan-300"
              type="checkbox"
              checked={item.disabled ? false : interactions[item.key]}
              disabled={item.disabled}
              onChange={(event) => setInteractions((current) => ({ ...current, [item.key]: event.target.checked }))}
            />
            {item.label}
          </label>
        ))}
      </div>
    </Section>
  );
};

const CommercialDisclosure = ({ disclosure, setDisclosure, error, privacy }) => {
  const isPrivateVisibility = privacy === 'SELF_ONLY';
  const labelText = disclosure.brandedContent
    ? "Your photo/video will be labeled as 'Paid partnership'"
    : disclosure.yourBrand
      ? "Your photo/video will be labeled as 'Promotional content'"
      : '';

  return (
  <Section icon={Music2} title="Content disclosure">
    <label className="tiktok-toggle-row">
      <span className="font-semibold text-white">Does this content promote yourself, a brand, product or service?</span>
      <input
        className="h-6 w-11 rounded-full"
        type="checkbox"
        checked={disclosure.promotesContent}
        onChange={(event) =>
          setDisclosure((current) => ({
            ...current,
            promotesContent: event.target.checked,
            yourBrand: event.target.checked ? current.yourBrand : false,
            brandedContent: event.target.checked ? current.brandedContent : false,
          }))
        }
      />
    </label>
    {disclosure.promotesContent && (
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {[
          ['yourBrand', 'Your brand', false],
          ['brandedContent', 'Branded content', isPrivateVisibility],
        ].map(([key, label, disabled]) => (
          <label
            key={key}
            className={`tiktok-check-row ${disabled ? 'is-disabled' : ''}`}
            title={disabled ? "Branded content visibility cannot be set to private." : undefined}
          >
            <input
              className="h-5 w-5 rounded border-white/20 bg-slate-950 text-cyan-300"
              type="checkbox"
              checked={disclosure[key]}
              disabled={disabled}
              onChange={(event) => setDisclosure((current) => ({ ...current, [key]: event.target.checked }))}
            />
            {label}
          </label>
        ))}
      </div>
    )}
    {labelText && <p className="tiktok-disclosure-label">{labelText}</p>}
    {isPrivateVisibility && disclosure.promotesContent && (
      <p className="tiktok-help-text">Choose Public or Friends before selecting Branded content.</p>
    )}
    
    <div className="mt-4 border-t border-white/10 pt-4">
      <label className="tiktok-toggle-row">
        <div>
          <span className="font-semibold text-white">AI-generated content</span>
          <p className="mt-1 text-sm text-slate-400 font-normal">Label content that is fully or significantly generated by AI</p>
        </div>
        <input
          className="h-6 w-11 rounded-full shrink-0"
          type="checkbox"
          checked={disclosure.isAigc}
          onChange={(event) =>
            setDisclosure((current) => ({
              ...current,
              isAigc: event.target.checked,
            }))
          }
        />
      </label>
      {disclosure.isAigc && (
        <p className="tiktok-disclosure-label mt-3">Your photo/video will be labeled as 'Creator labeled as AI-generated'</p>
      )}
    </div>

    {error && <FieldError>{error}</FieldError>}
  </Section>
  );
};

const PostToTikTok = () => {
  const [creatorInfo, setCreatorInfo] = useState(null);
  const [creatorLoading, setCreatorLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [duration, setDuration] = useState(null);
  const [caption, setCaption] = useState('');
  const [privacy, setPrivacy] = useState('');
  const [interactions, setInteractions] = useState({
    allowComments: false,
    allowDuet: false,
    allowStitch: false,
    autoAddMusic: false,
  });
  const [disclosure, setDisclosure] = useState({
    promotesContent: false,
    yourBrand: false,
    brandedContent: false,
    isAigc: false,
  });
  const [publishState, setPublishState] = useState('idle');
  const [publishStatus, setPublishStatus] = useState(null);
  const [toast, setToast] = useState(null);
  const [apiError, setApiError] = useState('');

  const mediaType = file?.type?.startsWith('image/') ? 'photo' : 'video';
  const creatorAccountLooksPublic = Boolean(
    creatorInfo?.privacy_level_options?.includes('PUBLIC_TO_EVERYONE'),
  );
  const unauditedPrivateAccountRequired = !directPostApproved && creatorAccountLooksPublic;

  useEffect(() => {
    let active = true;

    fetchTikTokCreatorInfo()
      .then((info) => {
        if (active) setCreatorInfo(info);
      })
      .catch((error) => {
        if (active) {
          setApiError(error.message);
          setToast({
            type: 'error',
            title: 'Creator info unavailable',
            message: 'Connect TikTok first, then return to this posting screen.',
          });
        }
      })
      .finally(() => {
        if (active) setCreatorLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const validation = useMemo(() => {
    const errors = {};
    if (!file) errors.file = 'Select the media you want to publish.';
    if (!creatorInfo) errors.account = 'Connect TikTok before publishing.';
    if (!caption.trim()) errors.caption = 'Caption is required and must remain editable by the creator.';
    if (!privacy) errors.privacy = 'Choose a privacy option returned by TikTok creator_info.';
    if (!directPostApproved && privacy && privacy !== 'SELF_ONLY') {
      errors.privacy = 'Before Direct Post audit approval, TikTok only allows SELF_ONLY posting.';
    }
    if (unauditedPrivateAccountRequired) {
      errors.account = 'Before Direct Post audit approval, TikTok requires posting test accounts to be private. Set your TikTok account to private, then reconnect.';
    }
    if (
      mediaType === 'video' &&
      Number.isFinite(duration) &&
      creatorInfo &&
      duration > creatorInfo.max_video_post_duration_sec
    ) {
      errors.duration = `Video duration must be ${creatorInfo.max_video_post_duration_sec} seconds or less.`;
    }
    if (creatorInfo?.reach_max_post_limit) {
      errors.account = 'You have reached your daily posting limit. Please try again later.';
    }
    if (
      disclosure.promotesContent &&
      !disclosure.yourBrand &&
      !disclosure.brandedContent
    ) {
      errors.disclosure = 'Choose Your brand, Branded content, or both.';
    }
    if (disclosure.brandedContent && privacy === 'SELF_ONLY') {
      errors.disclosure = 'Branded content visibility cannot be set to private.';
    }
    return errors;
  }, [caption, creatorInfo, disclosure, duration, file, mediaType, privacy, unauditedPrivateAccountRequired]);

  const canPublish = Object.keys(validation).length === 0 && publishState !== 'uploading' && publishState !== 'processing';
  const consentText = disclosure.brandedContent
    ? "By posting, you agree to TikTok's Branded Content Policy and Music Usage Confirmation."
    : "By posting, you agree to TikTok's Music Usage Confirmation.";

  const handlePublish = async () => {
    if (!canPublish) return;

    setPublishState('uploading');
    setPublishStatus(null);
    setApiError('');

    try {
      const publishResult = await publishTikTokPost({
        file,
        caption,
        privacyLevel: privacy,
        allowComments: !creatorInfo.comment_disabled && interactions.allowComments,
        allowDuet: mediaType === 'video' && !creatorInfo.duet_disabled && interactions.allowDuet,
        allowStitch: mediaType === 'video' && !creatorInfo.stitch_disabled && interactions.allowStitch,
        autoAddMusic: mediaType === 'photo' && interactions.autoAddMusic,
        promotesContent: disclosure.promotesContent,
        yourBrand: disclosure.yourBrand,
        brandedContent: disclosure.brandedContent,
        isAigc: disclosure.isAigc,
        mediaType,
      });

      setPublishState('processing');
      setPublishStatus({ status: 'PROCESSING_UPLOAD' });

      if (!publishResult.publish_id) {
        setToast({
          type: 'success',
          title: 'Upload submitted to TikTok',
          message: 'It may take a few minutes for your content to process and appear on your TikTok profile.',
        });
        return;
      }

      for (let attempt = 0; attempt < 10; attempt += 1) {
        await wait(attempt === 0 ? 1800 : 4000);
        const nextStatus = await fetchTikTokPostStatus(publishResult.publish_id);
        setPublishStatus(nextStatus);

        if (nextStatus.status === 'PUBLISH_COMPLETE') {
          setPublishState('success');
          setToast({
            type: 'success',
            title: 'Successfully posted to TikTok',
            message: 'It may take a few minutes for your content to process and appear on your TikTok profile.',
          });
          return;
        }

        if (nextStatus.status === 'FAILED') {
          throw new Error(nextStatus.fail_reason || 'TikTok processing failed');
        }
      }

      setToast({
        type: 'success',
        title: 'TikTok is still processing',
        message: 'Processing can take a few minutes. The status panel will show the latest state returned by TikTok.',
      });
    } catch (error) {
      setPublishState('idle');
      setApiError(error.message);
      setToast({ type: 'error', title: 'Publish failed', message: error.message });
    }
  };

  const statusText = publishState === 'uploading'
    ? 'Uploading...'
    : publishState === 'processing'
      ? 'Processing...'
      : publishState === 'success'
        ? 'Successfully posted to TikTok'
        : '';

  return (
    <div className="tiktok-post-page">
      <Toast toast={toast} onClose={() => setToast(null)} />
      <div className="tiktok-post-container">
        <header className="tiktok-post-header">
          <div>
            <p className="tiktok-eyebrow">
              <Send size={15} />
              Creator review
            </p>
            <h1 className="text-3xl font-bold tracking-normal text-white sm:text-4xl">Post to TikTok</h1>
          </div>
          <div className="tiktok-submit-note">
            Upload begins only after you click <span className="font-semibold text-white">Share to TikTok</span>.
          </div>
        </header>

        {apiError && (
          <div className="mb-6 rounded-lg border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
            {apiError}
          </div>
        )}
        {validation.account && creatorInfo && (
          <div className="mb-6 rounded-lg border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
            {validation.account}
          </div>
        )}

        <div className="tiktok-layout">
          <div className="tiktok-main-column">
            <ConnectedAccount
              creatorInfo={creatorInfo}
              loading={creatorLoading}
              error={apiError}
              onConnect={() => {
                window.location.href = '/api/tiktok-login';
              }}
            />
            <VideoPreview
              file={file}
              previewUrl={previewUrl}
              duration={duration}
              durationError={validation.duration}
              onDurationLoaded={setDuration}
              onFileChange={(event) => {
                const nextFile = event.target.files?.[0] || null;
                if (previewUrl) URL.revokeObjectURL(previewUrl);
                setFile(nextFile);
                setDuration(null);
                setPreviewUrl(nextFile ? URL.createObjectURL(nextFile) : '');
              }}
              mediaType={mediaType}
            />
            <CaptionField caption={caption} setCaption={setCaption} error={validation.caption} />
          </div>

          <aside className="tiktok-side-column">
            <PrivacySelector
              options={creatorInfo?.privacy_level_options || []}
              value={privacy}
              setValue={setPrivacy}
              error={validation.privacy}
              brandedContentSelected={disclosure.brandedContent}
            />
            <InteractionSettings
              mediaType={mediaType}
              creatorInfo={creatorInfo || {
                comment_disabled: true,
                duet_disabled: true,
                stitch_disabled: true,
              }}
              interactions={interactions}
              setInteractions={setInteractions}
            />
            <CommercialDisclosure
              disclosure={disclosure}
              setDisclosure={setDisclosure}
              error={validation.disclosure}
              privacy={privacy}
            />

            <section className="tiktok-publish-card">
              <p className="text-sm text-slate-300">{consentText}</p>
              <div 
                className="w-full" 
                title={disclosure.promotesContent && !disclosure.yourBrand && !disclosure.brandedContent ? "You need to indicate if your content promotes yourself, a third party, or both." : undefined}
              >
                <button
                  className="tiktok-publish-button"
                  type="button"
                  disabled={!canPublish}
                  onClick={handlePublish}
                  style={!canPublish ? { pointerEvents: 'none' } : undefined}
                >
                  {(publishState === 'uploading' || publishState === 'processing') && <Loader2 className="animate-spin" size={18} />}
                  Share to TikTok
                </button>
              </div>
              {!validation.file && !validation.caption && !validation.privacy && !validation.disclosure ? null : (
                <p className="mt-3 text-sm text-slate-400">Complete the required review choices to enable publishing.</p>
              )}
              {statusText && (
                <div className="tiktok-status-card">
                  <p className="font-semibold text-white">{statusText}</p>
                  <p className="mt-2 text-sm text-slate-300">
                    It may take a few minutes for your content to process and appear on your TikTok profile.
                  </p>
                  {publishStatus?.status && (
                    <p className="mt-2 text-sm text-cyan-100">TikTok status: {publishStatus.status}</p>
                  )}
                  {publishStatus?.publicly_available_post_id?.[0] && (
                    <p className="mt-2 text-sm text-cyan-100">Post ID: {publishStatus.publicly_available_post_id[0]}</p>
                  )}
                  {publishStatus?.fail_reason && (
                    <p className="mt-2 text-sm text-red-200">Reason: {publishStatus.fail_reason}</p>
                  )}
                </div>
              )}
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PostToTikTok;
