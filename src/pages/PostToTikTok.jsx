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
    <div className="fixed right-4 top-24 z-[1000] w-[calc(100%-2rem)] max-w-sm rounded-lg border border-white/10 bg-slate-950/95 p-4 text-sm text-white shadow-2xl shadow-black/40 backdrop-blur md:right-6">
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
  <p className="mt-2 flex items-center gap-2 text-sm text-red-300">
    <AlertCircle size={15} />
    {children}
  </p>
);

const Section = ({ icon, title, children }) => {
  const IconComponent = icon;

  return (
  <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/10 md:p-6">
    <div className="mb-5 flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-cyan-400/10 text-cyan-200">
        <IconComponent size={20} />
      </div>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
    </div>
    {children}
  </section>
  );
};

const CreatorSkeleton = () => (
  <div className="animate-pulse">
    <div className="flex items-center gap-4">
      <div className="h-16 w-16 rounded-full bg-white/10" />
      <div className="flex-1 space-y-3">
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
      <div className="space-y-4">
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
            className="inline-flex items-center justify-center gap-2 rounded-md bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
            type="button"
            onClick={onConnect}
          >
            <Send size={16} />
            Continue with TikTok
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-md border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/40 hover:bg-cyan-300/10"
            type="button"
            onClick={onUseMock}
          >
            <RefreshCw size={16} />
            Use mock data
          </button>
        </div>
      </div>
    ) : (
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
          className="inline-flex items-center justify-center gap-2 rounded-md border border-white/10 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/40 hover:bg-cyan-300/10"
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
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="overflow-hidden rounded-lg border border-white/10 bg-black">
        {previewUrl && mediaType === 'video' && (
          <video
            className="aspect-video h-full w-full object-contain"
            src={previewUrl}
            controls
            onLoadedMetadata={(event) => onDurationLoaded(event.currentTarget.duration)}
          />
        )}
        {previewUrl && mediaType === 'photo' && (
          <img className="aspect-video h-full w-full object-contain" src={previewUrl} alt="Selected upload preview" />
        )}
        {!previewUrl && (
          <div className="flex aspect-video flex-col items-center justify-center gap-3 text-slate-400">
            <FileVideo size={42} />
            <span>Select a video or photo to preview the exact media before posting</span>
          </div>
        )}
      </div>
      <div className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-200">Upload media</span>
          <input
            className="block w-full rounded-md border border-white/10 bg-slate-950 px-3 py-2 text-sm text-slate-200 file:mr-3 file:rounded-md file:border-0 file:bg-cyan-300 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-950"
            type="file"
            accept="video/mp4,video/quicktime,video/webm,image/jpeg,image/png"
            onChange={onFileChange}
          />
        </label>
        <div className="rounded-md border border-white/10 bg-slate-950/60 p-4">
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
      className="min-h-36 w-full resize-y rounded-lg border border-white/10 bg-slate-950/70 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-300/10"
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
      className="w-full appearance-none rounded-lg border border-white/10 bg-slate-950/70 px-4 py-3 text-base text-white outline-none transition focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-300/10"
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
            className={`flex items-center gap-3 rounded-md border border-white/10 p-3 ${
              item.disabled ? 'cursor-not-allowed bg-slate-900/70 text-slate-500' : 'bg-slate-950/40 text-slate-200'
            }`}
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
    <label className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-slate-950/50 p-4">
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
          <label key={key} className="flex items-center gap-3 rounded-md border border-white/10 bg-slate-950/40 p-3 text-slate-200">
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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Toast toast={toast} onClose={() => setToast(null)} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-md border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-sm font-semibold text-cyan-100">
              <Send size={15} />
              Creator review
            </p>
            <h1 className="text-3xl font-bold tracking-normal text-white sm:text-4xl">Post to TikTok</h1>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-300">
            Upload begins only after you click <span className="font-semibold text-white">Publish to TikTok</span>.
          </div>
        </header>

        {apiError && (
          <div className="mb-6 rounded-lg border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
            {apiError}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="space-y-6">
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

          <aside className="space-y-6">
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

            <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/10 md:p-6">
              <p className="text-sm text-slate-300">{consentText}</p>
              <button
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-300 px-4 py-3 font-bold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
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
                <div className="mt-4 rounded-md border border-white/10 bg-slate-950/60 p-4">
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
