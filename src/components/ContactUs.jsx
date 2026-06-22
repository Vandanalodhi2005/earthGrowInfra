import { useEffect, useState } from 'react';
import emailjs from 'emailjs-com';
import { API_URL } from '../apiConfig';
import toast from 'react-hot-toast';

function Contact() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

    useEffect(() => {
        window.scrollTo(0, 0);
        const handleResize = () => setIsMobile(window.innerWidth <= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            ...({ [name]: value })
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const fullName = `${formData.first_name} ${formData.last_name}`;
        const finalMessage = `Subject: ${formData.subject}\n\n${formData.message}`;

        try {
            // 1. Submit to Backend (Leads Management)
            const backendPromise = fetch(`${API_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: fullName,
                    email: formData.email,
                    phone: formData.phone,
                    message: finalMessage
                })
            });

            // 2. Submit to EmailJS (Frontend Backup Notification)
            const professionalMessage = `
--- NEW CONTACT INQUIRY ---

NAME: ${fullName}
EMAIL: ${formData.email}
PHONE: ${formData.phone}
SUBJECT: ${formData.subject}

MESSAGE CONTENT:
--------------------------------
${formData.message}
--------------------------------

Sent via TRX Website Contact Form
            `.trim();

            const templateParams = {
                from_name: fullName,
                from_email: formData.email,
                phone: formData.phone,
                subject: `Website Inquiry: ${formData.subject}`,
                message: professionalMessage,
                to_name: 'The Realty Xperts Team'
            };

            const emailJsPromise = emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                templateParams,
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            );

            // Wait for both but prioritize backend success message
            const [backendRes] = await Promise.all([backendPromise, emailJsPromise]);

            if (backendRes.ok) {
                toast.success("Thank you! Your message has been received.");
                setFormData({
                    first_name: '',
                    last_name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: ''
                });
            } else {
                throw new Error("Backend submission failed");
            }
        } catch (error) {
            console.error('Submission error:', error);
            toast.error("Failed to send message. Please contact us directly via phone.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main style={{ paddingTop: '80px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <section className="contact section-padding" id="contact-page">
                <div className="container">
                    <div className="section-header text-center">
                        <span className="subtitle">Get In Touch</span>
                        <h2 style={{ fontSize: isMobile ? '2rem' : '3.5rem' }}>Contact The Realty Xperts</h2>
                        <div className="divider mx-auto"></div>
                        <p className="section-desc">We are always ready to help you find your dream address or answer any questions.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', marginTop: '40px' }}>
                        
                        {/* Contact Information Cards */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ backgroundColor: 'var(--color-white)', padding: isMobile ? '20px' : '30px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(0,128,128,0.1)', color: 'var(--color-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                                    <i className="fas fa-phone-alt"></i>
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '5px', color: 'var(--color-navy)' }}>Call Us Directly</h3>
                                    <a href="tel:9264175587" style={{ color: 'var(--color-dark-gray)', textDecoration: 'none', fontSize: isMobile ? '1rem' : '1.1rem', fontWeight: '600' }}>926-417-5587</a>
                                    <p style={{ color: 'var(--color-gold)', fontSize: '0.85rem', marginTop: '5px' }}>Sameer Tiwari</p>
                                </div>
                            </div>

                            <div style={{ backgroundColor: 'var(--color-white)', padding: isMobile ? '20px' : '30px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(0,128,128,0.1)', color: 'var(--color-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                                    <i className="fas fa-envelope"></i>
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '5px', color: 'var(--color-navy)' }}>Email Us</h3>
                                    <a href="mailto:Emailtotrx@gmail.com" style={{ color: 'var(--color-dark-gray)', textDecoration: 'none', fontSize: isMobile ? '0.95rem' : '1.1rem', fontWeight: '600', wordBreak: 'break-all' }}>Emailtotrx@gmail.com</a>
                                </div>
                            </div>

                            <div style={{ backgroundColor: 'var(--color-white)', padding: isMobile ? '20px' : '30px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(0,128,128,0.1)', color: 'var(--color-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                                    <i className="fas fa-clock"></i>
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '5px', color: 'var(--color-navy)' }}>Business Legacy</h3>
                                    <p style={{ color: 'var(--color-dark-gray)', fontSize: '0.95rem' }}>Delivering excellence since <strong>2016</strong>.</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div style={{ backgroundColor: 'var(--color-white)', padding: isMobile ? '25px' : '40px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid #eee' }}>
                            <h3 style={{ marginBottom: '25px', fontSize: '1.4rem', color: 'var(--color-navy)' }}>Send Us A Message</h3>
                            
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '20px' }}>
                                    <input 
                                        type="text" 
                                        name="first_name"
                                        placeholder="First Name" 
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        required 
                                        style={inputStyle} 
                                    />
                                    <input 
                                        type="text" 
                                        name="last_name"
                                        placeholder="Last Name" 
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        required 
                                        style={inputStyle} 
                                    />
                                </div>
                                <input 
                                    type="email" 
                                    name="email"
                                    placeholder="Your Email Address" 
                                    value={formData.email}
                                    onChange={handleChange}
                                    required 
                                    style={inputStyle} 
                                />
                                <input 
                                    type="tel" 
                                    name="phone"
                                    placeholder="Your Phone Number" 
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required 
                                    style={inputStyle} 
                                />
                                <input 
                                    type="text" 
                                    name="subject"
                                    placeholder="Subject" 
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required 
                                    style={inputStyle} 
                                />
                                <textarea 
                                    name="message"
                                    placeholder="How can we help you today?" 
                                    value={formData.message}
                                    onChange={handleChange}
                                    required 
                                    rows="5" 
                                    style={{ ...inputStyle, resize: 'vertical' }}
                                ></textarea>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary" 
                                    disabled={submitting}
                                    style={{ padding: '16px', fontSize: '1.1rem', opacity: submitting ? 0.7 : 1 }}
                                >
                                    {submitting ? 'Sending...' : 'Submit Message'}
                                </button>
                            </form>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
}

const inputStyle = {
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontFamily: 'inherit',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s',
    backgroundColor: '#fff'
};

export default Contact;
