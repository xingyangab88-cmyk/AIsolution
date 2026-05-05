import React from 'react';

const Terms = () => {
  return (
    <div className="pad-y animate-fade-in" style={{ minHeight: '70vh' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="badge" style={{ marginBottom: '1rem' }}>Legal</div>
        <h1 className="section-title" style={{ textAlign: 'left', marginBottom: '2rem' }}>
          solarkhmer Terms of <span className="text-gradient">Service</span>
        </h1>

        <div style={{ color: 'var(--text-muted)', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
          <p>These Terms of Service apply to solarkhmer, available at https://solarkhmer.vercel.app/.</p>

          <section>
            <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>1. Acceptance of Terms</h3>
            <p>By accessing and using solarkhmer at https://solarkhmer.vercel.app/, you accept and agree to be bound by these Terms of Service. When using solarkhmer services, you may also be subject to posted guidelines or rules applicable to those services.</p>
          </section>

          <section>
            <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>2. Use of License</h3>
            <p>Permission is granted to temporarily access solarkhmer materials for personal, non-commercial viewing only. This is the grant of a license, not a transfer of title.</p>
          </section>

          <section>
            <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>3. Disclaimer</h3>
            <p>The materials on solarkhmer are provided on an as-is basis. solarkhmer makes no warranties, expressed or implied, and disclaims all other warranties including implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement.</p>
          </section>

          <section>
            <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>4. Limitations</h3>
            <p>In no event shall solarkhmer or its suppliers be liable for damages arising out of the use or inability to use solarkhmer or its materials.</p>
          </section>

          <section>
            <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>5. Contact Us</h3>
            <p>If you have any questions about these Terms for solarkhmer, please contact us through https://solarkhmer.vercel.app/contact.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
