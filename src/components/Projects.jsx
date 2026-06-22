'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PropertyCard from './PropertyCard';
import { API_URL } from '../apiConfig';

const Projects = ({ type = 'all' }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth <= 1024);
  const [filters, setFilters] = useState({ title: '', category: '', type: '', status: '', minPrice: '', maxPrice: '', location: '', city: '' });
  const router = useRouter();

  // Input style for filter form
  const inputStyle = {
    padding: '10px 15px',
    border: '1px solid #E0E0E0',
    borderRadius: '6px',
    fontSize: '0.95rem',
    color: 'var(--color-navy)',
    outline: 'none',
    backgroundColor: '#FAFAFA',
    fontFamily: 'inherit',
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchProjects();
    window.scrollTo(0, 0);
  }, [type]);

  // Compute filtered projects based on user-defined filters
  const filteredProjects = projects.filter((project) => {
    let typeMatches = true;
    if (filters.type) {
       if (project.category === 'commercial') {
           typeMatches = (project.commercialTypes && project.commercialTypes.includes(filters.type)) || project.type === filters.type;
       } else {
           typeMatches = project.type === filters.type;
       }
    }
    
    const matchesFilters =
      (filters.title ? project.title?.toLowerCase().includes(filters.title.toLowerCase()) : true) &&
      typeMatches &&
      (filters.status ? project.status === filters.status : true) &&
      (filters.minPrice ? Number(project.price) >= Number(filters.minPrice) : true) &&
      (filters.maxPrice ? Number(project.price) <= Number(filters.maxPrice) : true) &&
      (filters.location ? (project.location?.toLowerCase().includes(filters.location.toLowerCase()) || project.city?.toLowerCase().includes(filters.location.toLowerCase())) : true) &&
      (filters.city ? project.city?.toLowerCase().includes(filters.city.toLowerCase()) : true) &&
      (filters.description ? project.description?.toLowerCase().includes(filters.description.toLowerCase()) : true) &&
      (filters.highlights ? (project.highlights || '').toLowerCase().includes(filters.highlights.toLowerCase()) : true) &&
      (filters.amenities ? (project.amenities || '').toLowerCase().includes(filters.amenities.toLowerCase()) : true);
    return matchesFilters;
  });

