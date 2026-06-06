import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clipboard, KeyRound, LogIn, RefreshCw, ShieldAlert } from 'lucide-react';
import './TikTokAuthCode.css';

const storedCodeKey = 'solarkhmer_tiktok_auth_code_demo';

const getStoredAuthCode = () => {
  try {
    const storedValue = window.localStorage.getItem(storedCodeKey);
    return storedValue ? JSON.parse(storedValue) : null;
  } catch {
    return null;
  }
};

const TikTokAuthCode = () => {
  const queryParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const [storedCode, setStoredCode] = useState(() => {
    const codeFromUrl = queryParams.get('code');

    if (codeFromUrl) {
      return {
        code: codeFromUrl,
        state: queryParams.get('state') || '',
        received_at: queryParams.get('received_at') || new Date().toISOString(),
      };
    }

    return getStoredAuthCode();
  });
  const [copyStatus, setCopyStatus] = useState('');

  const authCode = queryParams.get('code') || storedCode?.code || '';
  const authState = queryParams.get('state') || storedCode?.state || '';
  const authError = queryParams.get('auth') === 'error'
    ? queryParams.get('message') || 'TikTok authorization failed'
    : '';
  const receivedAt = queryParams.get('received_at') || storedCode?.received_at || '';

  useEffect(() => {
    if (!storedCode?.code) return;

    window.localStorage.setItem(storedCodeKey, JSON.stringify(storedCode));
  }, [storedCode]);

  const startTikTokAuth = () => {
    window.location.href = '/api/tiktok-login?mode=code';
  };

  const copyAuthCode = async () => {
    if (!authCode) return;

    await navigator.clipboard?.writeText(authCode);
    setCopyStatus('Auth code copied');
  };

  const clearStoredCode = () => {
    window.localStorage.removeItem(storedCodeKey);
    setStoredCode(null);
    setCopyStatus('Stored auth code cleared');
  };

  return (
    <div className="auth-code-page animate-fade-in">
      <section className="container pad-y auth-code-container">
        <div className="auth-code-header">
          <div className="badge">TikTok Code Demo</div>
          <h1 className="section-title">
            TikTok <span className="text-gradient">Auth Code</span>
          </h1>
          <p>
            This test page receives the TikTok authorization code and stops before token exchange.
            Use the code with the client ID and client secret in the external system that creates the access token.
          </p>
        </div>

        <div className="auth-code-layout">
          <section className="auth-code-panel">
            <div className="auth-code-title">
              <KeyRound size={22} />
              <h2>Authorization Code</h2>
            </div>

            {authError ? (
              <div className="auth-code-status error">
                <ShieldAlert size={18} />
                <span>{authError}</span>
              </div>
            ) : authCode ? (
              <div className="auth-code-result">
                <div className="auth-code-status success">
                  <CheckCircle2 size={18} />
                  <span>Code received. No access token was requested.</span>
                </div>
                <label htmlFor="tiktok-auth-code">Auth code</label>
                <code id="tiktok-auth-code">{authCode}</code>
                <div className="auth-code-actions">
                  <button type="button" onClick={copyAuthCode}>
                    <Clipboard size={16} />
                    Copy code
                  </button>
                  <button type="button" className="secondary" onClick={startTikTokAuth}>
                    <RefreshCw size={16} />
                    Get new code
                  </button>
                </div>
                {copyStatus && <p className="auth-code-note">{copyStatus}</p>}
              </div>
            ) : (
              <div className="auth-code-empty">
                <p>Click the TikTok auth button to sign in and return here with only the auth code.</p>
                <button type="button" onClick={startTikTokAuth}>
                  <LogIn size={16} />
                  Continue with TikTok
                </button>
              </div>
            )}
          </section>

          <aside className="auth-code-panel auth-code-details">
            <div className="auth-code-title">
              <Clipboard size={22} />
              <h2>For External Token System</h2>
            </div>
            <dl>
              <div>
                <dt>Client ID</dt>
                <dd>Use the TikTok app client key from your boss project.</dd>
              </div>
              <div>
                <dt>Client secret</dt>
                <dd>Keep it in the external backend only. Do not paste it into this website.</dd>
              </div>
              <div>
                <dt>State</dt>
                <dd>{authState || 'Waiting for TikTok callback'}</dd>
              </div>
              <div>
                <dt>Received at</dt>
                <dd>{receivedAt || 'No code received yet'}</dd>
              </div>
            </dl>
            <button type="button" className="auth-code-clear" onClick={clearStoredCode}>
              Clear stored code
            </button>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default TikTokAuthCode;
