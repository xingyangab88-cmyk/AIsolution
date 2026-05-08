import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  CircleUserRound,
  ExternalLink,
  FileVideo,
  Link2,
  KeyRound,
  Send,
  ShieldCheck,
  UploadCloud,
} from 'lucide-react';
import './TikTokDemo.css';

const steps = [
  'User opens solarkhmer',
  'User clicks Continue with TikTok',
  'TikTok authorizes the requested scopes',
  'TikTok redirects to /callback',
  'solarkhmer displays basic profile data',
  'User shares or publishes a solar video to TikTok',
];

const TIKTOK_CLIENT_KEY = 'sbaw777avskqma5t3i';
const REDIRECT_URI = 'https://solarkhmer.vercel.app/callback';
const requestedScopes = 'user.info.basic,video.upload,video.publish';
const tiktokAuthorizeUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${TIKTOK_CLIENT_KEY}&scope=${requestedScopes}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=solarkhmer_sandbox_test`;
const privacyLabels = {
  PUBLIC_TO_EVERYONE: 'Public',
  MUTUAL_FOLLOW_FRIENDS: 'Friends',
  FOLLOWER_OF_CREATOR: 'Followers',
  SELF_ONLY: 'Only me',
};

const TikTokDemo = () => {
  const authParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const [signedIn, setSignedIn] = useState(authParams.get('auth') === 'success');
  const [creatorInfo, setCreatorInfo] = useState(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [creatorStatus, setCreatorStatus] = useState('');
  const [creatorError, setCreatorError] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [transferMethod, setTransferMethod] = useState('FILE_UPLOAD');
  const [caption, setCaption] = useState('SolarKhmer service update: weekly solar panel maintenance and energy check.');
  const [selectedPrivacy, setSelectedPrivacy] = useState('');
  const [draftSent, setDraftSent] = useState(false);
  const [publishSent, setPublishSent] = useState(false);
  const [shareSent, setShareSent] = useState(false);
  const [postingStatus, setPostingStatus] = useState('');
  const [postingError, setPostingError] = useState('');

  const startTikTokLogin = () => {
    setSignedIn(true);
    window.location.href = tiktokAuthorizeUrl;
  };

  const checkTikTokSession = useCallback(async () => {
    const sessionResponse = await fetch('/api/tiktok-session', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
    const sessionData = await sessionResponse.json();

    if (sessionResponse.ok && sessionData.authenticated) {
      setSignedIn(true);
    }

    setSessionChecked(true);
  }, []);

  const loadCreatorInfo = useCallback(async () => {
    setCreatorStatus('Loading TikTok creator information...');
    setCreatorError('');

    const creatorResponse = await fetch('/api/tiktok-creator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const creatorData = await creatorResponse.json();

    if (!creatorResponse.ok || !creatorData.ok) {
      setCreatorStatus('');
      setCreatorError(creatorData.message || creatorData.error || 'TikTok creator info failed');
      return;
    }

    setCreatorInfo(creatorData.creator);
    setSelectedPrivacy('');
    setCreatorStatus('TikTok account loaded. Choose privacy before posting.');
  }, []);

  useEffect(() => {
    const sessionTimer = window.setTimeout(checkTikTokSession, 0);
    return () => window.clearTimeout(sessionTimer);
  }, [checkTikTokSession]);

  useEffect(() => {
    if (sessionChecked && signedIn) {
      const loadTimer = window.setTimeout(loadCreatorInfo, 0);
      return () => window.clearTimeout(loadTimer);
    }
    return undefined;
  }, [loadCreatorInfo, sessionChecked, signedIn]);

  const uploadSelectedFile = async (uploadUrl) => {
    if (!selectedFile) {
      return;
    }

    setPostingStatus('Uploading selected video file to TikTok...');

    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': selectedFile.type || 'video/mp4',
        'Content-Range': `bytes 0-${selectedFile.size - 1}/${selectedFile.size}`,
      },
      body: selectedFile,
    });

    if (!uploadResponse.ok) {
      throw new Error(`TikTok file upload failed with HTTP ${uploadResponse.status}`);
    }
  };

  const submitTikTokPost = async (mode) => {
    setPostingStatus('Sending request to TikTok sandbox...');
    setPostingError('');
    const usesFileUpload = transferMethod === 'FILE_UPLOAD';

    const postResponse = await fetch('/api/tiktok-post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mode,
        title: caption,
        source: transferMethod,
        videoUrl: usesFileUpload ? undefined : videoUrl,
        videoSize: usesFileUpload ? selectedFile?.size : undefined,
        privacyLevel: selectedPrivacy,
      }),
    });
    const postData = await postResponse.json();

    if (!postResponse.ok || !postData.ok) {
      setPostingStatus('');
      setPostingError(postData.message || postData.error || 'TikTok post request failed');
      return;
    }

    if (usesFileUpload && postData.upload_url) {
      try {
        await uploadSelectedFile(postData.upload_url);
      } catch (error) {
        setPostingStatus('');
        setPostingError(error.message);
        return;
      }
    }

    if (mode === 'draft') {
      setDraftSent(true);
    } else {
      setPublishSent(true);
    }

    setPostingStatus(`${postData.message}. publish_id: ${postData.publish_id}`);
  };

  const canSubmit =
    signedIn &&
    creatorInfo &&
    selectedPrivacy &&
    ((transferMethod === 'FILE_UPLOAD' && selectedFile) ||
      (transferMethod === 'PULL_FROM_URL' && videoUrl));
  const selectedVideoReady =
    (transferMethod === 'FILE_UPLOAD' && selectedFile) ||
    (transferMethod === 'PULL_FROM_URL' && videoUrl);
  const pendingPostRequirement = !signedIn
    ? 'Connect TikTok first, then return to this post screen.'
    : !creatorInfo
      ? 'Load the TikTok account before posting.'
      : !selectedPrivacy
        ? 'Choose a TikTok privacy option before posting.'
        : !selectedVideoReady
          ? transferMethod === 'FILE_UPLOAD'
            ? 'Choose a video file before posting.'
            : 'Enter a verified public video URL before posting.'
          : '';

  return (
    <div className="demo-page animate-fade-in pad-y">
      <div className="container demo-container">
        <div className="demo-header">
          <div className="badge">TikTok Sandbox Integration Mockup</div>
          <h1 className="section-title">
            solarkhmer <span className="text-gradient">TikTok Integration Demo</span>
          </h1>
          <p>
            This screen demonstrates the complete TikTok flow for review: user sign-in,
            TikTok authorization, callback handling, profile data usage, Share Kit, and Content
            Posting API upload and publish actions.
          </p>
        </div>

        <div className="demo-grid">
          <section className="demo-panel">
            <div className="panel-title">
              <KeyRound size={22} />
              User Interaction
            </div>
            <p className="panel-copy">
              A solarkhmer user signs in with TikTok before viewing their solar energy dashboard.
            </p>
            <button className="tiktok-button" onClick={startTikTokLogin}>
              <span className="tiktok-mark">TikTok</span>
              Continue with TikTok
            </button>

            <div className="auth-box">
              <h3>TikTok Authorization Screen</h3>
              <p>Sandbox mockup: the user approves TikTok access for solarkhmer.</p>
              <div className="permission-row">
                <ShieldCheck size={18} />
                Scope requested: user.info.basic
              </div>
              <div className="permission-row">
                <ShieldCheck size={18} />
                Scope requested: video.upload
              </div>
              <div className="permission-row">
                <ShieldCheck size={18} />
                Scope requested: video.publish
              </div>
            </div>
          </section>

          <section className="demo-panel">
            <div className="panel-title">
              <ExternalLink size={22} />
              Callback
            </div>
            <p className="panel-copy">
              After authorization, TikTok redirects the user to the configured callback URL.
            </p>
            <div className="callback-card">
              <span>Callback URL</span>
              <strong>https://solarkhmer.vercel.app/callback</strong>
              <code>{'{"ok":true,"message":"TikTok callback received","method":"POST"}'}</code>
            </div>
          </section>
        </div>

        <div className="profile-panel">
          <div className="panel-title">
            <CircleUserRound size={22} />
            Data Used Inside solarkhmer
          </div>
          <div className="profile-grid">
            <div className="profile-card">
              {creatorInfo?.creator_avatar_url ? (
                <img className="avatar" src={creatorInfo.creator_avatar_url} alt="" />
              ) : (
                <div className="avatar">TK</div>
              )}
              <div>
                <span>{signedIn ? 'Signed in with TikTok' : 'Waiting for TikTok sign-in'}</span>
                <h3>{creatorInfo?.creator_nickname || (signedIn ? 'TikTok User' : 'Guest User')}</h3>
                <p>
                  {creatorInfo?.creator_username
                    ? `@${creatorInfo.creator_username}`
                    : signedIn
                      ? 'Authorized for sandbox posting'
                      : 'Solar dashboard profile'}
                </p>
              </div>
            </div>
            <ul className="scope-list">
              <li><CheckCircle2 size={18} /> open ID identifies the solarkhmer account.</li>
              <li><CheckCircle2 size={18} /> display name appears in the user profile.</li>
              <li><CheckCircle2 size={18} /> avatar appears beside the user profile name.</li>
              <li><CheckCircle2 size={18} /> video.upload sends selected solar videos to TikTok as drafts.</li>
              <li><CheckCircle2 size={18} /> video.publish posts user-approved solar content through TikTok.</li>
            </ul>
          </div>
          <button
            className="secondary-button"
            type="button"
            disabled={!signedIn}
            onClick={loadCreatorInfo}
          >
            Refresh TikTok Account
          </button>
          {creatorStatus && <div className="api-status active">{creatorStatus}</div>}
          {creatorError && <div className="api-status error">{creatorError}</div>}
        </div>

        <div className="posting-panel">
          <div className="panel-title">
            <FileVideo size={22} />
            Content Posting API: video.upload and video.publish
          </div>
          <p className="panel-copy">
            The user selects a solar project video, enters the caption, manually chooses a TikTok
            privacy option returned by creator_info, and clicks the final button to consent.
          </p>
          {!signedIn && (
            <div className="connection-warning">
              <AlertCircle size={18} />
              <span>Connect TikTok before sending a draft or publishing a video.</span>
              <button type="button" onClick={startTikTokLogin}>
                Continue with TikTok
              </button>
            </div>
          )}

          <div className="upload-workflow">
            <div className="video-preview">
              <div className="video-frame">
                <UploadCloud size={44} />
                <span>{selectedFile?.name || 'Select solar project video'}</span>
              </div>
              <div className="method-toggle" aria-label="Video transfer method">
                <button
                  type="button"
                  className={transferMethod === 'FILE_UPLOAD' ? 'active' : ''}
                  onClick={() => setTransferMethod('FILE_UPLOAD')}
                >
                  File upload
                </button>
                <button
                  type="button"
                  className={transferMethod === 'PULL_FROM_URL' ? 'active' : ''}
                  onClick={() => setTransferMethod('PULL_FROM_URL')}
                >
                  URL pull
                </button>
              </div>
              {transferMethod === 'FILE_UPLOAD' ? (
                <>
                  <label htmlFor="video-file">Video file</label>
                  <input
                    id="video-file"
                    type="file"
                    accept="video/mp4,video/quicktime,video/webm"
                    onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
                  />
                </>
              ) : (
                <>
                  <label htmlFor="video-url">Public video URL</label>
                  <input
                    id="video-url"
                    type="url"
                    value={videoUrl}
                    onChange={(event) => setVideoUrl(event.target.value)}
                    placeholder="https://your-verified-domain.com/video.mp4"
                  />
                </>
              )}
              <div className="audit-note">
                <AlertCircle size={18} />
                URL pull requires verified domain ownership. File upload returns an upload_url.
              </div>
            </div>

            <div className="upload-details">
              <label htmlFor="demo-caption">Caption</label>
              <textarea
                id="demo-caption"
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
              />
              <div className="privacy-options">
                <span>Choose TikTok privacy</span>
                {(creatorInfo?.privacy_level_options || ['SELF_ONLY']).map((privacyOption) => (
                  <label key={privacyOption} className="privacy-option">
                    <input
                      type="radio"
                      name="privacy-level"
                      value={privacyOption}
                      checked={selectedPrivacy === privacyOption}
                      onChange={(event) => setSelectedPrivacy(event.target.value)}
                    />
                    {privacyLabels[privacyOption] || privacyOption}
                    <small>{privacyOption}</small>
                  </label>
                ))}
              </div>
              <div className="audit-note">
                <AlertCircle size={18} />
                Until TikTok approves Direct Post audit, choose Only me / SELF_ONLY for live tests.
              </div>
              <div className="scope-note">
                <CheckCircle2 size={18} />
                Scope used: video.upload creates a TikTok draft for final editing in TikTok.
              </div>
              <button
                className="send-button"
                type="button"
                disabled={!canSubmit}
                onClick={() => submitTikTokPost('draft')}
              >
                <Send size={18} />
                Send to TikTok Draft
              </button>
              <div className={draftSent ? 'draft-status active' : 'draft-status'}>
                {draftSent
                  ? 'Draft sent to TikTok. User reviews, edits, and completes posting in TikTok.'
                  : pendingPostRequirement || 'Ready to send this video as a TikTok draft.'}
              </div>

              <div className="scope-note publish-note">
                <CheckCircle2 size={18} />
                Scope used: video.publish submits user-approved content with SELF_ONLY privacy.
              </div>
              <button
                className="publish-button"
                type="button"
                disabled={!canSubmit}
                onClick={() => submitTikTokPost('publish')}
              >
                <Send size={18} />
                Publish Selected Privacy
              </button>
              <div className={publishSent ? 'draft-status active' : 'draft-status'}>
                {publishSent
                  ? 'Approved SELF_ONLY video submitted to TikTok through the Content Posting API.'
                  : pendingPostRequirement || 'Ready to publish with the selected privacy.'}
              </div>
              {postingStatus && <div className="api-status active">{postingStatus}</div>}
              {postingError && <div className="api-status error">{postingError}</div>}
              {publishSent && (
                <a
                  className="profile-link"
                  href="https://www.tiktok.com/profile"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open TikTok profile
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="share-panel">
          <div className="panel-title">
            <Link2 size={22} />
            Share Kit
          </div>
          <p className="panel-copy">
            A user can share a public solarkhmer service update or solar productivity result to
            TikTok from inside the web app.
          </p>
          <div className="share-workflow">
            <div>
              <span>Share preview</span>
              <strong>Weekly solar output improved by 18%</strong>
              <p>Public service update from solarkhmer.</p>
            </div>
            <button className="share-button" type="button" onClick={() => setShareSent(true)}>
              <Link2 size={18} />
              Share to TikTok
            </button>
          </div>
          <div className={shareSent ? 'draft-status active' : 'draft-status'}>
            {shareSent
              ? 'Share Kit handoff opened for the selected solarkhmer update.'
              : 'Click Share to TikTok to demonstrate the Share Kit user action.'}
          </div>
        </div>

        <div className="flow-strip">
          {steps.map((step, index) => (
            <div className="flow-step" key={step}>
              <span>{index + 1}</span>
              {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TikTokDemo;