const projectMatches = filteredProjects;

  const fetchProjects = async () => {
    try {
      const url = type && type !== 'all' 
        ? `${API_URL}/api/projects?type=${type}`
        : `${API_URL}/api/projects`;
        
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #eee', borderTopColor: 'var(--color-navy)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', paddingTop: isMobile ? '60px' : '100px' }}>
      <section style={{ padding: isMobile ? '40px 0' : '80px 0' }}>
        <div className="container" style={{ padding: isMobile ? '0 15px' : '0 24px' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '30px' : '60px' }}>
            <span style={{ 
              display: 'inline-block', 
              color: 'var(--color-teal)', 
              fontWeight: '600', 
              textTransform: 'uppercase', 
              letterSpacing: isMobile ? '2px' : '4px', 
              fontSize: '0.8rem', 
              marginBottom: '10px' 
            }}>
              Signature Portfolio
            </span>
            <h2 style={{ 
              fontSize: isMobile ? '2rem' : '3.5rem', 
              fontWeight: '900', 
              color: 'var(--color-navy)', 
              marginBottom: '15px',
              textTransform: 'capitalize',
              lineHeight: 1.2
            }}>
              {type !== 'all' ? `${type} Projects` : 'Our Signature Projects'}
            </h2>
            <div style={{ 
              height: '3px', 
              width: '80px', 
              background: 'var(--color-gold)', 
              margin: '0 auto 25px', 
              borderRadius: '50px' 
            }}></div>
            <p style={{ 
              fontSize: isMobile ? '0.95rem' : '1.15rem', 
              color: '#555', 
              maxWidth: '800px', 
              margin: '0 auto',
              lineHeight: 1.7
            }}>
              Discover our premium residential and commercial projects elegantly designed to meet your discerning lifestyle needs.
            </p>
          </div>

              {/* Filter Form */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
              {/* Title */}
              <input name="title" value={filters.title} onChange={handleFilterChange} placeholder="Title" style={inputStyle} />
                {/* Type */}
                {type === 'commercial' ? (
                <select name="type" value={filters.type} onChange={handleFilterChange} style={inputStyle}>
                  <option value="">All Types</option>
                  <option value="Retail Shops">Retail Shops</option>
                  <option value="Food Court">Food Court</option>
                  <option value="Gaming Zone">Gaming Zone</option>
                  <option value="Multiplex">Multiplex</option>
                  <option value="Office Space">Office Space</option>
                  <option value="Studio">Studio</option>
                </select>
                ) : type === 'residential' ? (
                <select name="type" value={filters.type} onChange={handleFilterChange} style={inputStyle}>
                  <option value="">All Types</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="plot">Plot</option>
                </select>
                ) : (
                <select name="type" value={filters.type} onChange={handleFilterChange} style={inputStyle}>
                  <option value="">All Types</option>
                  <option value="Retail Shops">Retail Shops</option>
                  <option value="Food Court">Food Court</option>
                  <option value="Gaming Zone">Gaming Zone</option>
                  <option value="Multiplex">Multiplex</option>
                  <option value="Office Space">Office Space</option>
                  <option value="Studio">Studio</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="plot">Plot</option>
                </select>
                )}
              {/* Status */}
              <select name="status" value={filters.status} onChange={handleFilterChange} style={inputStyle}>
                <option value="">Any Status</option>
                <option value="under-construction">Under Construction</option>
                <option value="ready-to-move">Ready to Move</option>
                <option value="completed">Completed</option>
              </select>
              {/* Price range */}
              <input name="minPrice" type="number" value={filters.minPrice} onChange={handleFilterChange} placeholder="Min Price" style={inputStyle} />
              <input name="maxPrice" type="number" value={filters.maxPrice} onChange={handleFilterChange} placeholder="Max Price" style={inputStyle} />
              {/* Location */}
              <input name="location" value={filters.location} onChange={handleFilterChange} placeholder="Location/Area" style={inputStyle} />
              {/* City */}
              <input name="city" value={filters.city} onChange={handleFilterChange} placeholder="City" style={inputStyle} />
              {/* Description */}
              <input name="description" value={filters.description} onChange={handleFilterChange} placeholder="Description" style={inputStyle} />
              {/* Highlights */}
              <input name="highlights" value={filters.highlights} onChange={handleFilterChange} placeholder="Highlights" style={inputStyle} />
              {/* Amenities */}
              <input name="amenities" value={filters.amenities} onChange={handleFilterChange} placeholder="Amenities" style={inputStyle} />
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: isMobile ? '20px' : '35px'
            }}>
              {projectMatches.length > 0 ? (
                projectMatches.map((project) => (
                  <div key={project._id} style={{ border: '1px solid #E6E9EF', borderRadius: '12px', padding: '20px', backgroundColor: 'white' }}>
                    <PropertyCard property={project} />
                  </div>
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0' }}>
                  <i className="fas fa-city" style={{ fontSize: '4rem', color: '#eee', marginBottom: '25px' }}></i>
                  <h3 style={{ fontSize: '1.5rem', color: 'var(--color-navy)', fontWeight: '700' }}>No Matching Projects Found</h3>
                  <p style={{ color: '#888' }}>No projects contain the specified keywords.</p>
                </div>
              )}
            </div>

          {/* CTA Section */}
          <section style={{ 
            backgroundColor: 'var(--color-navy)', 
            color: 'white', 
            textAlign: 'center', 
            marginTop: isMobile ? '40px' : '80px', 
            borderRadius: '20px',
            padding: isMobile ? '40px 20px' : '60px 40px',
            boxShadow: '0 15px 35px rgba(10,28,58,0.15)',
            position: 'relative',
            overflow: 'hidden'
          }}>
             <div style={{ position: 'relative', zIndex: 2 }}>
                <h2 style={{ color: 'white', fontSize: isMobile ? '1.8rem' : '2.8rem', fontWeight: '800', marginBottom: '20px' }}>
                  Interested in Our Projects?
                </h2>
                <p style={{ fontSize: isMobile ? '0.95rem' : '1.2rem', maxWidth: '700px', margin: '0 auto 35px', opacity: 0.9, lineHeight: 1.6 }}>
                  Get detailed priority information about our ongoing and upcoming signature projects before they hit the open market.
                </p>
                <Link 
                  href="/contact" 
                  className="btn btn-secondary" 
                  style={{ 
                    padding: isMobile ? '12px 30px' : '16px 50px', 
                    fontSize: isMobile ? '0.9rem' : '1.1rem',
                    borderRadius: '50px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 15px rgba(198,156,109,0.3)'
                  }}
                >
                  Get Priority Access
                </Link>
             </div>
             {/* Decorative Background Element */}
             <div style={{ 
               position: 'absolute', 
               top: '-50px', 
               right: '-50px', 
               width: '200px', 
               height: '200px', 
               background: 'rgba(198,156,109,0.05)', 
               borderRadius: '50%' 
             }}></div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default Projects;