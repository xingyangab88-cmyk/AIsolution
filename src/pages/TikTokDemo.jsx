import React, { useState } from 'react';
import { CheckCircle2, CircleUserRound, ExternalLink, KeyRound, ShieldCheck } from 'lucide-react';
import './TikTokDemo.css';

const steps = [
  'User opens solarkhmer',
  'User clicks Continue with TikTok',
  'TikTok Login Kit authorizes the user',
  'TikTok redirects to /callback',
  'solarkhmer displays basic profile data',
];

const TikTokDemo = () => {
  const [signedIn, setSignedIn] = useState(false);

  return (
    <div className="demo-page animate-fade-in pad-y">
      <div className="container demo-container">
        <div className="demo-header">
          <div className="badge">TikTok Login Kit Sandbox Mockup</div>
          <h1 className="section-title">
            solarkhmer <span className="text-gradient">TikTok Integration Demo</span>
          </h1>
          <p>
            This screen demonstrates the complete Login Kit flow for review: user action,
            TikTok authorization, callback handling, and user.info.basic data usage.
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
            <button className="tiktok-button" onClick={() => setSignedIn(true)}>
              <span className="tiktok-mark">♪</span>
              Continue with TikTok
            </button>

            <div className="auth-box">
              <h3>TikTok Authorization Screen</h3>
              <p>Sandbox mockup: the user approves Login Kit access for solarkhmer.</p>
              <div className="permission-row">
                <ShieldCheck size={18} />
                Scope requested: user.info.basic
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
              <li><CheckCircle2 size={18} /> No videos, ads, analytics, posting, or private data are accessed.</li>
            </ul>
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
