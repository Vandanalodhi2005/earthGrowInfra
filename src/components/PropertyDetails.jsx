'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import PropertyCard from './PropertyCard';
import { API_URL } from '../apiConfig';

const PropertyDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const [property, setProperty] = useState(null);
  const [relatedProperties, setRelatedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth <= 1024);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProperty();

    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await fetch(`${API_URL}/api/properties/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProperty(data);
        fetchRelatedProperties(data);
      } else {
        toast.error('Property not found');
        router.push('/properties');
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error('Error loading property details');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProperties = async (currentProp) => {
    try {
      const response = await fetch(`${API_URL}/api/properties`);
      if (response.ok) {
        const allProps = await response.json();
        const related = allProps
          .filter(p => p._id !== currentProp._id)
          .filter(p => p.propertyType === currentProp.propertyType || p.city === currentProp.city)
          .slice(0, 3);
        setRelatedProperties(related);
      }
    } catch (error) {
      console.error('Error fetching related properties:', error);
    }
  };

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

  const getStatusStyle = (status) => {
    switch (status) {
      case 'available': return { bg: '#ECFDF5', color: '#059669', border: '#A7F3D0' };
      case 'sold': return { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' };
      case 'rented': return { bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' };
      default: return { bg: '#F8FAFC', color: '#64748B', border: '#E2E8F0' };
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'available': return 'Available';
      case 'sold': return 'Sold Out';
      case 'rented': return 'Rented';
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

  if (!property) return null;
  const statusStyle = getStatusStyle(property.status);
  const propertyTitle = property.propertyName || `${property.bedroom ? property.bedroom + ' BHK ' : ''}${property.propertyType}`;
  const formattedAmenities = formatList(property.amenities);

  return (
    <main style={{ backgroundColor: '#f8f9fa', paddingBottom: isMobile ? '80px' : '0' }}>

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        height: isMobile ? '350px' : '65vh',
        minHeight: '350px',
        display: 'flex',
        alignItems: 'flex-end',
        overflow: 'hidden',
        backgroundColor: '#0a1c3a'
      }}>
        {property.images && property.images.length > 0 && (
          <img
            src={property.images[0]}
            alt={propertyTitle}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.45 }}
          />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,28,58,1) 0%, rgba(10,28,58,0.5) 60%, transparent 100%)' }}></div>

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          style={{
            position: 'absolute', 
            top: isMobile ? '90px' : '30px', 
            left: isMobile ? '15px' : '30px', 
            zIndex: 100,
            display: 'flex', alignItems: 'center', gap: '8px',
            backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.2)', color: 'white',
            padding: isMobile ? '8px 16px' : '10px 22px', 
            borderRadius: '50px', cursor: 'pointer',
            fontSize: isMobile ? '0.75rem' : '0.9rem', 
            fontWeight: '700', transition: 'all 0.3s',
            textTransform: 'uppercase', letterSpacing: '1px'
          }}
        >
          <i className="fas fa-arrow-left"></i> Back
        </button>

        <div style={{ position: 'relative', zIndex: 5, width: '100%', boxSizing: 'border-box', padding: isMobile ? '20px 15px 30px' : '60px 40px 60px' }}>
          <div className="container">
            {/* Badges */}
            <div style={{ 
              display: 'flex', 
              gap: '10px', 
              flexWrap: 'wrap', 
              marginBottom: '15px'
            }}>
              <span style={{
                backgroundColor: 'rgba(198,156,109,0.25)', color: '#c69c6d',
                padding: '5px 15px', borderRadius: '50px', fontSize: '0.65rem',
                fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px',
                border: '1px solid rgba(198,156,109,0.3)', backdropFilter: 'blur(5px)'
              }}>
                <i className="fas fa-home" style={{ marginRight: '6px' }}></i>
                {property.propertyType}
              </span>
              <span style={{
                backgroundColor: statusStyle.bg, color: statusStyle.color,
                padding: '5px 15px', borderRadius: '50px', fontSize: '0.65rem',
                fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px',
                border: `1px solid ${statusStyle.border}`, backdropFilter: 'blur(5px)'
              }}>
                {getStatusLabel(property.status)}
              </span>
            </div>

            <h1 style={{
              fontSize: isMobile ? '1.5rem' : '3.5rem', 
              fontWeight: '900', color: 'white',
              lineHeight: 1.2, marginBottom: '20px',
              textShadow: '0 4px 15px rgba(0,0,0,0.4)',
              maxWidth: '900px',
              wordBreak: 'break-word'
            }}>
              {propertyTitle}
            </h1>

            <div style={{ display: 'flex', gap: isMobile ? '15px' : '25px', flexWrap: 'wrap', opacity: 0.9 }}>
              <span style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '8px', fontSize: isMobile ? '0.85rem' : '1.1rem', fontWeight: '500' }}>
                <i className="fas fa-map-marker-alt" style={{ color: '#c69c6d' }}></i>
                {property.location}, {property.city}
              </span>
              <span style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '8px', fontSize: isMobile ? '0.85rem' : '1.1rem', fontWeight: '500' }}>
                <i className="fas fa-expand-arrows-alt" style={{ color: '#c69c6d' }}></i>
                {property.area?.toLocaleString()} {property.areaUnit || 'sq.ft'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Mobile Bottom CTA */}
      {isMobile && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          backgroundColor: 'white', padding: '12px 15px',
          display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px', zIndex: 1000,
          boxShadow: '0 -10px 25px rgba(0,0,0,0.1)',
          borderTop: '1px solid #eee',
          boxSizing: 'border-box'
        }}>
          <a href="tel:+919264175587" style={{
            backgroundColor: '#0a1c3a', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
            padding: '14px 2px', borderRadius: '12px', textDecoration: 'none',
            fontWeight: '800', fontSize: '0.7rem', textTransform: 'uppercase'
          }}>
            <i className="fas fa-phone-alt"></i> Call Now
          </a>
          <Link href="/contact" style={{
            backgroundColor: '#c69c6d', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
            padding: '14px 2px', borderRadius: '12px', textDecoration: 'none',
            fontWeight: '800', fontSize: '0.7rem', textTransform: 'uppercase'
          }}>
            <i className="fas fa-envelope"></i> Enquire
          </Link>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="container" style={{ padding: isMobile ? '25px 12px' : '60px 24px' }}>
        <div className="project-layout-grid">

          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '25px' : '40px' }}>

            {/* Image Gallery */}
            {property.images && property.images.length > 0 && (
              <div style={{ backgroundColor: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.06)', border: '1px solid #eee' }}>
                <div style={{ position: 'relative', aspectRatio: isMobile ? '4/3' : '16/9', overflow: 'hidden', backgroundColor: '#0a1c3a' }}>
                  <img
                    src={property.images[activeImage]}
                    alt={propertyTitle}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  
                  {/* Image Counter */}
                  <div style={{
                    position: 'absolute', bottom: '20px', right: '20px',
                    backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
                    color: 'white', padding: '6px 14px', borderRadius: '50px',
                    fontSize: '0.75rem', fontWeight: '800', zIndex: 10
                  }}>
                    {activeImage + 1} / {property.images.length}
                  </div>

                  {property.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveImage(i => (i - 1 + property.images.length) % property.images.length)}
                        style={{
                          position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)',
                          width: '40px', height: '40px', borderRadius: '50%',
                          backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.1)', color: '#0a1c3a', zIndex: 10
                        }}
                      >
                        <i className="fas fa-chevron-left"></i>
                      </button>
                      <button
                        onClick={() => setActiveImage(i => (i + 1) % property.images.length)}
                        style={{
                          position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)',
                          width: '40px', height: '40px', borderRadius: '50%',
                          backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.1)', color: '#0a1c3a', zIndex: 10
                        }}
                      >
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {property.images.length > 1 && (
                  <div style={{ display: 'flex', gap: '10px', padding: '15px', overflowX: 'auto', backgroundColor: '#fcfcfc' }}>
                    {property.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImage(index)}
                        style={{
                          flexShrink: 0, width: isMobile ? '70px' : '100px', height: isMobile ? '50px' : '70px', 
                          borderRadius: '12px', overflow: 'hidden', padding: 0,
                          border: activeImage === index ? '3px solid #c69c6d' : '3px solid #eee',
                          cursor: 'pointer', transition: 'all 0.2s',
                          transform: activeImage === index ? 'scale(0.95)' : 'scale(1)'
                        }}
                      >
                        <img src={img} alt={`Thumbnail ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Description Card */}
            <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: isMobile ? '25px 20px' : '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid #eee' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
                <div style={{ width: '5px', height: '35px', backgroundColor: '#c69c6d', borderRadius: '5px' }}></div>
                <h2 style={{ fontSize: isMobile ? '1.4rem' : '1.8rem', fontWeight: '900', color: '#0a1c3a', margin: 0, letterSpacing: '-0.5px' }}>Property Overview</h2>
              </div>
              <p style={{ color: '#444', lineHeight: '1.9', fontSize: isMobile ? '0.9rem' : '1.1rem', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {property.propertyDescription || property.description || 'No description available.'}
              </p>
            </div>

            {/* Amenities Grid */}
            {formattedAmenities.length > 0 && (
              <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: isMobile ? '25px 20px' : '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid #eee' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
                  <div style={{ width: '5px', height: '35px', backgroundColor: '#c69c6d', borderRadius: '5px' }}></div>
                  <h2 style={{ fontSize: isMobile ? '1.4rem' : '1.8rem', fontWeight: '900', color: '#0a1c3a', margin: 0, letterSpacing: '-0.5px' }}>Exclusive Amenities</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '15px' }}>
                  {formattedAmenities.map((a, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '15px',
                      padding: '18px 22px', backgroundColor: '#fcfcfc',
                      borderRadius: '16px', border: '1px solid #f0f0f0',
                      transition: 'all 0.3s ease'
                    }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#c69c6d' }}></div>
                      <span style={{ color: '#333', fontWeight: '700', fontSize: '1rem' }}>{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video Tour */}
            {property.youtubeUrl && (property.youtubeUrl.includes('youtube.com') || property.youtubeUrl.includes('youtu.be')) && (
              <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: isMobile ? '25px 20px' : '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid #eee' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
                  <div style={{ width: '5px', height: '35px', backgroundColor: '#ef4444', borderRadius: '5px' }}></div>
                  <h2 style={{ fontSize: isMobile ? '1.4rem' : '1.8rem', fontWeight: '900', color: '#0a1c3a', margin: 0, letterSpacing: '-0.5px' }}>
                    Experience in Motion
                  </h2>
                </div>
                <div style={{ borderRadius: '20px', overflow: 'hidden', aspectRatio: '16/9', boxShadow: '0 15px 40px rgba(0,0,0,0.15)' }}>
                  <iframe
                    src={property.youtubeUrl.replace('watch?v=', 'embed/').split('&')[0]}
                    title="Property Video Tour"
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN - Sticky Sidebar */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* Price & Summary Card */}
            <div style={{ 
              backgroundColor: 'white', borderRadius: '24px', padding: '35px', 
              boxShadow: '0 20px 50px rgba(10,28,58,0.08)', border: '1px solid #eee',
              position: isMobile ? 'static' : 'sticky', top: '110px'
            }}>
              <p style={{ fontSize: '0.7rem', fontWeight: '900', color: '#c69c6d', textTransform: 'uppercase', letterSpacing: '2.5px', marginBottom: '25px' }}>Premium Valuation</p>
              
              <div style={{ marginBottom: '30px', paddingBottom: '25px', borderBottom: '1px solid #f0f0f0' }}>
                <p style={{ color: '#888', fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px' }}>OFFERING PRICE</p>
                <h3 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#0a1c3a', margin: 0, display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                   <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#c69c6d' }}>₹</span>
                   {property.price?.toLocaleString()}
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '35px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#666', fontWeight: '600', fontSize: '0.95rem' }}>Area Size</span>
                  <span style={{ color: '#0a1c3a', fontWeight: '800', fontSize: '1.05rem' }}>{property.area?.toLocaleString()} {property.areaUnit || 'sq.ft'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#666', fontWeight: '600', fontSize: '0.95rem' }}>Property Type</span>
                  <span style={{ color: '#0a1c3a', fontWeight: '800', fontSize: '1.05rem', textTransform: 'capitalize' }}>{property.propertyType}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#666', fontWeight: '600', fontSize: '0.95rem' }}>Transaction</span>
                  <span style={{ color: '#c69c6d', fontWeight: '800', fontSize: '1.05rem', textTransform: 'uppercase' }}>For {property.transaction || 'Sale'}</span>
                </div>
              </div>

              {!isMobile && (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <a href="tel:+919264175587" className="btn btn-primary" style={{ 
                    flex: 1, 
                    padding: '15px 5px', 
                    borderRadius: '12px', 
                    fontWeight: '800', 
                    textTransform: 'uppercase', 
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}>
                    <i className="fas fa-phone-alt"></i> Call Now
                  </a>
                  <Link href="/contact" className="btn btn-outline-primary" style={{ 
                    flex: 1, 
                    padding: '15px 5px', 
                    borderRadius: '12px', 
                    fontWeight: '800', 
                    textTransform: 'uppercase', 
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}>
                    <i className="fas fa-envelope"></i> Enquire
                  </Link>
                </div>
              )}
              
              {/* Secondary Contact Info */}
              <div style={{ marginTop: '30px', paddingTop: '25px', borderTop: '1px solid #f0f0f0' }}>
                 <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0a1c3a', marginBottom: '15px' }}>Direct Support</h4>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(198,156,109,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c69c6d' }}>
                      <i className="fas fa-phone-alt" style={{ fontSize: '0.8rem' }}></i>
                    </div>
                    <a href="tel:+919264175587" style={{ color: '#444', fontWeight: '700', textDecoration: 'none', fontSize: '0.9rem' }}>+91 926-417-5587</a>
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(0,128,128,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#008080' }}>
                      <i className="fas fa-envelope" style={{ fontSize: '0.8rem' }}></i>
                    </div>
                    <a href="mailto:emailtotrx@gmail.com" style={{ color: '#444', fontWeight: '700', textDecoration: 'none', fontSize: '0.9rem' }}>emailtotrx@gmail.com</a>
                 </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Recommended Section */}
      {relatedProperties.length > 0 && (
        <section style={{ backgroundColor: 'white', padding: isMobile ? '60px 15px' : '100px 24px', borderTop: '1px solid #f0f0f0' }}>
          <div className="container">
             <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <span style={{ color: '#c69c6d', fontSize: '0.75rem', letterSpacing: '5px', textTransform: 'uppercase', fontWeight: '900', display: 'block', marginBottom: '15px' }}>Curation</span>
                <h2 style={{ color: '#0a1c3a', fontSize: isMobile ? '1.8rem' : '3rem', fontWeight: '900', margin: 0, letterSpacing: '-1px' }}>Related Properties</h2>
                <div style={{ width: '80px', height: '4px', backgroundColor: '#c69c6d', margin: '25px auto', borderRadius: '2px' }}></div>
             </div>
             <div className="property-grid" style={{ gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))' }}>
                {relatedProperties.map(p => (
                  <PropertyCard key={p._id} property={p} />
                ))}
             </div>
          </div>
        </section>
      )}

      {/* Bottom Visual Banner */}
      <section style={{ 
        backgroundColor: '#0a1c3a', 
        padding: isMobile ? '60px 15px' : '120px 24px', 
        textAlign: 'center',
        backgroundImage: "linear-gradient(rgba(10,28,58,0.95), rgba(10,28,58,0.95)), url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div className="container">
          <span style={{ color: '#c69c6d', fontSize: '0.8rem', letterSpacing: '6px', textTransform: 'uppercase', fontWeight: '900', marginBottom: '20px', display: 'block' }}>Exclusive Enquiry</span>
          <h2 style={{ color: 'white', fontSize: isMobile ? '1.8rem' : '3.5rem', fontWeight: '900', marginBottom: '40px', lineHeight: 1.1, maxWidth: '900px', margin: '0 auto 40px' }}>
            Looking for Similar Premium Assets?
          </h2>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: isMobile ? 'nowrap' : 'wrap' }}>
            <Link href="/contact" className="btn btn-secondary" style={{ flex: 1, padding: isMobile ? '16px 10px' : '18px 50px', borderRadius: '50px', fontWeight: '800', fontSize: isMobile ? '0.8rem' : '1rem', whiteSpace: 'nowrap' }}>
              {isMobile ? 'Consult Us' : 'Consult Our Xperts'}
            </Link>
            <Link href="/properties" className="btn" style={{ flex: 1, padding: isMobile ? '16px 10px' : '18px 50px', borderRadius: '50px', fontWeight: '800', fontSize: isMobile ? '0.8rem' : '1rem', border: '2px solid rgba(255,255,255,0.3)', color: 'white', whiteSpace: 'nowrap' }}>
              {isMobile ? 'Explore' : 'Explore Collection'}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PropertyDetails;