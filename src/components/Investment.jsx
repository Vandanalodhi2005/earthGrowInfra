'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PropertyCard from './PropertyCard';
import { API_URL } from '../apiConfig';

const Investment = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [invRes, projRes] = await Promise.all([
        fetch(`${API_URL}/api/investments`),
        fetch(`${API_URL}/api/projects?type=investment`)
      ]);

      const invData = invRes.ok ? await invRes.json() : [];
      const projData = projRes.ok ? await projRes.json() : [];

      const combined = [...(invData.data || invData), ...projData];
      setInvestments(combined);
    } catch (error) {
      console.error('Error fetching investments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', paddingTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--color-gray)', borderTopColor: 'var(--color-navy)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', paddingTop: '80px' }}>
      <section className="section-padding">
        <div className="container">
          {/* Header */}
          <div className="section-header text-center fade-in-up">
            <span className="subtitle">High Yield Assets</span>
            <h2>Investment Opportunities</h2>
            <div className="divider mx-auto"></div>
            <p className="section-desc">
              Curated premium assets and commercial spaces designed to deliver exceptional returns and long-term capital appreciation.
            </p>
          </div>

          {/* Properties Grid */}
          {investments.length > 0 ? (
            <div className="property-grid">
              {investments.map((property) => (
                 <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center section-padding fade-in-up">
               <i className="fas fa-chart-line" style={{ fontSize: '4rem', color: 'var(--color-gray)', marginBottom: '20px' }}></i>
               <h3 style={{ fontSize: '1.5rem', color: 'var(--color-navy)', marginBottom: '10px' }}>No Investment Opportunities</h3>
               <p className="text-slate-500">We are currently curating new high-yield assets. Please check back soon.</p>
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-navy)', color: 'var(--color-white)', textAlign: 'center' }}>
         <div className="container fade-in-up">
            <h2 style={{ color: 'var(--color-white)', fontSize: '2.5rem', marginBottom: '15px' }}>Ready to Grow Your Wealth?</h2>
            <p style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 30px', opacity: '0.9' }}>
              Connect with our investment advisors to discuss your financial goals and explore off-market opportunities.
            </p>
            <Link href="/contact" className="btn btn-secondary" style={{ padding: '15px 40px', fontSize: '1.1rem' }}>
              Schedule a Consultation
            </Link>
         </div>
      </section>
    </main>
  );
};

export default Investment;
