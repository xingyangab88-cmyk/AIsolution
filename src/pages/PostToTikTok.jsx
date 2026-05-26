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
  RefreshCw,
  Send,
  Sparkles,
  UserRound,
} from 'lucide-react';
import {
  fetchTikTokCreatorInfo,
  mockCreatorInfo,
  publishTikTokPost,
} from '../lib/tiktokPostingApi';
import './PostToTikTok.css';

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

const ConnectedAccount = ({ creatorInfo, loading, error, onConnect, onUseMock }) => (
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
          <button
            className="tiktok-secondary-small"
            type="button"
            onClick={onUseMock}
          >
            <RefreshCw size={16} />
            Use mock data
          </button>
        </div>
      </div>
    ) : (
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
        <button
          className="tiktok-secondary-small"
          type="button"
          onClick={onUseMock}
        >
          <RefreshCw size={16} />
          Use mock data
        </button>
      </div>
    )}
  </Section>
);

const VideoPreview = ({ file, previewUrl, duration, durationError, onDurationLoaded, onFileChange, mediaType }) => (
  <Section icon={mediaType === 'photo' ? ImageIcon : FileVideo} title="Media preview">
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
          <img className="tiktok-video" src={previewUrl} alt="Selected upload preview" />
        )}
        {!previewUrl && (
          <div className="tiktok-video-empty">
            <FileVideo size={42} />
            <span>Select a video or photo to preview the exact media before posting</span>
          </div>
        )}
      </div>
      <div className="tiktok-media-details">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-200">Upload media</span>
          <input
            className="tiktok-file-input"
            type="file"
            accept="video/mp4,video/quicktime,video/webm,image/jpeg,image/png"
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

const PrivacySelector = ({ options, value, setValue, error }) => (
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
      <option value="">Select privacy</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {privacyLabels[option] || option}
        </option>
      ))}
    </select>
    {error && <FieldError>{error}</FieldError>}
  </Section>
);

