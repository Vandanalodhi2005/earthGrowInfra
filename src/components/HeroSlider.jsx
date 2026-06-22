import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HiArrowRight } from 'react-icons/hi';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    title: 'Discover Your Dream Home',
    subtitle: 'Explore our exclusive collection of luxury residential properties across the city.',
    link: '/residential',
    buttonText: 'View Residential'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    title: 'Premium Spaces for Your Business',
    subtitle: 'Find the perfect commercial property to elevate your enterprise to the next level.',
    link: '/commercial',
    buttonText: 'View Commercial'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    title: 'Invest in the Future',
    subtitle: 'Browse our latest projects and secure your investment in prime real estate.',
    link: '/projects',
    buttonText: 'Explore Projects'
  }
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth <= 1024);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(timer);
    };
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: isMobile ? '70vh' : '85vh', 
      minHeight: '500px', 
      overflow: 'hidden', 
      backgroundColor: '#0a1c3a' 
    }}>
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          style={{
            position: 'absolute',
            inset: 0,
            transition: 'opacity 1s ease-in-out',
            opacity: index === currentSlide ? 1 : 0,
            zIndex: index === currentSlide ? 10 : 0
          }}
        >
          {/* Background Image */}
          <div style={{ position: 'absolute', inset: 0 }}>
            <img
              src={slide.image}
              alt={slide.title}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                transform: index === currentSlide ? 'scale(1.1)' : 'scale(1)',
                transition: 'transform 10s linear'
              }}
            />
          </div>

          {/* Gradients */}
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            background: 'linear-gradient(to top, rgba(10, 28, 58, 0.9) 0%, rgba(10, 28, 58, 0.4) 50%, transparent 100%)' 
          }} />
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            background: 'linear-gradient(to right, rgba(10, 28, 58, 0.8) 0%, transparent 70%)' 
          }} />

          {/* Content Container */}
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            display: 'flex', 
            alignItems: 'center', 
            padding: isMobile ? '0 20px' : '0 60px',
            maxWidth: '1280px',
            margin: '0 auto'
          }}>
            <div style={{ 
              maxWidth: '800px',
              transition: 'all 1s transform, 1s opacity',
              transform: index === currentSlide ? 'translateY(0)' : 'translateY(30px)',
              opacity: index === currentSlide ? 1 : 0
            }}>
              <div style={{ 
                display: 'inline-block',
                padding: '6px 15px',
                backgroundColor: 'rgba(198, 156, 109, 0.15)',
                borderLeft: '3px solid #c69c6d',
                color: '#c69c6d',
                fontSize: '0.9rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                marginBottom: '20px',
                borderRadius: '0 4px 4px 0'
              }}>
                Where Dreams Meet Addresses
              </div>
              <h1 style={{ 
                fontSize: isMobile ? '2.5rem' : '4.5rem', 
                fontWeight: '800', 
                color: 'white', 
                marginBottom: '20px', 
                lineHeight: '1.1',
                textShadow: '0 4px 15px rgba(0,0,0,0.3)'
              }}>
                {slide.title}
              </h1>
              <p style={{ 
                fontSize: isMobile ? '1rem' : '1.25rem', 
                color: '#e2e8f0', 
                marginBottom: '35px', 
                maxWidth: '600px', 
                lineHeight: '1.6',
                borderLeft: '4px solid #c69c6d',
                paddingLeft: '20px'
              }}>
                {slide.subtitle}
              </p>
              
              <button
                onClick={() => router.push(slide.link)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  backgroundColor: '#c69c6d',
                  color: '#0a1c3a',
                  padding: isMobile ? '14px 28px' : '16px 40px',
                  borderRadius: '50px',
                  border: 'none',
                  fontWeight: '700',
                  fontSize: isMobile ? '0.85rem' : '1rem',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 10px 20px rgba(198, 156, 109, 0.3)',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 15px 30px rgba(198, 156, 109, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(198, 156, 109, 0.3)';
                }}
              >
                {slide.buttonText}
                <HiArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Dots */}
      <div style={{ 
        position: 'absolute', 
        bottom: '30px', 
        left: 0, 
        right: 0, 
        zIndex: 20, 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '12px' 
      }}>
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            style={{
              width: index === currentSlide ? '30px' : '10px',
              height: '10px',
              borderRadius: '10px',
              backgroundColor: index === currentSlide ? '#c69c6d' : 'rgba(255,255,255,0.5)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
