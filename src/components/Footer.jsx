import Link from 'next/link';

function Footer() {
    return (
        <footer className="footer" id="contact" style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Subtle background decoration */}
            <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(198,156,109,0.15) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}></div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(0,128,128,0.1) 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }}></div>

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div className="footer-grid" style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', 
                    gap: '40px' 
                }}>

                    {/* Brand Column */}
                    <div className="footer-brand" style={{ paddingRight: '20px' }}>
                        <Link href="/" className="logo-container footer-logo">
                            <img src="/logo/footer.png" alt="TRX Emblem" className="logo-badge" style={{ height: '60px', filter: 'brightness(1.2)' }} />
                        </Link>
                        <p className="tagline" style={{ color: 'var(--color-gray)', opacity: 0.8, lineHeight: '1.8', marginTop: '20px' }}>
                            Setting the gold standard in premium real estate. We turn your property dreams into prestigious addresses.
                        </p>
                        <div className="social-links" style={{ marginTop: '25px' }}>
                            <a href="https://www.instagram.com/therealtyxperts?igsh=YnV0OW4yb3dqd3o5" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                            <a href="https://youtube.com/@therealtyxperts?si=MrwWCerbQMucsMBn" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
                            <a href="https://www.facebook.com/share/1KdeJWGb8b/" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                            <a href="https://www.linkedin.com/in/therealtyxperts-trx-group-627b651b2?utm_source=share_via&utm_content=profile&utm_medium=member_android" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                        </div>
                    </div>

                    {/* Quick Links Column */}
                    <div className="footer-links">
                        <h3 style={{ position: 'relative', paddingBottom: '12px', borderBottom: '2px solid rgba(255,255,255,0.1)', display: 'inline-block' }}>
                            Quick Links
                            <span style={{ position: 'absolute', bottom: '-2px', left: 0, width: '30px', height: '2px', backgroundColor: 'var(--color-gold)' }}></span>
                        </h3>
                        <ul style={{ marginTop: '20px' }}>
                            <li><Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><i className="fas fa-chevron-right" style={{ fontSize: '10px', color: 'var(--color-gold)' }}></i> Home</Link></li>
                            <li><Link href="/about" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><i className="fas fa-chevron-right" style={{ fontSize: '10px', color: 'var(--color-gold)' }}></i> About Us</Link></li>
                            <li><Link href="/properties" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><i className="fas fa-chevron-right" style={{ fontSize: '10px', color: 'var(--color-gold)' }}></i> Properties</Link></li>
                            <li><Link href="/resale" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><i className="fas fa-chevron-right" style={{ fontSize: '10px', color: 'var(--color-gold)' }}></i> Resale</Link></li>
                            <li><Link href="/interior" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><i className="fas fa-chevron-right" style={{ fontSize: '10px', color: 'var(--color-gold)' }}></i> Interior</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info Column */}
                    <div className="footer-contact">
                        <h3 style={{ position: 'relative', paddingBottom: '12px', borderBottom: '2px solid rgba(255,255,255,0.1)', display: 'inline-block' }}>
                            Get In Touch
                            <span style={{ position: 'absolute', bottom: '-2px', left: 0, width: '30px', height: '2px', backgroundColor: 'var(--color-gold)' }}></span>
                        </h3>
                        <ul className="contact-info" style={{ marginTop: '20px' }}>
                            <li>
                                <div style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: 'rgba(198,156,109,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold)' }}>
                                    <i className="fas fa-user border-0"></i>
                                </div>
                                <span>TRX Group</span>
                            </li>
                            <li>
                                <div style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: 'rgba(198,156,109,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold)' }}>
                                    <i className="fas fa-phone-alt"></i>
                                </div>
                                <a href="tel:9264175587">926-417-5587</a>
                            </li>
                            <li>
                                <div style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: 'rgba(198,156,109,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold)' }}>
                                    <i className="fas fa-envelope"></i>
                                </div>
                                <a href="emailtotrx@gmail.com" style={{ fontSize: '0.95rem' }}>emailtotrx@gmail.com</a>
                            </li>
                            <li>
                                <div style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: 'rgba(0,128,128,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-teal-light)' }}>
                                    <i className="fas fa-clock"></i>
                                </div>
                                <span>Est. 2016</span>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="footer-bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', padding: '25px 0', marginTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <p style={{ margin: 0, color: 'var(--color-gray)', opacity: 0.8 }}>&copy; {new Date().getFullYear()} The Realty Xperts. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <Link href="/privacy" style={{ color: 'var(--color-gray)', opacity: 0.8, textDecoration: 'none', fontSize: '0.9rem' }}>Privacy Policy</Link>
                        <Link href="/terms" style={{ color: 'var(--color-gray)', opacity: 0.8, textDecoration: 'none', fontSize: '0.9rem' }}>Terms of Service</Link>
                        {/* <Link href="/admin/login" style={{ color: 'var(--color-gold)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 'bold' }}>Admin Login</Link> */}
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