const InteractionSettings = ({ mediaType, creatorInfo, interactions, setInteractions }) => {
  const items = [
    { key: 'allowComments', label: 'Allow comments', disabled: creatorInfo.comment_disabled },
    { key: 'allowDuet', label: 'Allow duet', disabled: creatorInfo.duet_disabled, videoOnly: true },
    { key: 'allowStitch', label: 'Allow stitch', disabled: creatorInfo.stitch_disabled, videoOnly: true },
  ].filter((item) => mediaType === 'video' || !item.videoOnly);

  return (
    <Section icon={Sparkles} title="Interaction settings">
      <div className="space-y-3">
        {items.map((item) => (
          <label
            key={item.key}
            className={`tiktok-check-row ${item.disabled ? 'is-disabled' : ''}`}
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

const CommercialDisclosure = ({ disclosure, setDisclosure, error }) => (
  <Section icon={Music2} title="Commercial content disclosure">
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
          ['yourBrand', 'Your brand'],
          ['brandedContent', 'Branded content'],
        ].map(([key, label]) => (
          <label key={key} className="tiktok-check-row">
            <input
              className="h-5 w-5 rounded border-white/20 bg-slate-950 text-cyan-300"
              type="checkbox"
              checked={disclosure[key]}
              onChange={(event) => setDisclosure((current) => ({ ...current, [key]: event.target.checked }))}
            />
            {label}
          </label>
        ))}
      </div>
    )}
    {error && <FieldError>{error}</FieldError>}
  </Section>
);

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
  });
  const [disclosure, setDisclosure] = useState({
    promotesContent: false,
    yourBrand: false,
    brandedContent: false,
  });
  const [publishState, setPublishState] = useState('idle');
  const [toast, setToast] = useState(null);
  const [apiError, setApiError] = useState('');

  const mediaType = file?.type?.startsWith('image/') ? 'photo' : 'video';
  const activeCreatorInfo = creatorInfo || mockCreatorInfo;

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
            message: 'Connect TikTok first, or use mock data only for a review demo recording.',
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
    if (
      mediaType === 'video' &&
      Number.isFinite(duration) &&
      duration > activeCreatorInfo.max_video_post_duration_sec
    ) {
      errors.duration = `Video duration must be ${activeCreatorInfo.max_video_post_duration_sec} seconds or less.`;
    }
    if (
      disclosure.promotesContent &&
      !disclosure.yourBrand &&
      !disclosure.brandedContent
    ) {
      errors.disclosure = 'Choose Your brand, Branded content, or both.';
    }
    return errors;
  }, [activeCreatorInfo.max_video_post_duration_sec, caption, creatorInfo, disclosure, duration, file, mediaType, privacy]);

  const canPublish = Object.keys(validation).length === 0 && publishState !== 'uploading' && publishState !== 'processing';
  const consentText = disclosure.brandedContent
    ? "By posting, you agree to TikTok's Branded Content Policy and Music Usage Confirmation."
    : "By posting, you agree to TikTok's Music Usage Confirmation.";

  const handlePublish = async () => {
    if (!canPublish) return;

    setPublishState('uploading');
    setApiError('');

    try {
      await publishTikTokPost({
        file,
        caption,
        privacyLevel: privacy,
        allowComments: !activeCreatorInfo.comment_disabled && interactions.allowComments,
        allowDuet: mediaType === 'video' && !activeCreatorInfo.duet_disabled && interactions.allowDuet,
        allowStitch: mediaType === 'video' && !activeCreatorInfo.stitch_disabled && interactions.allowStitch,
        promotesContent: disclosure.promotesContent,
        yourBrand: disclosure.yourBrand,
        brandedContent: disclosure.brandedContent,
        mediaType,
      });

      setPublishState('processing');
      window.setTimeout(() => {
        setPublishState('success');
        setToast({
          type: 'success',
          title: 'Successfully posted to TikTok',
          message: 'It may take a few minutes for your content to process and appear on your TikTok profile.',
        });
      }, 900);
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
            Upload begins only after you click <span className="font-semibold text-white">Publish to TikTok</span>.
          </div>
        </header>

        {apiError && (
          <div className="mb-6 rounded-lg border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
            {apiError}
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
              onUseMock={() => {
                setCreatorInfo(mockCreatorInfo);
                setCreatorLoading(false);
                setApiError('');
              }}
            />
            <VideoPreview
              file={file}
              previewUrl={previewUrl}
              duration={duration}
              durationError={validation.duration}
              mediaType={mediaType}
              onDurationLoaded={setDuration}
              onFileChange={(event) => {
                const nextFile = event.target.files?.[0] || null;
                if (previewUrl) URL.revokeObjectURL(previewUrl);
                setFile(nextFile);
                setDuration(null);
                setPreviewUrl(nextFile ? URL.createObjectURL(nextFile) : '');
              }}
            />
            <CaptionField caption={caption} setCaption={setCaption} error={validation.caption} />
          </div>

          <aside className="tiktok-side-column">
            <PrivacySelector
              options={activeCreatorInfo.privacy_level_options}
              value={privacy}
              setValue={setPrivacy}
              error={validation.privacy}
            />
            <InteractionSettings
              mediaType={mediaType}
              creatorInfo={activeCreatorInfo}
              interactions={interactions}
              setInteractions={setInteractions}
            />
            <CommercialDisclosure
              disclosure={disclosure}
              setDisclosure={setDisclosure}
              error={validation.disclosure}
            />

            <section className="tiktok-publish-card">
              <p className="text-sm text-slate-300">{consentText}</p>
              <button
                className="tiktok-publish-button"
                type="button"
                disabled={!canPublish}
                onClick={handlePublish}
              >
                {(publishState === 'uploading' || publishState === 'processing') && <Loader2 className="animate-spin" size={18} />}
                Publish to TikTok
              </button>
              {!validation.file && !validation.caption && !validation.privacy && !validation.disclosure ? null : (
                <p className="mt-3 text-sm text-slate-400">Complete the required review choices to enable publishing.</p>
              )}
              {statusText && (
                <div className="tiktok-status-card">
                  <p className="font-semibold text-white">{statusText}</p>
                  <p className="mt-2 text-sm text-slate-300">
                    It may take a few minutes for your content to process and appear on your TikTok profile.
                  </p>
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
