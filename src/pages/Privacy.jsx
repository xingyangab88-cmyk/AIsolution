import React from 'react';

const Privacy = () => {
  return (
    <div className="pad-y animate-fade-in" style={{minHeight: '70vh'}}>
      <div className="container" style={{maxWidth: '800px'}}>
        <div className="badge" style={{marginBottom: '1rem'}}>Legal</div>
        <h1 className="section-title" style={{textAlign: 'left', marginBottom: '2rem'}}>Privacy <span className="text-gradient">Policy</span></h1>
        
        <div style={{color: 'var(--text-muted)', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
          
          <section>
            <h3 style={{color: '#fff', marginBottom: '0.5rem'}}>1. Information We Collect</h3>
            <p>At SolarEnergy, we collect information to provide better services to our users. This includes:</p>
            <ul style={{listStyleType: 'disc', paddingLeft: '1.5rem', marginTop: '0.5rem'}}>
              <li>Information you provide to us directly (like contact form details).</li>
              <li>Information we get from your use of our services (like IP addresses, browser types, and usage data).</li>
            </ul>
          </section>

          <section>
            <h3 style={{color: '#fff', marginBottom: '0.5rem'}}>2. How We Use Information</h3>
            <p>We use the information we collect from all our services to provide, maintain, protect and improve them, to develop new ones, and to protect SolarEnergy and our users. We also use this information to offer you tailored content and customized quotes for our solar services.</p>
          </section>

          <section>
            <h3 style={{color: '#fff', marginBottom: '0.5rem'}}>3. Information Sharing</h3>
            <p>We do not share personal information with companies, organizations, and individuals outside of SolarEnergy unless one of the following circumstances applies: with your consent, for legal reasons, or for external processing by trusted partners.</p>
          </section>

          <section>
            <h3 style={{color: '#fff', marginBottom: '0.5rem'}}>4. Data Security</h3>
            <p>We work hard to protect SolarEnergy and our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold. We use industry-standard encryption protocols during data transit and at rest.</p>
          </section>

          <section>
            <h3 style={{color: '#fff', marginBottom: '0.5rem'}}>5. Changes</h3>
            <p>Our Privacy Policy may change from time to time. We will not reduce your rights under this Privacy Policy without your explicit consent. We will post any privacy policy changes on this page.</p>
          </section>

          <section>
            <h3 style={{color: '#fff', marginBottom: '0.5rem'}}>6. Contact Us</h3>
            <p>If you have any questions about this Privacy Policy, please contact us at hello@solarenergy.com.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
