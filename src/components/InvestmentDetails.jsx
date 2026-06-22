'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { HiLocationMarker, HiCurrencyRupee, HiArrowLeft, HiPhone, HiCheckCircle, HiExclamation } from 'react-icons/hi'
import { FaMapMarkerAlt, FaRulerCombined, FaLandmark } from 'react-icons/fa'
import toast from 'react-hot-toast'


const InvestmentDetails = () => {
  const { id } = useParams()
  const [investment, setInvestment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeImage, setActiveImage] = useState(0)
  const [retrying, setRetrying] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024)

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchInvestment()

    const handleResize = () => setIsMobile(window.innerWidth <= 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [id])

  // Helper to split bunched up text (e.g. from admin panel)
  const formatList = (list) => {
    if (!list) return []
    if (!Array.isArray(list)) return [list]
    
    return list.flatMap(item => {
      if (typeof item !== 'string') return [item]
      // Split by common delimiters like ✔️, |, •, or newlines
      return item.split(/[|✔️•\n]+/).map(s => s.trim()).filter(s => s.length > 0)
    })
  }

  const fetchInvestment = async () => {
    try {
      setError(null)

      const response = await fetch(`/api/investments/${id}`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid investment data received')
      }

      setInvestment(data)
    } catch (error) {
      console.error('Error fetching investment:', error)
      setError(error.message || 'Failed to load investment details')
      toast.error('Failed to load investment')
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = async () => {
    setRetrying(true)
    setLoading(true)
    await fetchInvestment()
    setRetrying(false)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'linear-gradient(to bottom right, #f1f5f9, #ffffff, #f1f5f9)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ animation: 'spin 1s linear infinite', borderRadius: '50%', height: '64px', width: '64px', border: '4px solid #bfdbfe', borderTop: '4px solid #2563eb', margin: '0 auto 16px' }}></div>
          <p style={{ color: '#475569', fontWeight: '500' }}>Loading investment details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'linear-gradient(to bottom right, #f1f5f9, #ffffff, #f1f5f9)', padding: '16px' }}>
        <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '32px', maxWidth: '448px', textAlign: 'center' }}>
          <HiExclamation style={{ width: '64px', height: '64px', color: '#ef4444', margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>Error Loading Investment</h2>
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
            <Link href="/investment" style={{
              flex: 1,
              border: '2px solid #2563eb',
              color: '#2563eb',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.3s'
            }} onMouseEnter={(e) => e.target.style.background = '#eff6ff'} onMouseLeave={(e) => e.target.style.background = 'transparent'}>
              Back
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!investment) return null

  const formattedHighlights = formatList(investment.highlights)

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #f1f5f9, #ffffff, #f1f5f9)' }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: isMobile ? '12px 16px' : '16px' }}>
          <Link href="/investment" style={{ display: 'inline-flex', alignItems: 'center', color: '#475569', textDecoration: 'none', fontWeight: '500', transition: 'color 0.3s', fontSize: isMobile ? '0.85rem' : '1rem' }} onMouseEnter={(e) => e.target.style.color = '#2563eb'} onMouseLeave={(e) => e.target.style.color = '#475569'}>
            <HiArrowLeft style={{ width: '20px', height: '20px', marginRight: '8px' }} />
            Back to Investments
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: isMobile ? '15px 12px' : '32px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))', gap: isMobile ? '24px' : '32px' }}>
          
          {/* Image Gallery */}
          <div style={{ gridColumn: isMobile ? 'span 1' : 'span 2' }}>
            {/* Main Image */}
            <div style={{ background: '#cbd5e1', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ aspectRatio: isMobile ? '4/3' : '16/10', background: 'linear-gradient(to bottom right, #e2e8f0, #cbd5e1)', position: 'relative', overflow: 'hidden' }}>
                {investment.images && investment.images.length > 0 ? (
                  <>
                    <img
                      src={investment.images[activeImage]}
                      alt={investment.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0, 0, 0, 0.6)', color: 'white', padding: '6px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '600' }}>
                      {activeImage + 1} / {investment.images.length}
                    </div>
                  </>
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom right, #f0fdf4, #dcfce7)' }}>
                    <FaLandmark style={{ width: '80px', height: '80px', color: '#4ade80', marginBottom: '12px' }} />
                    <p style={{ color: '#16a34a', fontWeight: '600' }}>No images available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {investment.images && investment.images.length > 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(4, 1fr)' : 'repeat(auto-fit, minmax(60px, 1fr))', gap: '8px' }}>
                {investment.images.map((img, index) => (
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
            {/* Status Badges */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <span style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: 'bold',
                background: investment.status === 'available' ? 'linear-gradient(to right, #dcfce7, #d1fae5)' :
                             investment.status === 'upcoming' ? 'linear-gradient(to right, #dbeafe, #bae6fd)' :
                             'linear-gradient(to right, #fee2e2, #fecaca)',
                color: investment.status === 'available' ? '#16a34a' :
                       investment.status === 'upcoming' ? '#0284c7' :
                       '#dc2626',
                display: 'inline-block'
              }}>
                {investment.status?.toUpperCase() || 'AVAILABLE'}
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
                <FaLandmark style={{ width: '11px', height: '11px' }} />
                {investment.landType || 'Land'}
              </span>
            </div>

            {/* Title & Location */}
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ fontSize: isMobile ? '22px' : '32px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px', lineHeight: '1.2', wordBreak: 'break-word' }}>{investment.title}</h1>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#475569' }}>
                <HiLocationMarker style={{ width: '18px', height: '18px', marginTop: '4px', flexShrink: 0, color: '#2563eb' }} />
                <div>
                  <p style={{ fontWeight: '600', fontSize: isMobile ? '0.9rem' : '1rem' }}>{investment.location}</p>
                  <p style={{ fontSize: '13px', color: '#64748b' }}>{investment.city}</p>
                </div>
              </div>
            </div>

            {/* Price & Area Box */}
            <div style={{ background: 'linear-gradient(to bottom right, #eff6ff, #e0f2fe)', border: '1px solid #bfdbfe', borderRadius: '16px', padding: isMobile ? '16px' : '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#475569', fontWeight: 'bold', letterSpacing: '0.05em', marginBottom: '4px', textTransform: 'uppercase' }}>Total Price</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <HiCurrencyRupee style={{ width: '22px', height: '22px', color: '#2563eb' }} />
                    <p style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: '900', color: '#1d4ed8' }}>
                      {investment.totalPrice ? investment.totalPrice.toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </div>

                <div style={{ paddingTop: '10px', borderTop: '1px solid rgba(37, 99, 235, 0.1)' }}>
                  <p style={{ fontSize: '11px', color: '#475569', fontWeight: 'bold', letterSpacing: '0.05em', marginBottom: '4px', textTransform: 'uppercase' }}>Land Area</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <FaRulerCombined style={{ width: '14px', height: '14px', color: '#2563eb' }} />
                    <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>
                      {investment.area ? `${investment.area.toLocaleString()} ${investment.areaUnit || 'sq.ft'}` : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <a
                href="tel:+919406650197"
                style={{
                  flex: 1,
                  background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
                  color: 'white',
                  padding: '12px 5px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  textTransform: 'uppercase'
                }}
              >
                <HiPhone style={{ width: '16px', height: '16px' }} />
                Call
              </a>
              <a
                href="https://wa.me/919406650197?text=Hi%20I%20am%20interested%20in%20this%20investment"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  background: 'linear-gradient(to right, #16a34a, #15803d)',
                  color: 'white',
                  padding: '12px 5px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  textTransform: 'uppercase'
                }}
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div style={{ 
          marginTop: isMobile ? '32px' : '48px', 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', 
          gap: '32px' 
        }}>
          <div style={{ gridColumn: isMobile ? 'span 1' : 'span 2', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Description */}
            {investment.description && (
              <div style={{ background: 'white', borderRadius: '16px', padding: isMobile ? '20px' : '24px', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '4px', height: '24px', background: '#2563eb', borderRadius: '9999px' }}></div>
                  About This Investment
                </h3>
                <p style={{ color: '#475569', lineHeight: '1.7', fontSize: isMobile ? '14px' : '18px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {investment.description}
                </p>
              </div>
            )}

            {/* Key Highlights */}
            {formattedHighlights.length > 0 && (
              <div style={{ background: 'white', borderRadius: '16px', padding: isMobile ? '20px' : '24px', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '4px', height: '24px', background: '#16a34a', borderRadius: '9999px' }}></div>
                  Key Highlights
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {formattedHighlights.map((h, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
                      <HiCheckCircle style={{ width: '18px', height: '18px', color: '#16a34a', flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ color: '#1f2937', fontWeight: '500', fontSize: '14px' }}>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Side Info */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ background: 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', border: '1px solid #e5e7eb', position: isMobile ? 'static' : 'sticky', top: '100px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', marginBottom: '14px' }}>Investment Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: '6px' }}>
                  <span style={{ color: '#475569' }}>Status</span>
                  <span style={{ fontWeight: 'bold', color: '#0f172a', textTransform: 'capitalize' }}>{investment.status || 'Available'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: '6px' }}>
                  <span style={{ color: '#475569' }}>Land Type</span>
                  <span style={{ fontWeight: 'bold', color: '#0f172a', textTransform: 'capitalize' }}>{investment.landType || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: '6px' }}>
                  <span style={{ color: '#475569' }}>Location</span>
                  <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{investment.city || 'N/A'}</span>
                </div>
                {investment.totalPrice && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#475569' }}>Total Investment</span>
                    <span style={{ fontWeight: 'bold', color: '#2563eb' }}>₹{(investment.totalPrice / 10000000).toFixed(1)}Cr</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
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
          <a href="tel:+919406650197" style={{
            backgroundColor: '#0a1c3a', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
            padding: '14px 2px', borderRadius: '12px', textDecoration: 'none',
            fontWeight: '800', fontSize: '0.7rem', textTransform: 'uppercase'
          }}>
            <HiPhone style={{ width: '16px', height: '16px' }} /> Call Now
          </a>
          <a href="https://wa.me/919406650197" target="_blank" rel="noopener noreferrer" style={{
            backgroundColor: '#16a34a', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
            padding: '14px 2px', borderRadius: '12px', textDecoration: 'none',
            fontWeight: '800', fontSize: '0.7rem', textTransform: 'uppercase'
          }}>
            💬 WhatsApp
          </a>
        </div>
      )}
    </div>
  )
}

export default InvestmentDetails
