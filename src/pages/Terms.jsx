import React from 'react';

const Terms = () => {
  return (
    <div className="pad-y animate-fade-in" style={{minHeight: '70vh'}}>
      <div className="container" style={{maxWidth: '800px'}}>
        <div className="badge" style={{marginBottom: '1rem'}}>Legal</div>
        <h1 className="section-title" style={{textAlign: 'left', marginBottom: '2rem'}}>Terms of <span className="text-gradient">Service</span></h1>
        
        <div style={{color: 'var(--text-muted)', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
          
          <section>
            <h3 style={{color: '#fff', marginBottom: '0.5rem'}}>1. Acceptance of Terms</h3>
            <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this website's particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>
          </section>

          <section>
            <h3 style={{color: '#fff', marginBottom: '0.5rem'}}>2. Use of License</h3>
            <p>Permission is granted to temporarily download one copy of the materials (information or software) on SolarEnergy's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>
          </section>

          <section>
            <h3 style={{color: '#fff', marginBottom: '0.5rem'}}>3. Disclaimer</h3>
            <p>The materials on SolarEnergy's website are provided on an 'as is' basis. SolarEnergy makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
          </section>

          <section>
            <h3 style={{color: '#fff', marginBottom: '0.5rem'}}>4. Limitations</h3>
            <p>In no event shall SolarEnergy or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on SolarEnergy's website.</p>
          </section>

          <section>
            <h3 style={{color: '#fff', marginBottom: '0.5rem'}}>5. Contact Us</h3>
            <p>If you have any questions about these Terms, please contact us at hello@solarenergy.com.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
