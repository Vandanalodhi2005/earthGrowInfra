'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { HiHome, HiOfficeBuilding, HiLocationMarker, HiCurrencyRupee, HiFilter, HiX, HiAdjustments } from 'react-icons/hi';
import PropertyCard from './PropertyCard';
import { API_URL } from '../apiConfig';

const Resale = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    propertyType: 'all',
    minPrice: '',
    maxPrice: '',
    location: '',
    status: 'all',
    bedroom: 'all',
    furnishing: 'all'
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth <= 1024);
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [propsRes, projsRes] = await Promise.all([
        fetch(`${API_URL}/api/properties`),
        fetch(`${API_URL}/api/projects?type=resale`)
      ]);

      const propsData = propsRes.ok ? await propsRes.json() : [];
      const projsData = projsRes.ok ? await projsRes.json() : [];

      // Filter propsData to only show resale properties
      const resaleProperties = propsData.filter(p => p.transaction === 'resale');
      
      // Mark projects explicitly as resale so they render nicely
      const resaleProjects = projsData.map(p => ({
        ...p,
        transaction: 'resale',
        isProjectCollection: true
      }));

      setProperties([...resaleProperties, ...resaleProjects]);
    } catch (error) {
      console.error('Error fetching resale data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    window.scrollTo(0, 0);
    
    if (initialSearch) {
      setFilters(prev => ({ ...prev, location: initialSearch }));
    }
  }, [fetchData, initialSearch]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setFilters({
      propertyType: 'all',
      minPrice: '',
      maxPrice: '',
      location: '',
      status: 'all',
      bedroom: 'all',
      furnishing: 'all'
    });
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'minPrice' || key === 'maxPrice' || key === 'location') return value !== '';
    return value !== 'all';
  });

  const filteredProperties = properties.filter(property => {
    if (filters.propertyType !== 'all') {
      let typeMatches = false;
      if (property.propertyType && property.propertyType === filters.propertyType) {
        typeMatches = true;
      } else if (property.type && property.type === filters.propertyType) {
        typeMatches = true;
      }
      if (!typeMatches) return false;
    }
    
    if (filters.minPrice && property.price < parseInt(filters.minPrice)) return false;
    if (filters.maxPrice && property.price > parseInt(filters.maxPrice)) return false;
    
    if (filters.location) {
      const term = filters.location.toLowerCase();
      const matches = (
        property.location?.toLowerCase().includes(term) ||
        property.city?.toLowerCase().includes(term) ||
        property.propertyName?.toLowerCase().includes(term) ||
        property.title?.toLowerCase().includes(term) ||
        property.description?.toLowerCase().includes(term)
      );
      if (!matches) return false;
    }

    if (filters.status !== 'all' && property.status !== filters.status) return false;
    if (filters.bedroom !== 'all' && property.bedroom?.toString() !== filters.bedroom) return false;
    if (filters.furnishing !== 'all' && property.furnishing !== filters.furnishing) return false;

    return true;
  });

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', paddingTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--color-gray)', borderTopColor: 'var(--color-navy)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', paddingTop: isMobile ? '60px' : '100px' }}>
      <section style={{ padding: isMobile ? '40px 0' : '60px 0' }}>
        <div className="container" style={{ padding: isMobile ? '0 15px' : '0 24px' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '30px' : '50px' }}>
            <span style={{ 
              display: 'inline-block', 
              color: 'var(--color-teal)', 
              fontWeight: '600', 
              textTransform: 'uppercase', 
              letterSpacing: isMobile ? '2px' : '4px', 
              fontSize: '0.8rem', 
              marginBottom: '10px' 
            }}>
              Pre-owned Luxury Assets
            </span>
            <h2 style={{ 
              fontSize: isMobile ? '2rem' : '3.5rem', 
              fontWeight: '800', 
              color: 'var(--color-navy)', 
              marginBottom: '15px',
              lineHeight: 1.2
            }}>
              Resale Portfolio
            </h2>
            <div style={{ 
              height: '3px', 
              width: '60px', 
              background: 'var(--color-gold)', 
              margin: '0 auto 20px', 
              borderRadius: '50px' 
            }}></div>
            <p style={{ 
              fontSize: isMobile ? '0.95rem' : '1.1rem', 
              color: '#666', 
              maxWidth: '700px', 
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              Explore premium pre-owned and resale assets offering maximum value in highly developed signature locations.
            </p>
          </div>

          {/* Filters Toggle for Mobile */}
          {isMobile && (
            <button 
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: 'var(--color-navy)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                marginBottom: '20px',
                boxShadow: '0 4px 15px rgba(10,28,58,0.2)'
              }}
            >
              <HiFilter /> {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          )}

          {/* Filters Container */}
          <div style={{ 
            display: (isMobile && !showMobileFilters) ? 'none' : 'block',
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: isMobile ? '20px' : '30px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            marginBottom: '40px',
            border: '1px solid #eee'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--color-navy)', fontWeight: '700', margin: 0 }}>
                <HiAdjustments style={{ color: 'var(--color-gold)', marginRight: '10px', verticalAlign: 'middle', display: 'inline-block' }} /> Filter Listings
              </h3>
              {hasActiveFilters && (
                <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}>
                  Clear All
                </button>
              )}
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(180px, 1fr))', 
              gap: '15px' 
            }}>
              
              <select name="propertyType" value={filters.propertyType} onChange={handleFilterChange} style={filterInputStyle}>
                <option value="all">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="plot">Plot</option>
                <option value="commercial">Commercial</option>
                <option value="investment">Investment</option>
              </select>

              <select name="bedroom" value={filters.bedroom} onChange={handleFilterChange} style={filterInputStyle}>
                <option value="all">Bedrooms (Any)</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4 BHK</option>
                <option value="5">5 BHK</option>
              </select>

              <select name="furnishing" value={filters.furnishing} onChange={handleFilterChange} style={filterInputStyle}>
                <option value="all">Furnishing (Any)</option>
                <option value="furnished">Furnished</option>
                <option value="semi-furnished">Semi-Furnished</option>
                <option value="unfurnished">Unfurnished</option>
              </select>

              <input type="number" name="minPrice" placeholder="Min Price (₹)" value={filters.minPrice} onChange={handleFilterChange} style={filterInputStyle} />
              <input type="number" name="maxPrice" placeholder="Max Price (₹)" value={filters.maxPrice} onChange={handleFilterChange} style={filterInputStyle} />
              <input type="text" name="location" placeholder="Search Location / Keyword..." value={filters.location} onChange={handleFilterChange} style={filterInputStyle} />
            </div>
          </div>

          {/* Properties Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: isMobile ? '20px' : '30px' 
          }}>
            {filteredProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <i className="fas fa-search" style={{ fontSize: '3rem', color: '#ddd', marginBottom: '20px' }}></i>
              <h3 style={{ color: 'var(--color-navy)', fontSize: '1.4rem' }}>No resale assets match your criteria</h3>
              <p style={{ color: '#888' }}>Try adjusting your filters or clearing them to see all resale options.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

const filterInputStyle = {
  width: '100%',
  padding: '12px 15px',
  borderRadius: '8px',
  border: '1px solid #ddd',
  outline: 'none',
  fontSize: '0.9rem',
  color: '#333',
  backgroundColor: '#f9f9f9',
  transition: 'border-color 0.2s'
};

export default Resale;
