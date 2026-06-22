import { useEffect } from 'react';

const CookiePolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="cookie-page" style={{ backgroundColor: '#f8f9fa', padding: '60px 0' }}>
      <div className="container">
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Header Section */}
          <div className="section-header text-center" style={{ marginBottom: '50px' }}>
            <span className="subtitle" style={{ color: 'var(--color-gold)', letterSpacing: '4px' }}>USER EXPERIENCE</span>
            <h1 style={{ fontSize: '3rem', color: 'var(--color-navy)', fontWeight: '900' }}>Cookie Policy</h1>
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
              <h2 style={{ fontSize: '1.8rem', color: 'var(--color-navy)', marginBottom: '20px' }}>1. What are Cookies?</h2>
              <p>Cookies are small text files that are stored on your device (computer or mobile) when you visit <strong>The Realty Xperts (TRX)</strong> website. They are widely used to make websites work more efficiently and provide a better experience for users.</p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--color-navy)', marginBottom: '20px' }}>2. How We Use Cookies</h2>
              <p>We use cookies for the following purposes:</p>
              <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
                <li><strong>Essential:</strong> To remember your login state and session information.</li>
                <li><strong>Analytics:</strong> To understand how visitors interact with our property listings and investment pages.</li>
                <li><strong>Preferences:</strong> To remember your search filters, location choices, and property favorites.</li>
                <li><strong>Marketing:</strong> To show you relevant property suggestions based on your browsing history.</li>
              </ul>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--color-navy)', marginBottom: '20px' }}>3. Managing Cookies</h2>
              <p>Most web browsers allow you to control cookies through their settings. You can choose to block all cookies or only third-party cookies. However, please note that disabling cookies may limit your ability to use certain features of our property portal, such as saving favorites or receiving personalized alerts.</p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--color-navy)', marginBottom: '20px' }}>4. Contact Us</h2>
              <p>If you have any questions about our Cookie Policy, please reach out to us at <strong>emailtotrx@gmail.com</strong>.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;