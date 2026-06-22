import { useState, useEffect } from 'react';
import { HiX, HiArrowsExpand, HiOutlinePhotograph, HiPlus } from 'react-icons/hi';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(9);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    fetchImages();
    window.scrollTo(0, 0);
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/gallery`);
      if (response.ok) {
        const data = await response.json();
        setImages(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching gallery images:', error);
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  const displayedImages = images.slice(0, visibleCount);

  if (loading) {
    return (
      <div style={{ position: 'fixed', inset: 0, backgroundColor: 'white', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #eee', borderTopColor: 'var(--color-gold)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9F9F9', marginBottom: '40px' }}>
      
      {/* Refined Hero Section */}
      <section style={{ 
        position: 'relative', 
        height: isMobile ? '25vh' : '35vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: 'var(--color-navy)',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.3 }}>
          <img 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            alt=""
          />
        </div>
        <div className="container" style={{ relative: 'zIndex 10', padding: '0 24px', textAlign: 'center' }}>
           <h1 style={{ 
             fontSize: isMobile ? '2rem' : '4rem', 
             fontWeight: 'bold', 
             color: 'white', 
             letterSpacing: isMobile ? '0.1em' : '0.2em', 
             textTransform: 'uppercase',
             margin: 0
           }}>
              Our Gallery
           </h1>
           <div style={{ width: '60px', height: '4px', backgroundColor: 'var(--color-gold)', margin: '20px auto' }}></div>
        </div>
      </section>

      {/* Main Gallery Grid */}
      <section style={{ padding: isMobile ? '40px 0' : '80px 0' }}>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: isMobile ? '20px' : '40px' 
          }}>
            {displayedImages.length > 0 ? (
              displayedImages.map((image, index) => (
                <div 
                  key={image._id || index}
                  className="animate-on-scroll"
                  style={{ opacity: 0, transition: 'all 0.8s ease-out', transitionDelay: `${(index % 3) * 100}ms` }}
                  onLoad={(e) => e.currentTarget.style.opacity = 1}
                >
                  <div 
                    style={{ 
                      position: 'relative', 
                      width: '100%', 
                      aspectRatio: '1/1', 
                      backgroundColor: 'white', 
                      boxShadow: '0 10px 30px rgba(0,0,0,0.05)', 
                      cursor: 'pointer', 
                      overflow: 'hidden', 
                      padding: '15px', 
                      border: '1px solid #eee',
                      borderRadius: '12px'
                    }}
                    onClick={() => setSelectedImage(image)}
                  >
                    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', backgroundColor: '#fcfcfc', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                      <img 
                        src={image.imageUrl} 
                        alt="" 
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transition: 'transform 0.6s ease' }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                      
                      <div className="gallery-overlay" style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(10,28,58,0.03)', opacity: 0, transition: 'opacity 0.3s' }}>
                         <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                            <HiArrowsExpand size={24} style={{ color: 'rgba(10,28,58,0.2)' }} />
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', padding: '100px 0', textAlign: 'center' }}>
                <HiOutlinePhotograph style={{ width: '40px', height: '40px', color: '#ddd', marginBottom: '20px' }} />
                <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'rgba(10,28,58,0.2)', textTransform: 'uppercase', letterSpacing: '2px' }}>Gallery Empty</p>
              </div>
            )}
          </div>

          {/* Load More Button */}
          {visibleCount < images.length && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: isMobile ? '50px' : '80px' }}>
              <button 
                onClick={() => setVisibleCount(prev => prev + 9)}
                style={{ 
                  backgroundColor: 'var(--color-navy)', 
                  color: 'white',
                  border: '1px solid var(--color-gold)',
                  letterSpacing: '0.2em',
                  fontSize: '0.8rem',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  padding: '16px 50px',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-gold)';
                  e.currentTarget.style.color = 'var(--color-navy)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-navy)';
                  e.currentTarget.style.color = 'white';
                }}
              >
                Explore More
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          style={{ 
            position: 'fixed', inset: 0, 
            backgroundColor: 'rgba(10,28,58,0.98)', 
            backdropFilter: 'blur(10px)', 
            zIndex: 9999, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: isMobile ? '20px' : '40px' 
          }}
          onClick={() => setSelectedImage(null)}
        >
          <button style={{ position: 'absolute', top: '30px', right: '30px', background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.6 }}>
            <HiX size={32} />
          </button>

          <div style={{ maxWidth: '1200px', width: '100%', maxHeight: '90vh', position: 'relative' }} onClick={e => e.stopPropagation()}>
             <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '8px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
                <img 
                  src={selectedImage.imageUrl} 
                  style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }} 
                  alt="" 
                />
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
