import { useEffect } from 'react';

const TermsAndConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="terms-page" style={{ backgroundColor: '#f8f9fa', padding: '60px 0' }}>
      <div className="container">
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Header Section */}
          <div className="section-header text-center" style={{ marginBottom: '50px' }}>
            <span className="subtitle" style={{ color: 'var(--color-gold)', letterSpacing: '4px' }}>TRX GUIDELINES</span>
            <h1 style={{ fontSize: '3rem', color: 'var(--color-navy)', fontWeight: '900' }}>Terms of Service</h1>
            <div className="divider mx-auto" style={{ background: 'var(--color-gold)' }}></div>
            <p style={{ color: 'var(--color-dark-gray)', opacity: 0.7 }}>Last Updated: April 2024</p>
          </div>

          <div style={{ 
            backgroundColor: 'white', 
            padding: '50px', 
            borderRadius: 'var(--radius-lg)', 
            boxShadow: 'var(--shadow-md)',
            lineHeight: '1.8',
            color: 'var(--color-dark-gray)'
          }}>
            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--color-navy)', marginBottom: '20px' }}>1. Agreement to Terms</h2>
              <p>By accessing the website at <strong>The Realty Xperts (TRX)</strong>, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--color-navy)', marginBottom: '20px' }}>2. Use License</h2>
              <p>Permission is granted to temporarily view the materials (information or images) on TRX&apos;s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
              <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
                <li>Modify or copy the materials;</li>
                <li>Use the materials for any commercial purpose, or for any public display;</li>
                <li>Attempt to decompile or reverse engineer any software contained on TRX&apos;s website;</li>
                <li>Remove any copyright or other proprietary notations from the materials.</li>
              </ul>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--color-navy)', marginBottom: '20px' }}>3. Real Estate Disclaimer</h2>
              <p>The materials on TRX&apos;s website are provided on an &apos;as is&apos; basis. While we strive for accuracy, TRX makes no warranties, expressed or implied, regarding the completeness or accuracy of property listings, prices, or availability. All real estate investments carry risk, and clients are encouraged to perform their own due diligence.</p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--color-navy)', marginBottom: '20px' }}>4. Limitations of Liability</h2>
              <p>In no event shall TRX or its consultants be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on TRX&apos;s website, even if TRX has been notified orally or in writing of the possibility of such damage.</p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--color-navy)', marginBottom: '20px' }}>5. Accuracy of Property Information</h2>
              <p>The property materials appearing on TRX&apos;s website could include technical, typographical, or photographic errors. TRX does not warrant that any of the materials on its website are accurate, complete or current. TRX may make changes to the materials contained on its website at any time without notice.</p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--color-navy)', marginBottom: '20px' }}>6. Governing Law</h2>
              <p>These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in Noida, Uttar Pradesh.</p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--color-navy)', marginBottom: '20px' }}>7. Contact Information</h2>
              <p>For any questions regarding these terms, please contact us at <strong>emailtotrx@gmail.com</strong>.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;