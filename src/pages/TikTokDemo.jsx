import React, { useState } from 'react';
import {
  CheckCircle2,
  CircleUserRound,
  ExternalLink,
  FileVideo,
  Link2,
  KeyRound,
  Send,
  ShieldCheck,
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

const TikTokDemo = () => {
  const [signedIn, setSignedIn] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [draftSent, setDraftSent] = useState(false);
  const [publishSent, setPublishSent] = useState(false);
  const [shareSent, setShareSent] = useState(false);

  const startTikTokLogin = () => {
    setSignedIn(true);
    window.location.href = tiktokAuthorizeUrl;
  };

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
              <div className="avatar">TK</div>
              <div>
                <span>{signedIn ? 'Signed in with TikTok' : 'Waiting for TikTok sign-in'}</span>
                <h3>{signedIn ? 'TikTok User' : 'Guest User'}</h3>
                <p>Solar dashboard profile</p>
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
        </div>

        <div className="posting-panel">
          <div className="panel-title">
            <FileVideo size={22} />
            Content Posting API: video.upload and video.publish
          </div>
          <p className="panel-copy">
            This mockup demonstrates the upload and publishing flow requested for review. The user
            selects a solar project video, adds a caption, and chooses whether to create a TikTok
            draft or submit the approved post to TikTok.
          </p>

          <div className="upload-workflow">
            <div className="video-preview">
              <div className="video-frame">
                <FileVideo size={44} />
                <span>solar-panel-cleaning.mp4</span>
              </div>
              <button className="secondary-button" type="button" onClick={() => setVideoReady(true)}>
                Choose demo video
              </button>
            </div>

            <div className="upload-details">
              <label htmlFor="demo-caption">Caption</label>
              <textarea
                id="demo-caption"
                defaultValue="SolarKhmer service update: weekly solar panel maintenance and energy check."
              />
              <div className="scope-note">
                <CheckCircle2 size={18} />
                Scope used: video.upload creates a TikTok draft for final editing in TikTok.
              </div>
              <button
                className="send-button"
                type="button"
                disabled={!videoReady}
                onClick={() => setDraftSent(true)}
              >
                <Send size={18} />
                Send to TikTok Draft
              </button>
              <div className={draftSent ? 'draft-status active' : 'draft-status'}>
                {draftSent
                  ? 'Draft sent to TikTok. User reviews, edits, and completes posting in TikTok.'
                  : 'Choose a demo video first, then send it as a TikTok draft.'}
              </div>

              <div className="scope-note publish-note">
                <CheckCircle2 size={18} />
                Scope used: video.publish submits user-approved content to TikTok.
              </div>
              <button
                className="publish-button"
                type="button"
                disabled={!videoReady}
                onClick={() => setPublishSent(true)}
              >
                <Send size={18} />
                Publish Approved Video
              </button>
              <div className={publishSent ? 'draft-status active' : 'draft-status'}>
                {publishSent
                  ? 'Approved video submitted to TikTok through the Content Posting API.'
                  : 'Choose a demo video first, then publish the approved TikTok post.'}
              </div>
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
