import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiLocationMarker, HiCurrencyRupee, HiCheckCircle, HiExclamation, HiPhone, HiHome } from 'react-icons/hi';
import { FaBed, FaBath, FaRuler, FaDoorOpen } from 'react-icons/fa';
import toast from 'react-hot-toast';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setError(null);
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      
      if (!backendUrl) {
        throw new Error('Backend URL not configured');
      }

      const response = await fetch(`${backendUrl}/api/properties/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid property data received');
      }

      setProperty(data);
    } catch (error) {
      console.error('Error fetching property:', error);
      setError(error.message || 'Failed to load property details');
      toast.error('Failed to load property');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async () => {
    setRetrying(true);
    setLoading(true);
    await fetchProperty();
    setRetrying(false);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'available': return { bg: '#dcfce7', color: '#16a34a', label: 'Available' };
      case 'sold': return { bg: '#fee2e2', color: '#dc2626', label: 'Sold' };
      case 'upcoming': return { bg: '#dbeafe', color: '#0284c7', label: 'Under Construction' };
      default: return { bg: '#f3f4f6', color: '#374151', label: status };
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'linear-gradient(to bottom right, #f1f5f9, #ffffff)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ animation: 'spin 1s linear infinite', borderRadius: '50%', height: '64px', width: '64px', border: '4px solid #bfdbfe', borderTop: '4px solid #2563eb', margin: '0 auto 16px' }}></div>
          <p style={{ color: '#475569', fontWeight: '500' }}>Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'linear-gradient(to bottom right, #f1f5f9, #ffffff)', padding: '16px' }}>
        <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '32px', maxWidth: '448px', textAlign: 'center' }}>
          <HiExclamation style={{ width: '64px', height: '64px', color: '#ef4444', margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>Error Loading Property</h2>
          <p style={{ color: '#475569', marginBottom: '24px' }}>{error}</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleRetry}
              disabled={retrying}
              style={{
                flex: 1,
                background: retrying ? '#94a3b8' : '#2563eb',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.3s'
              }}
              onMouseEnter={(e) => !retrying && (e.target.style.background = '#1d4ed8')}
              onMouseLeave={(e) => !retrying && (e.target.style.background = '#2563eb')}
            >
              {retrying ? 'Retrying...' : 'Try Again'}
            </button>
            <button
              onClick={() => navigate('/properties')}
              style={{
                flex: 1,
                border: '2px solid #2563eb',
                color: '#2563eb',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: '600',
                background: 'transparent',
                cursor: 'pointer',
                transition: 'background 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#eff6ff'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'linear-gradient(to bottom right, #f1f5f9, #ffffff)', padding: '16px' }}>
        <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '32px', maxWidth: '448px', textAlign: 'center' }}>
          <HiExclamation style={{ width: '64px', height: '64px', color: '#f59e0b', margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>Property Not Found</h2>
          <p style={{ color: '#475569', marginBottom: '24px' }}>The property you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/properties')}
            style={{
              display: 'inline-block',
              background: '#2563eb',
              color: 'white',
              padding: '8px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.3s'
            }}
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  const statusColor = getStatusColor(property.status);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #f1f5f9, #ffffff)' }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px' }}>
          <button
            onClick={() => navigate('/properties')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              color: '#475569',
              textDecoration: 'none',
              fontWeight: '500',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'color 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#2563eb'}
            onMouseLeave={(e) => e.target.style.color = '#475569'}
          >
            <HiArrowLeft style={{ width: '20px', height: '20px', marginRight: '8px' }} />
            Back to Properties
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          
          {/* Image Gallery */}
          <div style={{ gridColumn: 'span 2' }}>
            {/* Main Image */}
            <div style={{ background: '#cbd5e1', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ aspectRatio: '16/10', background: '#e2e8f0', position: 'relative', overflow: 'hidden' }}>
                {property.images && property.images.length > 0 ? (
                  <>
                    <img
                      src={property.images[activeImage]}
                      alt={property.propertyName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0, 0, 0, 0.6)', color: 'white', padding: '8px 12px', borderRadius: '9999px', fontSize: '14px', fontWeight: '600' }}>
                      {activeImage + 1} / {property.images.length}
                    </div>
                  </>
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom right, #f0fdf4, #dcfce7)' }}>
                    <HiHome style={{ width: '80px', height: '80px', color: '#4ade80' }} />
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {property.images && property.images.length > 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))', gap: '8px' }}>
                {property.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    style={{
                      aspectRatio: '1',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: activeImage === index ? '2px solid #2563eb' : '2px solid #e2e8f0',
                      boxShadow: activeImage === index ? '0 0 0 2px #bfdbfe' : 'none',
                      cursor: 'pointer',
                      transform: 'scale(1)',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    <img src={img} alt={`View ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Info Card */}
          <div style={{ gridColumn: 'span 1' }}>
            {/* Status & Type */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              <span style={{
                padding: '8px 16px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 'bold',
                background: statusColor.bg,
                color: statusColor.color,
                display: 'inline-block',
                width: 'fit-content'
              }}>
                {statusColor.label}
              </span>
              <span style={{
                padding: '8px 16px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 'bold',
                background: '#f3f4f6',
                color: '#374151',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                width: 'fit-content'
              }}>
                <HiHome style={{ width: '12px', height: '12px' }} />
                {property.propertyType}
              </span>
            </div>

            {/* Title & Location */}
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px', lineHeight: '1.25' }}>
                {property.propertyName || `${property.bedroom} BHK ${property.propertyType}`}
              </h1>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#475569' }}>
                <HiLocationMarker style={{ width: '20px', height: '20px', marginTop: '4px', flexShrink: 0, color: '#2563eb' }} />
                <div>
                  <p style={{ fontWeight: '600' }}>{property.location}</p>
                  <p style={{ fontSize: '14px', color: '#64748b' }}>{property.city}</p>
                </div>
              </div>
            </div>

            {/* Price Box */}
            <div style={{ background: 'linear-gradient(to bottom right, #eff6ff, #e0f2fe)', border: '1px solid #bfdbfe', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Price */}
                <div>
                  <p style={{ fontSize: '12px', color: '#475569', fontWeight: 'bold', letterSpacing: '0.1em', marginBottom: '4px', textTransform: 'uppercase' }}>Price</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <HiCurrencyRupee style={{ width: '28px', height: '28px', color: '#2563eb' }} />
                    <p style={{ fontSize: '32px', fontWeight: '900', color: '#1d4ed8' }}>
                      {property.price ? property.price.toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Key Details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '12px', borderTop: '1px solid #bfdbfe' }}>
                  {property.bedroom && (
                    <div>
                      <p style={{ fontSize: '12px', color: '#475569', fontWeight: 'bold', marginBottom: '4px' }}>Bedrooms</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FaBed style={{ width: '16px', height: '16px', color: '#2563eb' }} />
                        <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>{property.bedroom}</p>
                      </div>
                    </div>
                  )}
                  {property.bathroom && (
                    <div>
                      <p style={{ fontSize: '12px', color: '#475569', fontWeight: 'bold', marginBottom: '4px' }}>Bathrooms</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FaBath style={{ width: '16px', height: '16px', color: '#2563eb' }} />
                        <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>{property.bathroom}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Area */}
                {property.area && (
                  <div style={{ paddingTop: '12px', borderTop: '1px solid #bfdbfe' }}>
                    <p style={{ fontSize: '12px', color: '#475569', fontWeight: 'bold', marginBottom: '4px' }}>Built Area</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FaRuler style={{ width: '16px', height: '16px', color: '#2563eb' }} />
                      <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>{property.area.toLocaleString()} sq.ft</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a
                href={`tel:+919406650197`}
                style={{
                  width: '100%',
                  background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
                  color: 'white',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => { e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.15)'; e.target.style.background = 'linear-gradient(to right, #1d4ed8, #1e40af)'; }}
                onMouseLeave={(e) => { e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'; e.target.style.background = 'linear-gradient(to right, #2563eb, #1d4ed8)'; }}
              >
                <HiPhone style={{ width: '20px', height: '20px' }} />
                Call Now
              </a>
              <a
                href={`https://wa.me/919406650197?text=Hi%20I%20am%20interested%20in%20this%20property:%20${property.propertyName}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '100%',
                  background: 'linear-gradient(to right, #16a34a, #15803d)',
                  color: 'white',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => { e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.15)'; e.target.style.background = 'linear-gradient(to right, #15803d, #166534)'; }}
                onMouseLeave={(e) => { e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'; e.target.style.background = 'linear-gradient(to right, #16a34a, #15803d)'; }}
              >
                💬 WhatsApp
              </a>
              <Link
                to="/contact"
                style={{
                  width: '100%',
                  border: '2px solid #2563eb',
                  color: '#2563eb',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  transition: 'all 0.3s',
                  display: 'block'
                }}
                onMouseEnter={(e) => { e.target.style.background = '#eff6ff'; e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'; }}
                onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.boxShadow = 'none'; }}
              >
                Inquire Now
              </Link>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div style={{ marginTop: '48px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
          <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Description */}
            {property.description && (
              <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '4px', height: '32px', background: '#2563eb', borderRadius: '9999px' }}></div>
                  About This Property
                </h3>
                <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '16px', whiteSpace: 'pre-wrap' }}>
                  {property.description}
                </p>
              </div>
            )}

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '4px', height: '32px', background: '#16a34a', borderRadius: '9999px' }}></div>
                  Amenities & Features
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  {property.amenities.map((amenity, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
                      <HiCheckCircle style={{ width: '20px', height: '20px', color: '#16a34a', flexShrink: 0 }} />
                      <span style={{ color: '#1f2937', fontWeight: '500' }}>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Side Info */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ background: 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', border: '1px solid #e5e7eb', position: 'sticky', top: '100px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', marginBottom: '16px' }}>Property Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0', fontSize: '14px' }}>
                {property.bedroom && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                    <span style={{ color: '#475569' }}>Bedrooms</span>
                    <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{property.bedroom}</span>
                  </div>
                )}
                {property.bathroom && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                    <span style={{ color: '#475569' }}>Bathrooms</span>
                    <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{property.bathroom}</span>
                  </div>
                )}
                {property.area && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                    <span style={{ color: '#475569' }}>Built Area</span>
                    <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{property.area.toLocaleString()} sq.ft</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                  <span style={{ color: '#475569' }}>Status</span>
                  <span style={{ fontWeight: 'bold', color: '#0f172a', textTransform: 'capitalize' }}>{property.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
