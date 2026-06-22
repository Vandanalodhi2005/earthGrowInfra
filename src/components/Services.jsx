'use client';

import { useEffect, useState } from 'react';

function Services() {
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth <= 1024);

    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to top on page load
        const handleResize = () => setIsMobile(window.innerWidth <= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <main style={{ paddingTop: '80px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <section className="services section-padding" id="services">
                <div className="container">
                    <div className="section-header text-center">
                        <span className="subtitle">Our Expertise</span>
                        <h2 style={{ fontSize: isMobile ? '2rem' : '3.5rem' }}>Comprehensive Real Estate Services</h2>
                        <div className="divider mx-auto"></div>
                        <p className="section-desc" style={{ fontSize: isMobile ? '1rem' : '1.2rem' }}>We handle all aspects of real estate with unmatched professionalism.</p>
                    </div>
                    
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', 
                        gap: '30px', 
                        marginTop: '40px' 
                    }}>
                        <div className="service-card" style={{ padding: isMobile ? '30px 20px' : '40px', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                            <div className="service-icon" style={{ fontSize: isMobile ? '2.5rem' : '3rem', color: 'var(--color-teal)', marginBottom: '20px' }}>
                                <i className="fas fa-home"></i>
                            </div>
                            <h3 style={{ fontSize: '1.4rem', color: 'var(--color-navy)', marginBottom: '15px' }}>Residential Sales</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>Find your perfect home or sell your property for maximum value with our expert agents.</p>
                        </div>
                        <div className="service-card" style={{ padding: isMobile ? '30px 20px' : '40px', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                            <div className="service-icon" style={{ fontSize: isMobile ? '2.5rem' : '3rem', color: 'var(--color-teal)', marginBottom: '20px' }}>
                                <i className="fas fa-building"></i>
                            </div>
                            <h3 style={{ fontSize: '1.4rem', color: 'var(--color-navy)', marginBottom: '15px' }}>Commercial Properties</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>Strategic locations and premium office spaces tailored for your business growth.</p>
                        </div>
                        <div className="service-card" style={{ padding: isMobile ? '30px 20px' : '40px', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                            <div className="service-icon" style={{ fontSize: isMobile ? '2.5rem' : '3rem', color: 'var(--color-teal)', marginBottom: '20px' }}>
                                <i className="fas fa-map"></i>
                            </div>
                            <h3 style={{ fontSize: '1.4rem', color: 'var(--color-navy)', marginBottom: '15px' }}>Land & Plots</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>Exclusive plots and land acquisitions for development or long-term investment.</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Services;
