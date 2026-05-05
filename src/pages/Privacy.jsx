import React from 'react';

const Privacy = () => {
  return (
    <div className="pad-y animate-fade-in" style={{ minHeight: '70vh' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="badge" style={{ marginBottom: '1rem' }}>Legal</div>
        <h1 className="section-title" style={{ textAlign: 'left', marginBottom: '2rem' }}>
          solarkhmer Privacy <span className="text-gradient">Policy</span>
        </h1>

        <div style={{ color: 'var(--text-muted)', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
          <p>This Privacy Policy applies to solarkhmer, available at https://a-isolution.vercel.app/.</p>

          <section>
            <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>1. Information We Collect</h3>
            <p>At solarkhmer, we collect information to provide better services to our users. This may include contact form details, IP addresses, browser types, usage data, and basic TikTok profile information when a user signs in with TikTok Login Kit.</p>
          </section>

          <section>
            <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>2. How We Use Information</h3>
            <p>solarkhmer uses information to provide, maintain, protect, and improve the app, including solar energy workflow features and TikTok account sign-in through the user.info.basic scope.</p>
          </section>

          <section>
            <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>3. Information Sharing</h3>
            <p>We do not share personal information with companies, organizations, or individuals outside of solarkhmer unless we have user consent, need to comply with legal requirements, or use trusted service providers to operate the app.</p>
          </section>

          <section>
            <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>4. Data Security</h3>
            <p>We work to protect solarkhmer and our users from unauthorized access, alteration, disclosure, or destruction of information. We use standard safeguards during data transit and storage.</p>
          </section>

          <section>
            <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>5. Changes</h3>
            <p>solarkhmer may update this Privacy Policy from time to time. Any changes will be posted on this page.</p>
          </section>

          <section>
            <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>6. Contact Us</h3>
            <p>If you have any questions about this Privacy Policy for solarkhmer, please contact us through https://a-isolution.vercel.app/contact.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
