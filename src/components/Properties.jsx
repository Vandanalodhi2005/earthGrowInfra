'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { HiHome, HiOfficeBuilding, HiLocationMarker, HiCurrencyRupee, HiFilter, HiX } from 'react-icons/hi';
import PropTypes from 'prop-types';
import PropertyCard from './PropertyCard';
import { API_URL } from '../apiConfig';

const Properties = ({ category = 'all' }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'all',
    propertyType: 'all',
    minPrice: '',
    maxPrice: '',
    location: '',
    transaction: 'all',
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
        fetch(`${API_URL}/api/projects`)
      ]);

      const propsData = propsRes.ok ? await propsRes.json() : [];
      const projsData = projsRes.ok ? (await projsRes.json()).map(p => ({ ...p, isProjectCollection: true })) : [];

      setProperties([...propsData, ...projsData]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    window.scrollTo(0, 0);
    
    // If there's a search param, set it in filters
    if (initialSearch) {
      setFilters(prev => ({ ...prev, location: initialSearch }));
    }
  }, [fetchData, category, initialSearch]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      propertyType: 'all',
      minPrice: '',
      maxPrice: '',
      location: '',
      transaction: 'all',
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
    // Filter by route category
    if (category === 'residential') {
      const isResProp = ['apartment', 'villa', 'plot'].includes(property.propertyType);
      const isResProj = property.category === 'residential' || property.type === 'residential';
      if (!isResProp && !isResProj) return false;
    } else if (category === 'commercial') {
      const isCommProp = property.propertyType === 'commercial';
      const isCommProj = property.category === 'commercial' || property.type === 'commercial';
      if (!isCommProp && !isCommProj) return false;
    } else if (category === 'investment') {
      const isInvProp = property.propertyType === 'investment';
      const isInvProj = property.category === 'investment' || property.type === 'investment';
      if (!isInvProp && !isInvProj) return false;
    }

    // Additional User Filters
    if (filters.category !== 'all') {
      if (filters.category === 'residential') {
        const isResProp = ['apartment', 'villa', 'plot'].includes(property.propertyType);
        const isResProj = property.category === 'residential' || property.type === 'residential';
        if (!isResProp && !isResProj) return false;
      } else if (filters.category === 'commercial') {
        const isCommProp = property.propertyType === 'commercial';
        const isCommProj = property.category === 'commercial' || property.type === 'commercial';
        if (!isCommProp && !isCommProj) return false;
      } else if (filters.category === 'investment') {
        const isInvProp = property.propertyType === 'investment';
        const isInvProj = property.category === 'investment' || property.type === 'investment';
        if (!isInvProp && !isInvProj) return false;
      }
    }

    if (filters.propertyType !== 'all') {
      let typeMatches = false;
      if (property.propertyType && property.propertyType === filters.propertyType) {
        typeMatches = true;
      } else if (property.type && property.type === filters.propertyType) {
        typeMatches = true;
      } else if (property.commercialTypes && Array.isArray(property.commercialTypes) && property.commercialTypes.includes(filters.propertyType)) {
        typeMatches = true;
      }
      if (!typeMatches) return false;
    }
    if (filters.minPrice && property.price < parseInt(filters.minPrice)) return false;
    if (filters.maxPrice && property.price > parseInt(filters.maxPrice)) return false;
    
    // Enhanced Search Logic (Matches location, city, title, or property name)
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
    if (filters.transaction !== 'all' && property.transaction !== filters.transaction) return false;
    if (filters.status !== 'all' && property.status !== filters.status) return false;
      if (filters.category !== 'commercial' && filters.bedroom !== 'all' && property.bedroom?.toString() !== filters.bedroom) return false;
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
              Real Estate Portfolio
            </span>
            <h2 style={{ 
              fontSize: isMobile ? '2rem' : '3.5rem', 
              fontWeight: '800', 
              color: 'var(--color-navy)', 
              marginBottom: '15px',
              lineHeight: 1.2
            }}>
              {category === 'residential' ? 'Residential Properties' : category === 'commercial' ? 'Commercial Properties' : 'All Properties'}
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
              Discover your perfect property from our extensive collection of premium spaces defined by excellence.
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
                <i className="fas fa-filter" style={{ color: 'var(--color-gold)', marginRight: '10px' }}></i> Filter Properties
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

              {category === 'commercial' ? (
                <>
                  <select name="propertyType" value={filters.propertyType} onChange={handleFilterChange} style={filterInputStyle}>
                    <option value="all">All Types</option>
                    <option value="Retail Shops">Retail Shops</option>
                    <option value="Food Court">Food Court</option>
                    <option value="Gaming Zone">Gaming Zone</option>
                    <option value="Multiplex">Multiplex</option>
                    <option value="Office Space">Office Space</option>
                    <option value="Studio">Studio</option>
                  </select>
                  <select name="status" value={filters.status} onChange={handleFilterChange} style={filterInputStyle}>
                    <option value="all">All Status</option>
                    <option value="upcoming">Under Construction</option>
                    <option value="ready to move">Ready to Move</option>
                    <option value="coming soon">Coming Soon</option>
                  </select>
                </>
              ) : category === 'residential' ? (
                <select name="propertyType" value={filters.propertyType} onChange={handleFilterChange} style={filterInputStyle}>
                  <option value="all">All Types</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="plot">Plot</option>
                </select>
              ) : (
                <select name="propertyType" value={filters.propertyType} onChange={handleFilterChange} style={filterInputStyle}>
                  <option value="all">All Types</option>
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

              {category !== 'commercial' && filters.category !== 'commercial' && (
                <select name="bedroom" value={filters.bedroom} onChange={handleFilterChange} style={filterInputStyle}>
                  <option value="all">Bedrooms (Any)</option>
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4 BHK</option>
                  <option value="5">5 BHK</option>
                  <option value="penthouse">Penthouse</option>
                </select>
              )}

              <input type="number" name="minPrice" placeholder="Min Price (₹)" value={filters.minPrice} onChange={handleFilterChange} style={filterInputStyle} />
              <input type="number" name="maxPrice" placeholder="Max Price (₹)" value={filters.maxPrice} onChange={handleFilterChange} style={filterInputStyle} />
              <input type="text" name="location" placeholder="Search Keywords / Location..." value={filters.location} onChange={handleFilterChange} style={filterInputStyle} />
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
              <h3 style={{ color: 'var(--color-navy)', fontSize: '1.4rem' }}>No properties match your criteria</h3>
              <p style={{ color: '#888' }}>Try adjusting your filters or clearing them to see all properties.</p>
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

Properties.propTypes = {
  category: PropTypes.string
};

export default Properties;