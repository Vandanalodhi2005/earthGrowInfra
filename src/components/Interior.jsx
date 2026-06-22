'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HiSparkles, HiCheckCircle, HiChevronLeft, HiChevronRight, HiPhone, HiStar, HiClock, HiCurrencyRupee, HiShieldCheck, HiHome } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { API_URL } from '../apiConfig';

const Interior = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth <= 1024);
  const [activeImageIndexes, setActiveImageIndexes] = useState({});

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interiorFor: ''
  });
  const [formSubmitting, setFormSubmitting] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchInteriorData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/projects?type=interior`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
        
        const initialIndexes = {};
        data.forEach(p => {
          initialIndexes[p._id] = 0;
        });
        setActiveImageIndexes(initialIndexes);
      }
    } catch (error) {
      console.error('Error fetching interior projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInteriorData();
    window.scrollTo(0, 0);
  }, []);

  const handlePrevImage = (projId, imagesLength) => {
    setActiveImageIndexes(prev => ({
      ...prev,
      [projId]: (prev[projId] - 1 + imagesLength) % imagesLength
    }));
  };

  const handleNextImage = (projId, imagesLength) => {
    setActiveImageIndexes(prev => ({
      ...prev,
      [projId]: (prev[projId] + 1) % imagesLength
    }));
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.interiorFor) {
      toast.error('Please select what you need interiors for');
      return;
    }
    setFormSubmitting(true);

    try {
      const payload = {
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        serviceType: formData.interiorFor,
        message: ''
      };

      const response = await fetch(`${API_URL}/api/interior-queries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success('Your consultation request has been submitted successfully!');
        setFormData({ name: '', email: '', phone: '', interiorFor: '' });
      } else {
        toast.error('Failed to submit consultation request. Please try again.');
      }
    } catch (err) {
      console.error('Submit consultation error:', err);
      toast.error('Connection error. Please try again.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Static Data
  const servicesList = [
    { title: 'Modular Kitchen', img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=600' },
    { title: 'Wardrobes', img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=600' },
    { title: 'False Ceiling', img: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=600' },
    { title: 'Crockery Unit', img: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=600' },
    { title: 'TV Unit', img: '/tvUnit.jpg' },
    { title: 'Painting', img: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=600' },
    { title: 'Study Table', img: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=600' },
    { title: 'Furniture & More', img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=600' },
    { title: 'Exterior', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600' },
    { title: 'Electrical', img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600' },
    { title: 'Water Proofing', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600' },
    { title: 'Renovation', img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600' }
  ];

  const offerings = [
    { title: 'Expert Design Team', desc: 'Our experienced interior designers bring your vision to life with creative and functional layouts.', icon: <HiStar size={24} /> },
    { title: 'Multiple Design Options', desc: 'Choose from a variety of layout solutions until you find the perfect match.', icon: <HiSparkles size={24} /> },
    { title: 'Material Selection', desc: 'We guide you through selecting premium, durable materials that suit your style and budget.', icon: <HiShieldCheck size={24} /> },
    { title: 'Timely Completion', desc: 'Your project will be delivered on schedule with top-notch execution and finish.', icon: <HiClock size={24} /> },
    { title: 'Complete Interior Solutions', desc: 'We deliver 360-degree turnkey solutions, ensuring every detail is tailored to your taste.', icon: <HiHome size={24} /> },
    { title: 'Transparent Pricing', desc: 'No hidden fees or surprise charges—only upfront, clear pricing options.', icon: <HiCurrencyRupee size={24} /> }
  ];

  const interiorForOptions = [
    '1BHK', '2BHK', '3BHK', '4BHK', 'Office Space', 'Cafe/Restaurant', 'Clinic/Hospital', 'Salon', 'Retail Store', 'Other'
  ];

  const steps = [
    { num: '01', title: 'Consultation', desc: 'Discuss your requirements, budget, and design ideas with our lead designer.' },
    { num: '02', title: 'Design & 3D Renderings', desc: 'We create tailored layout concepts and high-definition 3D visualization layouts.' },
    { num: '03', title: 'Execution', desc: 'Our premium carpenters, electricians, and painters turn drawings into reality.' },
    { num: '04', title: 'Handover', desc: 'Get your fully finished signature space delivered right on schedule!' }
  ];

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', paddingTop: isMobile ? '60px' : '100px' }}>
      
      {/* Hero Banner Section */}
      <section style={{ 
        position: 'relative', 
        padding: isMobile ? '60px 0' : '120px 0',
        backgroundColor: '#0a1c3a',
        color: 'white',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,28,58,0.95) 40%, rgba(10,28,58,0.6) 100%)', zIndex: 1 }}></div>
        <img 
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000" 
          alt="Luxury Interiors" 
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
        />
        
        <div className="container" style={{ position: 'relative', zIndex: 2, padding: isMobile ? '0 15px' : '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 0.8fr', gap: '40px', alignItems: 'center' }}>
            
            {/* Hero Left Content */}
            <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
              <span style={{ 
                display: 'inline-block', 
                color: 'var(--color-gold)', 
                fontWeight: '800', 
                textTransform: 'uppercase', 
                letterSpacing: '4px', 
                fontSize: '0.85rem', 
                marginBottom: '15px' 
              }}>
                Commercial Interiors | Renovation
              </span>
              <h1 style={{ 
                fontSize: isMobile ? '2.4rem' : '4.2rem', 
                fontWeight: '900', 
                color: 'white', 
                marginBottom: '20px',
                lineHeight: 1.1
              }}>
                Exquisite Interior Designs
              </h1>
              <div style={{ height: '3px', width: '80px', background: 'var(--color-gold)', margin: isMobile ? '0 auto 25px' : '0 0 25px', borderRadius: '50px' }}></div>
              <p style={{ 
                fontSize: isMobile ? '1rem' : '1.25rem', 
                color: '#ddd', 
                maxWidth: '650px', 
                lineHeight: 1.7,
                marginBottom: '30px'
              }}>
                Turn key interior concepts, modular execution, and meticulous curation tailored exactly for your home, commercial, or renovation goals.
              </p>
            </div>

            {/* Interactive Form Right */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(16px)',
              borderRadius: '24px',
              padding: isMobile ? '25px' : '35px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
            }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'white', marginBottom: '8px', textAlign: 'center' }}>
                Book Free Consultation
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#c69c6d', fontWeight: '700', textAlign: 'center', marginBottom: '25px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Get Free Interior Estimate
              </p>

              <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Full Name" 
                  value={formData.name}
                  onChange={handleFormChange}
                  style={formInputStyle} 
                  required 
                />
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Email Address" 
                  value={formData.email}
                  onChange={handleFormChange}
                  style={formInputStyle} 
                  required 
                />
                <input 
                  type="tel" 
                  name="phone" 
                  placeholder="Phone Number" 
                  value={formData.phone}
                  onChange={handleFormChange}
                  style={formInputStyle} 
                  required 
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'white' }}>I Need Interiors For *</label>
                  <select 
                    name="interiorFor" 
                    value={formData.interiorFor}
                    onChange={handleFormChange}
                    style={formInputStyle}
                    required
                  >
                    <option value="" style={{ color: '#333' }}>Select Option</option>
                    {interiorForOptions.map(opt => (
                      <option key={opt} value={opt} style={{ color: '#333' }}>{opt}</option>
                    ))}
                  </select>
                </div>

                <button 
                  type="submit" 
                  disabled={formSubmitting}
                  style={{
                    backgroundColor: 'var(--color-gold)',
                    color: 'white',
                    border: 'none',
                    padding: '14px',
                    borderRadius: '10px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(198,156,109,0.3)',
                    marginTop: '10px'
                  }}
                >
                  {formSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section style={{ padding: '80px 0', backgroundColor: 'white' }}>
        <div className="container" style={{ padding: isMobile ? '0 15px' : '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{ color: 'var(--color-teal)', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Comprehensive Solutions</span>
            <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.8rem', fontWeight: '800', color: 'var(--color-navy)', marginTop: '8px' }}>
              Our Services
            </h2>
            <div style={{ height: '3px', width: '50px', background: 'var(--color-gold)', margin: '15px auto 0', borderRadius: '50px' }}></div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: isMobile ? '15px' : '25px'
          }}>
            {servicesList.map((service, idx) => (
              <div key={idx} style={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 6px 20px rgba(0,0,0,0.03)',
                border: '1px solid #f0f0f0',
                position: 'relative',
                aspectRatio: '1',
                cursor: 'pointer',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,28,58,0.85) 0%, rgba(10,28,58,0.2) 60%, transparent 100%)', zIndex: 1 }}></div>
                <img src={service.img} alt={service.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <h4 style={{
                  position: 'absolute', bottom: '20px', left: '20px', right: '20px',
                  margin: 0, zIndex: 2, color: 'white', fontWeight: '800', fontSize: isMobile ? '0.95rem' : '1.15rem'
                }}>
                  {service.title}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signature Showroom Dynamic Section */}
      {projects.length > 0 && (
        <section style={{ padding: '80px 0', backgroundColor: '#f8f9fa' }}>
          <div className="container" style={{ padding: isMobile ? '0 15px' : '0 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <span style={{ color: 'var(--color-teal)', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Virtual Tour Showcase</span>
              <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.8rem', fontWeight: '800', color: 'var(--color-navy)', marginTop: '8px' }}>
                Completed Space Projects
              </h2>
              <div style={{ height: '3px', width: '50px', background: 'var(--color-gold)', margin: '15px auto 0', borderRadius: '50px' }}></div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(450px, 1fr))',
              gap: isMobile ? '30px' : '45px'
            }}>
              {projects.map((project) => {
                const activeImg = activeImageIndexes[project._id] || 0;
                const images = project.images && project.images.length > 0 ? project.images : ['/assets/images/about_trx.png'];
                
                return (
                  <div key={project._id} style={{
                    backgroundColor: 'white',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: '0 15px 45px rgba(0,0,0,0.04)',
                    border: '1px solid #eee',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    {/* Immersive Image Slider */}
                    <div style={{ position: 'relative', width: '100%', height: '320px', backgroundColor: '#0a1c3a', overflow: 'hidden' }}>
                      <img 
                        src={images[activeImg]} 
                        alt={project.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      
                      {images.length > 1 && (
                        <>
                          <button 
                            onClick={() => handlePrevImage(project._id, images.length)}
                            style={arrowButtonStyle('left')}
                          >
                            <HiChevronLeft size={20} />
                          </button>
                          <button 
                            onClick={() => handleNextImage(project._id, images.length)}
                            style={arrowButtonStyle('right')}
                          >
                            <HiChevronRight size={20} />
                          </button>
                          
                          <div style={{
                            position: 'absolute', bottom: '15px', right: '15px',
                            backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                            color: 'white', padding: '4px 12px', borderRadius: '50px',
                            fontSize: '0.75rem', fontWeight: 'bold'
                          }}>
                            {activeImg + 1} / {images.length}
                          </div>
                        </>
                      )}

                      {/* Design For Badge */}
                      {project.interiorFor && (
                        <div style={{
                          position: 'absolute', top: '20px', left: '20px',
                          backgroundColor: 'var(--color-gold)', color: 'white',
                          padding: '6px 14px', borderRadius: '8px',
                          fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                        }}>
                          <HiSparkles style={{ display: 'inline-block', marginRight: '5px', verticalAlign: 'middle' }} />
                          {project.interiorFor}
                        </div>
                      )}
                    </div>

                    {/* Content details */}
                    <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-navy)', marginBottom: '12px' }}>
                        {project.title}
                      </h3>
                      <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: '1.7', marginBottom: '20px', flexGrow: 1 }}>
                        {project.description}
                      </p>
                      
                      <div style={{ 
                        borderTop: '1px solid #f0f0f0', 
                        paddingTop: '15px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-teal)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                          <HiCheckCircle style={{ display: 'inline-block', marginRight: '4px', verticalAlign: 'middle' }} size={16} /> Completed Space
                        </span>
                        
                        <Link 
                          to={`/project/${project._id}`}
                          className="btn btn-outline-primary"
                          style={{ padding: '8px 18px', fontSize: '0.8rem', fontWeight: 'bold', borderRadius: '8px' }}
                        >
                          View Gallery Tour
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us Section */}
      <section style={{ padding: '80px 0', backgroundColor: 'white' }}>
        <div className="container" style={{ padding: isMobile ? '0 15px' : '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{ color: 'var(--color-teal)', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Uncompromised Core Values</span>
            <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.8rem', fontWeight: '800', color: 'var(--color-navy)', marginTop: '8px' }}>
              Why Choose Us ?
            </h2>
            <div style={{ height: '3px', width: '50px', background: 'var(--color-gold)', margin: '15px auto 0', borderRadius: '50px' }}></div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
            gap: '30px'
          }}>
            {[
              { title: 'On Time Delivery', icon: <HiClock size={36} color="var(--color-gold)" />, bg: 'rgba(198,156,109,0.08)' },
              { title: 'Superior Quality', icon: <HiStar size={36} color="var(--color-teal)" />, bg: 'rgba(0,128,128,0.08)' },
              { title: 'Best Price', icon: <HiCurrencyRupee size={36} color="#4CAF50" />, bg: 'rgba(76,175,80,0.08)' },
              { title: 'Best Policy', icon: <HiShieldCheck size={36} color="var(--color-navy)" />, bg: 'rgba(10,28,58,0.08)' }
            ].map((item, idx) => (
              <div key={idx} style={{
                backgroundColor: 'white',
                border: '1px solid #f0f0f0',
                borderRadius: '20px',
                padding: '30px 20px',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{
                  width: '70px', height: '70px', borderRadius: '50%',
                  backgroundColor: item.bg, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', margin: '0 auto 20px'
                }}>
                  {item.icon}
                </div>
                <h4 style={{ margin: 0, color: 'var(--color-navy)', fontSize: '1.2rem', fontWeight: '800' }}>{item.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Offerings Section */}
      <section style={{ padding: '80px 0', backgroundColor: '#f8f9fa' }}>
        <div className="container" style={{ padding: isMobile ? '0 15px' : '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{ color: 'var(--color-teal)', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Unmatched Services</span>
            <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.8rem', fontWeight: '800', color: 'var(--color-navy)', marginTop: '8px' }}>
              Our Offerings
            </h2>
            <div style={{ height: '3px', width: '50px', background: 'var(--color-gold)', margin: '15px auto 0', borderRadius: '50px' }}></div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '30px'
          }}>
            {offerings.map((item, idx) => (
              <div key={idx} style={{
                backgroundColor: 'white',
                border: '1px solid #eee',
                borderRadius: '20px',
                padding: '35px 25px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{
                  width: '50px', height: '50px', borderRadius: '12px',
                  backgroundColor: 'rgba(198,156,109,0.1)', color: 'var(--color-gold)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  {item.icon}
                </div>
                <h4 style={{ margin: '0 0 10px', color: 'var(--color-navy)', fontSize: '1.25rem', fontWeight: '800' }}>{item.title}</h4>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem', lineHeight: '1.6' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Do We Work ? Steps Section */}
      <section style={{ padding: '80px 0', backgroundColor: 'white' }}>
        <div className="container" style={{ padding: isMobile ? '0 15px' : '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{ color: 'var(--color-teal)', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Strategic Workflow</span>
            <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.8rem', fontWeight: '800', color: 'var(--color-navy)', marginTop: '8px' }}>
              How Do We Work ?
            </h2>
            <div style={{ height: '3px', width: '50px', background: 'var(--color-gold)', margin: '15px auto 0', borderRadius: '50px' }}></div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
            gap: '30px',
            position: 'relative'
          }}>
            {steps.map((step, idx) => (
              <div key={idx} style={{
                textAlign: 'center',
                padding: '20px',
                position: 'relative'
              }}>
                <div style={{
                  fontSize: '3.5rem',
                  fontWeight: '900',
                  color: 'rgba(198,156,109,0.15)',
                  lineHeight: '1',
                  marginBottom: '10px'
                }}>
                  {step.num}
                </div>
                <h4 style={{ margin: '0 0 10px', color: 'var(--color-navy)', fontSize: '1.2rem', fontWeight: '800' }}>
                  {step.title}
                </h4>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Happy Customers Testimonials */}
      <section style={{ padding: '80px 0', backgroundColor: '#0a1c3a', color: 'white' }}>
        <div className="container" style={{ padding: isMobile ? '0 15px' : '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '50px', alignItems: 'center' }}>
            
            <div>
              <span style={{ color: 'var(--color-gold)', fontWeight: 'bold', letterSpacing: '3px', textTransform: 'uppercase', fontSize: '0.8rem', display: 'block', marginBottom: '10px' }}>Happy Customers</span>
              <h2 style={{ color: 'white', fontSize: isMobile ? '2rem' : '3.2rem', fontWeight: '900', margin: '0 0 20px', lineHeight: '1.2' }}>
                Delighted by Our Service
              </h2>
              <div style={{ height: '3px', width: '60px', background: 'var(--color-gold)', marginBottom: '30px', borderRadius: '50px' }}></div>
              <p style={{ fontSize: '1.15rem', color: '#ccc', lineHeight: '1.7', marginBottom: '30px' }}>
                See how our expert interior designers have transformed spaces into stunning realities.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.1rem', fontWeight: '700' }}><HiCheckCircle color="var(--color-gold)" size={24} /> Hundreds of Satisfied Customers</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.1rem', fontWeight: '700' }}><HiCheckCircle color="var(--color-gold)" size={24} /> Personalized Designs for Every Budget</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.1rem', fontWeight: '700' }}><HiCheckCircle color="var(--color-gold)" size={24} /> Guaranteed Quality & Attention to Detail</div>
              </div>
            </div>

            {/* Premium Testimonials Stack */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: '20px',
                padding: '30px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div style={{ display: 'flex', gap: '5px', marginBottom: '15px' }}>
                  {[...Array(5)].map((_, i) => <HiStar key={i} color="var(--color-gold)" size={18} />)}
                </div>
                <p style={{ fontStyle: 'italic', color: '#ddd', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px' }}>
                  "The Realty Xperts transformed our 3BHK into an absolute dream home. The modular kitchen and lighting details match precisely what we saw in the 3D designs. Phenomenal job!"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#0a1c3a' }}>A</div>
                  <div>
                    <h5 style={{ margin: 0, fontWeight: 'bold' }}>Amit Sharma</h5>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#aaa' }}>Resident, Bhopal</p>
                  </div>
                </div>
              </div>

              <div style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: '20px',
                padding: '30px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div style={{ display: 'flex', gap: '5px', marginBottom: '15px' }}>
                  {[...Array(5)].map((_, i) => <HiStar key={i} color="var(--color-gold)" size={18} />)}
                </div>
                <p style={{ fontStyle: 'italic', color: '#ddd', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px' }}>
                  "Exceptional office layout execution! The timber choices, partition layout, and study layouts were delivered in record time. Transparent pricing with absolutely zero hidden costs."
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#0a1c3a' }}>R</div>
                  <div>
                    <h5 style={{ margin: 0, fontWeight: 'bold' }}>Rajesh Verma</h5>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#aaa' }}>Director, V-Tech Systems</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Dynamic Book Free Consultation Call-to-action Section */}
      <section style={{ 
        backgroundColor: 'white', 
        padding: isMobile ? '60px 0' : '100px 0',
        textAlign: 'center'
      }}>
        <div className="container" style={{ padding: isMobile ? '0 15px' : '0 24px' }}>
          <span style={{ color: 'var(--color-teal)', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem', display: 'block', marginBottom: '10px' }}>Ready To Design?</span>
          <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.8rem', fontWeight: '800', color: 'var(--color-navy)', marginBottom: '20px' }}>
            Book Your Free Consultation Call
          </h2>
          <p style={{ color: '#666', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto 35px', lineHeight: '1.6' }}>
            Consult with our designers today. We provide free site visits, layouts, and initial 3D visualization estimates.
          </p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="btn btn-secondary" 
            style={{ 
              padding: '16px 50px', 
              fontSize: '1rem',
              borderRadius: '50px',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(198,156,109,0.3)'
            }}
          >
            Book Free Consultation
          </button>
        </div>
      </section>

    </main>
  );
};

const formInputStyle = {
  width: '100%',
  padding: '12px 15px',
  borderRadius: '10px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  color: '#333',
  fontSize: '0.9rem',
  outline: 'none',
  boxSizing: 'border-box'
};

const arrowButtonStyle = (direction) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  [direction]: '15px',
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
  color: '#0a1c3a',
  transition: 'background-color 0.2s',
  zIndex: 10
});

export default Interior;
