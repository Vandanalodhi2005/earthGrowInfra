'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_URL } from '../apiConfig';

const ProjectDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth <= 1024);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProject();

    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [id]);

  // Helper to split bunched up text (e.g. from admin panel)
  const formatList = (list) => {
    if (!list) return [];
    if (!Array.isArray(list)) return [list];
    
    return list.flatMap(item => {
      if (typeof item !== 'string') return [item];
      // Split by common delimiters like ✔️, |, •, or newlines
      return item.split(/[|✔️•\n]+/).map(s => s.trim()).filter(s => s.length > 0);
    });
  };

  const fetchProject = async () => {
    try {
      const response = await fetch(`${API_URL}/api/projects/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'ready-to-move': return { bg: '#ECFDF5', color: '#059669', border: '#A7F3D0' };
      case 'under-construction': return { bg: '#FFFBEB', color: '#D97706', border: '#FDE68A' };
      case 'upcoming': return { bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' };
      case 'completed': return { bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0' };
      default: return { bg: '#F8FAFC', color: '#64748B', border: '#E2E8F0' };
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'ready-to-move': return 'Ready to Move';
      case 'under-construction': return 'Under Construction';
      case 'upcoming': return 'Under Construction';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a1c3a' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            border: '4px solid rgba(198,156,109,0.2)',
            borderTopColor: '#c69c6d',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>Loading...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#0a1c3a', marginBottom: '20px', fontWeight: '900' }}>Project Not Found</h1>
        <button onClick={() => router.push('/projects')} style={{ backgroundColor: '#0a1c3a', color: 'white', padding: '14px 40px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
          Back to Projects
        </button>
      </div>
    );
  }

  const statusStyle = getStatusStyle(project.status);
  const formattedHighlights = formatList(project.highlights);
  const formattedAmenities = formatList(project.amenities);

  return (
    <main style={{ backgroundColor: '#f8f9fa', paddingBottom: isMobile ? '80px' : '0' }}>

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: isMobile ? '450px' : '75vh',
        display: 'flex',
        alignItems: 'flex-end',
        overflow: 'hidden',
        backgroundColor: '#0a1c3a',
      }}>
        {project.images && project.images.length > 0 && (
          <img
            src={project.images[0]}
            alt={project.title}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }}
          />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,28,58,1) 10%, rgba(10,28,58,0.4) 100%)' }}></div>

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          style={{
            position: 'absolute', 
            top: isMobile ? '30px' : '40px', 
            left: isMobile ? '15px' : '30px', 
            zIndex: 100,
            display: 'flex', alignItems: 'center', gap: '8px',
            backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.3)', color: 'white',
            padding: isMobile ? '10px 20px' : '12px 24px', 
            borderRadius: '50px', cursor: 'pointer',
            fontSize: isMobile ? '0.85rem' : '0.95rem', 
            fontWeight: '600', transition: 'all 0.3s',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.25)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.15)'}
        >
          <i className="fas fa-arrow-left"></i> Back
        </button>

        <div style={{ position: 'relative', zIndex: 5, width: '100%', boxSizing: 'border-box', padding: isMobile ? '100px 15px 40px' : '60px 20px 80px' }}>
          <div className="container">
            {/* Badges */}
            <div style={{ 
              display: 'flex', 
              gap: '10px', 
              flexWrap: 'wrap', 
              marginBottom: '20px'
            }}>
              <span style={{
                backgroundColor: 'rgba(198,156,109,0.2)', color: '#c69c6d',
                padding: '6px 16px', borderRadius: '50px', fontSize: '0.75rem',
                fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px',
                border: '1px solid rgba(198,156,109,0.4)',
                backdropFilter: 'blur(4px)'
              }}>
                <i className="fas fa-building" style={{ marginRight: '8px' }}></i>
                {(project.category || project.type)?.replace(/-/g, ' ')}
              </span>
              <span style={{
                backgroundColor: statusStyle.bg, color: statusStyle.color,
                padding: '6px 16px', borderRadius: '50px', fontSize: '0.75rem',
                fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px',
                border: `1px solid ${statusStyle.border}`,
                backdropFilter: 'blur(4px)'
              }}>
                {getStatusLabel(project.status)}
              </span>
            </div>

            <h1 style={{
              fontSize: isMobile ? '1.6rem' : 'clamp(2.5rem, 5vw, 4.5rem)', 
              fontWeight: '900', color: 'white',
              lineHeight: 1.1, marginBottom: '24px',
              wordBreak: 'break-word',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}>
              {project.title}
            </h1>

            <div style={{ 
              display: 'flex', 
              gap: isMobile ? '20px' : '40px', 
              flexWrap: 'wrap', 
              fontSize: isMobile ? '0.9rem' : '1.1rem',
              fontWeight: '500'
            }}>
              <span style={{ color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(198,156,109,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fas fa-map-marker-alt" style={{ color: '#c69c6d' }}></i>
                </div>
                {project.location}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(198,156,109,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fas fa-rupee-sign" style={{ color: '#c69c6d' }}></i>
                </div>
                {project.price}
              </span>
            </div>
          </div>
        </div>
      </section>


      {/* Main Content */}
      <div className="container" style={{ padding: isMobile ? '25px 12px 80px' : '60px 24px' }}>
        <div className="project-layout-grid">

          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '25px' : '40px' }}>

            {/* Image Gallery */}
            {project.images && project.images.length > 0 && (
              <div style={{ backgroundColor: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.06)', border: '1px solid #eee' }}>
                <div style={{ position: 'relative', aspectRatio: isMobile ? '4/3' : '16/9', overflow: 'hidden' }}>
                  <img
                    src={project.images[activeImage]}
                    alt={project.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.5s ease' }}
                  />
                  {project.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveImage(i => (i - 1 + project.images.length) % project.images.length)}
                        style={{
                          position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)',
                          width: isMobile ? '40px' : '50px', height: isMobile ? '40px' : '50px', borderRadius: '50%',
                          backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.15)', fontSize: '1rem', color: '#0a1c3a',
                          transition: 'all 0.2s', zIndex: 10
                        }}
                      >
                        <i className="fas fa-chevron-left"></i>
                      </button>
                      <button
                        onClick={() => setActiveImage(i => (i + 1) % project.images.length)}
                        style={{
                          position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)',
                          width: isMobile ? '40px' : '50px', height: isMobile ? '40px' : '50px', borderRadius: '50%',
                          backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.15)', fontSize: '1rem', color: '#0a1c3a',
                          transition: 'all 0.2s', zIndex: 10
                        }}
                      >
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </>
                  )}
                  {/* Counter Badge */}
                  <div style={{ 
                    position: 'absolute', bottom: '15px', right: '15px', 
                    backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', 
                    padding: '5px 12px', borderRadius: '20px', fontSize: '0.75rem', 
                    fontWeight: 'bold', backdropFilter: 'blur(4px)' 
                  }}>
                    {activeImage + 1} / {project.images.length}
                  </div>
                </div>

                {project.images.length > 1 && (
                  <div style={{ 
                    display: 'flex', gap: '10px', padding: '15px', overflowX: 'auto', 
                    scrollbarWidth: 'none', msOverflowStyle: 'none' 
                  }}>
                    {project.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImage(index)}
                        style={{
                          flexShrink: 0, width: isMobile ? '70px' : '100px', height: isMobile ? '50px' : '70px', borderRadius: '12px',
                          overflow: 'hidden', padding: 0,
                          border: activeImage === index ? '3px solid #c69c6d' : '3px solid transparent',
                          cursor: 'pointer', transition: 'all 0.3s',
                          opacity: activeImage === index ? 1 : 0.6,
                          transform: activeImage === index ? 'scale(1.05)' : 'scale(1)'
                        }}
                      >
                        <img src={img} alt={`View ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* About Section */}
            <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: isMobile ? '30px 20px' : '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                <div style={{ width: '5px', height: '35px', backgroundColor: '#c69c6d', borderRadius: '10px' }}></div>
                <h2 style={{ fontSize: isMobile ? '1.5rem' : '1.8rem', fontWeight: '900', color: '#0a1c3a', margin: 0 }}>About This Project</h2>
              </div>
              <p style={{ color: '#4a5568', lineHeight: '1.8', fontSize: isMobile ? '0.95rem' : '1.1rem', margin: 0, whiteSpace: 'pre-line', wordBreak: 'break-word' }}>
                {project.description || 'No description available.'}
              </p>
            </div>

            {/* Highlights */}
            {formattedHighlights.length > 0 && (
              <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: isMobile ? '30px 20px' : '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                  <div style={{ width: '5px', height: '35px', backgroundColor: '#c69c6d', borderRadius: '10px' }}></div>
                  <h2 style={{ fontSize: isMobile ? '1.5rem' : '1.8rem', fontWeight: '900', color: '#0a1c3a', margin: 0 }}>Key Highlights</h2>
                </div>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))', 
                  gap: '15px' 
                }}>
                  {formattedHighlights.map((h, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '15px',
                      padding: '20px', backgroundColor: '#f8fafc',
                      borderRadius: '16px', border: '1px solid #edf2f7',
                      transition: 'all 0.3s'
                    }}>
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '50%',
                        backgroundColor: 'rgba(5,150,105,0.1)', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <i className="fas fa-check" style={{ color: '#059669', fontSize: '0.8rem' }}></i>
                      </div>
                      <span style={{ color: '#2d3748', fontWeight: '600', fontSize: '0.95rem', lineHeight: 1.5 }}>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {formattedAmenities.length > 0 && (
              <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: isMobile ? '30px 20px' : '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                  <div style={{ width: '5px', height: '35px', backgroundColor: '#c69c6d', borderRadius: '10px' }}></div>
                  <h2 style={{ fontSize: isMobile ? '1.5rem' : '1.8rem', fontWeight: '900', color: '#0a1c3a', margin: 0 }}>Amenities</h2>
                </div>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(240px, 1fr))', 
                  gap: '12px' 
                }}>
                  {formattedAmenities.map((a, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '15px',
                      padding: '16px 20px', backgroundColor: '#f8fafc',
                      borderRadius: '12px', border: '1px solid #edf2f7'
                    }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: 'rgba(198,156,109,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <i className="fas fa-star" style={{ color: '#c69c6d', fontSize: '0.9rem' }}></i>
                      </div>
                      <span style={{ color: '#2d3748', fontWeight: '700', fontSize: '0.95rem' }}>{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* YouTube Video */}
            {project.youtubeUrl && (project.youtubeUrl.includes('youtube.com') || project.youtubeUrl.includes('youtu.be')) && (
              <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: isMobile ? '30px 20px' : '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                  <div style={{ width: '5px', height: '35px', backgroundColor: '#ef4444', borderRadius: '10px' }}></div>
                  <h2 style={{ fontSize: isMobile ? '1.5rem' : '1.8rem', fontWeight: '900', color: '#0a1c3a', margin: 0 }}>
                    <i className="fab fa-youtube" style={{ color: '#ef4444', marginRight: '10px' }}></i>
                    Video Tour
                  </h2>
                </div>
                <div style={{ borderRadius: '20px', overflow: 'hidden', aspectRatio: '16/9', boxShadow: '0 15px 35px rgba(0,0,0,0.1)' }}>
                  <iframe
                    src={project.youtubeUrl.replace('watch?v=', 'embed/').split('&')[0]}
                    title="Project Video Tour"
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN - Sticky Sidebar */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '30px', 
            position: isMobile ? 'static' : 'sticky', 
            top: '110px' 
          }}>

            {/* Price & Info Card */}
            <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '35px', boxShadow: '0 15px 50px rgba(10,28,58,0.08)', border: '1px solid #f0f0f0' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: '800', color: '#c69c6d', textTransform: 'uppercase', letterSpacing: '2.5px', marginBottom: '20px' }}>Investment Overview</p>

              {/* Price */}
              <div style={{ padding: '25px 0', borderBottom: '1px solid #f1f1f1', borderTop: '1px solid #f1f1f1', marginBottom: '25px' }}>
                <p style={{ color: '#718096', fontSize: '0.85rem', marginBottom: '8px', fontWeight: '600' }}>PRICE RANGE</p>
                <p style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', fontWeight: '900', color: '#0a1c3a', margin: 0, letterSpacing: '-1px' }}>
                  <i className="fas fa-rupee-sign" style={{ color: '#c69c6d', marginRight: '8px', fontSize: '1.6rem' }}></i>
                  {project.price}
                </p>
              </div>

              {/* Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#718096', fontSize: '0.9rem', fontWeight: '600' }}>Status</span>
                  <span style={{
                    padding: '6px 16px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '800',
                    backgroundColor: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}`,
                    textTransform: 'uppercase'
                  }}>
                    {getStatusLabel(project.status)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#718096', fontSize: '0.9rem', fontWeight: '600' }}>Type</span>
                  <span style={{ color: '#0a1c3a', fontWeight: '800', fontSize: '1rem', textTransform: 'capitalize' }}>{project.type}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#718096', fontSize: '0.9rem', fontWeight: '600' }}>Location</span>
                  <span style={{ color: '#0a1c3a', fontWeight: '800', fontSize: '1rem' }}>{project.city}</span>
                </div>
              </div>

              {!isMobile && (
                <div style={{ marginTop: '35px', display: 'flex', gap: '12px' }}>
                  <a
                    href="tel:+919264175587"
                    className="btn btn-primary"
                    style={{
                      flex: 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      padding: '15px 5px', borderRadius: '12px', fontWeight: '800',
                      textDecoration: 'none', fontSize: '0.8rem', transition: 'all 0.3s',
                      textTransform: 'uppercase'
                    }}
                  >
                    <i className="fas fa-phone-alt"></i>
                    Call
                  </a>
                  <Link
                    href="/contact"
                    className="btn btn-secondary"
                    style={{
                      flex: 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      padding: '15px 5px', borderRadius: '12px', fontWeight: '800',
                      textDecoration: 'none', fontSize: '0.8rem', transition: 'all 0.3s',
                      textTransform: 'uppercase'
                    }}
                  >
                    <i className="fas fa-envelope"></i>
                    Enquire
                  </Link>
                </div>
              )}
            </div>

            {/* Contact Info Card */}
            <div style={{
              backgroundColor: '#0a1c3a', borderRadius: '24px', padding: '35px',
              color: 'white', boxShadow: '0 20px 50px rgba(10,28,58,0.3)',
              position: 'relative', overflow: 'hidden'
            }}>
              {/* Decorative elements */}
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'rgba(198,156,109,0.1)' }}></div>
              
              <h3 style={{ color: 'white', fontWeight: '900', fontSize: '1.3rem', marginBottom: '25px', position: 'relative' }}>
                <i className="fas fa-headset" style={{ color: '#c69c6d', marginRight: '12px' }}></i>
                Need Assistance?
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '45px', height: '45px', borderRadius: '14px', backgroundColor: 'rgba(198,156,109,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className="fas fa-phone" style={{ color: '#c69c6d', fontSize: '1.1rem' }}></i>
                  </div>
                  <div>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginBottom: '4px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Phone</p>
                    <a href="tel:+919264175587" style={{ color: 'white', fontWeight: '800', textDecoration: 'none', fontSize: '1.1rem' }}>926-417-5587</a>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '45px', height: '45px', borderRadius: '14px', backgroundColor: 'rgba(198,156,109,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className="fas fa-envelope" style={{ color: '#c69c6d', fontSize: '1.1rem' }}></i>
                  </div>
                  <div>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginBottom: '4px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Email</p>
                    <a href="mailto:emailtotrx@gmail.com" style={{ color: 'white', fontWeight: '800', textDecoration: 'none', fontSize: '1rem' }}>emailtotrx@gmail.com</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Section */}
      <section style={{ backgroundColor: '#0a1c3a', padding: isMobile ? '60px 20px' : '100px 20px', textAlign: 'center', marginTop: '40px', position: 'relative', overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.05, backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: '#c69c6d', fontSize: '0.85rem', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: '800', marginBottom: '20px' }}>Interested in This Project?</p>
          <h2 style={{ color: 'white', fontSize: isMobile ? '2rem' : 'clamp(2rem, 4vw, 3.5rem)', fontWeight: '900', marginBottom: '40px', lineHeight: 1.2 }}>
            Get in Touch with Our Real Estate Experts
          </h2>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: isMobile ? 'nowrap' : 'wrap' }}>
            <Link href="/contact" className="btn btn-secondary" style={{
              flex: 1, padding: isMobile ? '14px 10px' : '20px 50px', borderRadius: '12px', fontWeight: '800',
              textDecoration: 'none', fontSize: isMobile ? '0.8rem' : '1rem', boxShadow: '0 10px 30px rgba(198,156,109,0.3)',
              whiteSpace: 'nowrap'
            }}>
              {isMobile ? 'Contact Us' : 'Contact Us Now'}
            </Link>
            <Link href="/projects" className="btn btn-outline-white" style={{
              flex: 1, padding: isMobile ? '14px 10px' : '20px 50px', borderRadius: '12px', fontWeight: '800',
              textDecoration: 'none', fontSize: isMobile ? '0.8rem' : '1rem', border: '2px solid rgba(255,255,255,0.3)', color: 'white',
              whiteSpace: 'nowrap'
            }}>
              {isMobile ? 'View All' : 'View Similar Projects'}
            </Link>
          </div>
        </div>
      </section>

      {/* Sticky Bottom CTA for Mobile */}
      {isMobile && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          backgroundColor: 'white', padding: '12px 15px',
          boxShadow: '0 -10px 30px rgba(0,0,0,0.1)',
          display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px', zIndex: 1000,
          borderTop: '1px solid #eee', boxSizing: 'border-box'
        }}>
          <a
            href="tel:+919264175587"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
              backgroundColor: '#0a1c3a', color: 'white',
              padding: '14px 2px', borderRadius: '12px', fontWeight: '800',
              textDecoration: 'none', fontSize: '0.7rem', textTransform: 'uppercase'
            }}
          >
            <i className="fas fa-phone-alt"></i> Call
          </a>
          <Link
            href="/contact"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
              backgroundColor: '#c69c6d', color: 'white',
              padding: '14px 2px', borderRadius: '12px', fontWeight: '800',
              textDecoration: 'none', fontSize: '0.7rem', textTransform: 'uppercase'
            }}
          >
            <i className="fas fa-envelope"></i> Enquire
          </Link>
        </div>
      )}
    </main>
  );
};

export default ProjectDetails;
