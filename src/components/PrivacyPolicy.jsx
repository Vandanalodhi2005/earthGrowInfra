import { useEffect } from 'react';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="privacy-page" style={{ backgroundColor: '#f8f9fa', padding: '60px 0' }}>
      <div className="container">
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Header Section */}
          <div className="section-header text-center" style={{ marginBottom: '50px' }}>
            <span className="subtitle" style={{ color: 'var(--color-gold)', letterSpacing: '4px' }}>LEGAL INFORMATION</span>
            <h1 style={{ fontSize: '3rem', color: 'var(--color-navy)', fontWeight: '900' }}>Privacy Policy</h1>
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
              <h2 style={{ fontSize: '1.8rem', color: 'var(--color-navy)', marginBottom: '20px' }}>1. Introduction</h2>
              <p>Welcome to <strong>The Realty Xperts (TRX)</strong>. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--color-navy)', marginBottom: '20px' }}>2. Data We Collect</h2>
              <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
              <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
                <li><strong>Identity Data:</strong> includes first name, last name, and title.</li>
                <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
                <li><strong>Property Preferences:</strong> includes information about the types of properties or investments you are interested in.</li>
                <li><strong>Technical Data:</strong> includes internet protocol (IP) address, browser type and version, and location.</li>
              </ul>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--color-navy)', marginBottom: '20px' }}>3. How We Use Your Data</h2>
              <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
              <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
                <li>To register you as a new client and provide property consultancy services.</li>
                <li>To contact you regarding property inquiries or investment opportunities you have expressed interest in.</li>
                <li>To manage our relationship with you (e.g., notifying you about changes to our terms or privacy policy).</li>
                <li>To improve our website, services, and client experiences.</li>
              </ul>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--color-navy)', marginBottom: '20px' }}>4. Data Security</h2>
              <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, and other third parties who have a business need to know.</p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--color-navy)', marginBottom: '20px' }}>5. Contact Us</h2>
              <p>If you have any questions about this privacy policy or our privacy practices, please contact our team:</p>
              <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-gold)' }}>
                <p><strong>Email:</strong> emailtotrx@gmail.com</p>
                <p><strong>Phone:</strong> +91 9264175587</p>
                <p><strong>Address:</strong> Noida, NCR, India</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;