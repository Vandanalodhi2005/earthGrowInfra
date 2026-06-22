import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiLocationMarker, HiCurrencyRupee, HiCheckCircle, HiExclamation, HiPhone, HiFire } from 'react-icons/hi';
import { FaCalendarAlt, FaBuilding, FaUsers } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [retrying, setRetrying] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProject();

    const handleResize = () => setIsMobile(window.innerWidth <= 768);
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
      setError(null);
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      
      if (!backendUrl) {
        throw new Error('Backend URL not configured');
      }

      const response = await fetch(`${backendUrl}/api/projects/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid project data received');
      }

      setProject(data);
    } catch (error) {
      console.error('Error fetching project:', error);
      setError(error.message || 'Failed to load project details');
      toast.error('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async () => {
    setRetrying(true);
    setLoading(true);
    await fetchProject();
    setRetrying(false);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'upcoming': return { bg: '#fef3c7', color: '#d97706', label: '🏗️ Under Construction' };
      case 'under-construction': return { bg: '#fef3c7', color: '#d97706', label: '🏗️ Under Construction' };
      case 'completed': return { bg: '#dcfce7', color: '#16a34a', label: '✨ Completed' };
      case 'ready-to-move': return { bg: '#e0e7ff', color: '#4f46e5', label: '🔑 Ready to Move' };
      default: return { bg: '#f3f4f6', color: '#374151', label: status };
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'linear-gradient(to bottom right, #f1f5f9, #ffffff)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ animation: 'spin 1s linear infinite', borderRadius: '50%', height: '64px', width: '64px', border: '4px solid #bfdbfe', borderTop: '4px solid #2563eb', margin: '0 auto 16px' }}></div>
          <p style={{ color: '#475569', fontWeight: '500' }}>Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'linear-gradient(to bottom right, #f1f5f9, #ffffff)', padding: '16px' }}>
        <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '32px', maxWidth: '448px', textAlign: 'center' }}>
          <HiExclamation style={{ width: '64px', height: '64px', color: '#ef4444', margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>Error Loading Project</h2>
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
              onClick={() => navigate('/projects')}
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

  if (!project) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'linear-gradient(to bottom right, #f1f5f9, #ffffff)', padding: '16px' }}>
        <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '32px', maxWidth: '448px', textAlign: 'center' }}>
          <HiExclamation style={{ width: '64px', height: '64px', color: '#f59e0b', margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>Project Not Found</h2>
          <p style={{ color: '#475569', marginBottom: '24px' }}>The project you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/projects')}
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
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const statusColor = getStatusColor(project.status);
  const formattedHighlights = formatList(project.highlights);
  const formattedAmenities = formatList(project.amenities);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #f1f5f9, #ffffff)' }}>
      {/* Header */}
      <div style={{ 
        background: 'white', 
        borderBottom: '1px solid #e2e8f0', 
        position: 'sticky', 
        top: 0, 
        zIndex: 100 
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: isMobile ? '12px 16px' : '16px' }}>
          <button
            onClick={() => navigate('/projects')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              color: '#475569',
              textDecoration: 'none',
              fontWeight: '500',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'color 0.3s',
              fontSize: isMobile ? '0.85rem' : '1rem'
            }}
            onMouseEnter={(e) => e.target.style.color = '#2563eb'}
            onMouseLeave={(e) => e.target.style.color = '#475569'}
          >
            <HiArrowLeft style={{ width: '20px', height: '20px', marginRight: '8px' }} />
            Back to Projects
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: isMobile ? '20px 15px' : '32px 16px' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: isMobile ? '24px' : '32px' 
        }}>
          
          {/* Image Gallery */}
          <div style={{ gridColumn: isMobile ? 'span 1' : 'span 2' }}>
            {/* Main Image */}
            <div style={{ background: '#cbd5e1', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ aspectRatio: isMobile ? '4/3' : '16/10', background: '#e2e8f0', position: 'relative', overflow: 'hidden' }}>
                {project.images && project.images.length > 0 ? (
                  <>
                    <img
                      src={project.images[activeImage]}
                      alt={project.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0, 0, 0, 0.6)', color: 'white', padding: '6px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '600' }}>
                      {activeImage + 1} / {project.images.length}
                    </div>
                  </>
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom right, #f0fdf4, #dcfce7)' }}>
                    <FaBuilding style={{ width: '80px', height: '80px', color: '#4ade80' }} />
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {project.images && project.images.length > 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(4, 1fr)' : 'repeat(auto-fit, minmax(60px, 1fr))', gap: '8px' }}>
                {project.images.map((img, index) => (
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
                      transition: 'all 0.3s',
                      padding: 0
                    }}
                  >
                    <img src={img} alt={`View ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Info Card */}
          <div style={{ gridColumn: 'span 1' }}>
            {/* Status Badge */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <span style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: 'bold',
                background: statusColor.bg,
                color: statusColor.color,
                display: 'inline-block'
              }}>
                {statusColor.label}
              </span>
              <span style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: 'bold',
                background: '#f3f4f6',
                color: '#374151',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <FaBuilding style={{ width: '11px', height: '11px' }} />
                {project.projectType || 'Development'}
              </span>
            </div>

            {/* Title & Location */}
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ 
                fontSize: isMobile ? '24px' : '32px', 
                fontWeight: 'bold', 
                color: '#0f172a', 
                marginBottom: '8px', 
                lineHeight: '1.2' 
              }}>
                {project.title}
              </h1>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#475569' }}>
                <HiLocationMarker style={{ width: '18px', height: '18px', marginTop: '4px', flexShrink: 0, color: '#2563eb' }} />
                <div>
                  <p style={{ fontWeight: '600', fontSize: isMobile ? '0.9rem' : '1rem' }}>{project.location}</p>
                  <p style={{ fontSize: '13px', color: '#64748b' }}>{project.city}</p>
                </div>
              </div>
            </div>

            {/* Details Box */}
            <div style={{ background: 'linear-gradient(to bottom right, #eff6ff, #e0f2fe)', border: '1px solid #bfdbfe', borderRadius: '16px', padding: isMobile ? '16px' : '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#475569', fontWeight: 'bold', letterSpacing: '0.05em', marginBottom: '4px', textTransform: 'uppercase' }}>Status</p>
                  <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#1d4ed8', textTransform: 'capitalize' }}>
                    {project.status?.replace('-', ' ')}
                  </p>
                </div>

                {project.totalUnits && (
                  <div style={{ paddingTop: '10px', borderTop: '1px solid rgba(37, 99, 235, 0.1)' }}>
                    <p style={{ fontSize: '11px', color: '#475569', fontWeight: 'bold', marginBottom: '4px' }}>Total Units</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FaUsers style={{ width: '14px', height: '14px', color: '#2563eb' }} />
                      <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a' }}>{project.totalUnits}</p>
                    </div>
                  </div>
                )}

                {project.area && (
                  <div style={{ paddingTop: '10px', borderTop: '1px solid rgba(37, 99, 235, 0.1)' }}>
                    <p style={{ fontSize: '11px', color: '#475569', fontWeight: 'bold', marginBottom: '4px' }}>Total Area</p>
                    <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a' }}>{project.area.toLocaleString()} sq.ft</p>
                  </div>
                )}
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a
                href={`tel:+919406650197`}
                style={{
                  width: '100%',
                  background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
                  color: 'white',
                  padding: '12px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '0.9rem'
                }}
              >
                <HiPhone style={{ width: '18px', height: '18px' }} />
                Call Now
              </a>
              <a
                href={`https://wa.me/919406650197?text=Hi%20I%20am%20interested%20in%20this%20project:%20${project.title}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '100%',
                  background: 'linear-gradient(to right, #16a34a, #15803d)',
                  color: 'white',
                  padding: '12px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  fontSize: '0.9rem'
                }}
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div style={{ 
          marginTop: isMobile ? '32px' : '48px', 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', 
          gap: '32px' 
        }}>
          <div style={{ gridColumn: isMobile ? 'span 1' : 'span 2', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Description */}
            {project.description && (
              <div style={{ background: 'white', borderRadius: '16px', padding: isMobile ? '20px' : '24px', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '4px', height: '24px', background: '#2563eb', borderRadius: '9999px' }}></div>
                  About This Project
                </h3>
                <p style={{ color: '#475569', lineHeight: '1.7', fontSize: isMobile ? '14px' : '16px', whiteSpace: 'pre-wrap' }}>
                  {project.description}
                </p>
              </div>
            )}

            {/* Highlights */}
            {formattedHighlights.length > 0 && (
              <div style={{ background: 'white', borderRadius: '16px', padding: isMobile ? '20px' : '24px', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '4px', height: '24px', background: '#16a34a', borderRadius: '9999px' }}></div>
                  Key Highlights
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {formattedHighlights.map((highlight, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
                      <HiCheckCircle style={{ width: '18px', height: '18px', color: '#16a34a', flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ color: '#1f2937', fontWeight: '500', fontSize: '14px' }}>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {formattedAmenities.length > 0 && (
              <div style={{ background: 'white', borderRadius: '16px', padding: isMobile ? '20px' : '24px', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '4px', height: '24px', background: '#a855f7', borderRadius: '9999px' }}></div>
                  Amenities & Facilities
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {formattedAmenities.map((amenity, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: '#f3e8ff', borderRadius: '8px', border: '1px solid #e9d5ff' }}>
                      <HiCheckCircle style={{ width: '16px', height: '16px', color: '#a855f7', flexShrink: 0 }} />
                      <span style={{ color: '#1f2937', fontWeight: '500', fontSize: '13px' }}>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Side Summary Info (Hidden on Mobile if needed, or moved below) */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ background: 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', border: '1px solid #e5e7eb', position: isMobile ? 'static' : 'sticky', top: '100px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', marginBottom: '14px' }}>Project Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: '6px' }}>
                  <span style={{ color: '#475569' }}>Status</span>
                  <span style={{ fontWeight: 'bold', color: '#0f172a', textTransform: 'capitalize' }}>{project.status?.replace('-', ' ')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: '6px' }}>
                  <span style={{ color: '#475569' }}>Type</span>
                  <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{project.projectType || 'Mixed'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: '6px' }}>
                  <span style={{ color: '#475569' }}>Location</span>
                  <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{project.city}</span>
                </div>
                {project.totalUnits && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#475569' }}>Total Units</span>
                    <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{project.totalUnits}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ProjectDetails;
