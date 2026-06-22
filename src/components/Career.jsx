'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HiOutlineLocationMarker, HiOutlineBriefcase, HiOutlineClock, HiOutlineChevronDown } from 'react-icons/hi';
import { API_URL } from '../apiConfig';

const benefits = [
  {
    icon: '📈',
    title: 'Growth & Learning',
    description: 'Mentorship from industry veterans, continuous on-the-job learning, and opportunities to work on high-impact projects from day one.',
  },
  {
    icon: '🌟',
    title: 'Industry Exposure',
    description: "Collaborate with top-tier developers and serve premium buyers across Noida's prime real estate market.",
  },
  {
    icon: '🤝',
    title: 'Supportive Culture',
    description: 'Join a humble, high-ownership team that believes in transparency, recognizes individual effort, and celebrates collective wins.',
  },
  {
    icon: '💰',
    title: 'Rewards & Incentives',
    description: 'Enjoy competitive compensation packages, performance-based incentives, and regular team retreats that make hard work truly rewarding.',
  },
];

const faqs = [
  {
    question: 'Do you charge any fee from candidates?',
    answer: 'No. Applying and interviewing with us is completely free for candidates.',
  },
  {
    question: 'Is prior real-estate experience mandatory?',
    answer: 'Experience is valued for senior roles, but we also consider high-potential candidates who demonstrate strong communication, empathy, and a learning mindset.',
  },
  {
    question: 'How soon will I hear back after applying?',
    answer: 'Timelines can vary by role and volume of applications. If shortlisted, our team will reach out for next steps.',
  },
];

const Career = () => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth <= 1024);
  const [openFaq, setOpenFaq] = useState(null);
  const [filter, setFilter] = useState('All');
  const [jobPostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchJobPostings = async () => {
      try {
        const response = await fetch(`${API_URL}/api/job-postings/active`);
        const data = await response.json();
        if (data.success) {
          setJobPostings(data.data);
        }
      } catch (error) {
        console.error('Error fetching job postings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobPostings();
  }, []);

  const filters = ['All', 'Full Time', 'Part Time', 'Contract', 'Internship'];
  const filteredPositions = filter === 'All'
    ? jobPostings
    : jobPostings.filter((p) => p.jobTiming === filter);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9F9F9' }}>
      {/* Hero */}
      <section
        style={{
          position: 'relative',
          height: isMobile ? '35vh' : '45vh',
          minHeight: isMobile ? '280px' : '360px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--color-navy)',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.25 }}>
          <img
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2087"
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 24px' }}>
          <span
            style={{
              color: 'var(--color-gold)',
              letterSpacing: isMobile ? '3px' : '6px',
              fontSize: isMobile ? '0.7rem' : '0.85rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '12px',
            }}
          >
            We're Hiring – Real Estate Professionals
          </span>
          <h1
            style={{
              fontSize: isMobile ? '2.2rem' : '3.5rem',
              fontWeight: 900,
              color: 'white',
              marginBottom: '16px',
              lineHeight: 1.2,
            }}
          >
            Join Our Growing Real Estate Team
          </h1>
          <div style={{ width: '60px', height: '4px', backgroundColor: 'var(--color-gold)', margin: '0 auto 20px' }} />
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: isMobile ? '1rem' : '1.15rem', maxWidth: '600px', margin: '0 auto' }}>
            Location: Noida, Uttar Pradesh – We are expanding our sales and leadership team and are looking for passionate, result‑driven professionals to join us in shaping the future of real estate.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{ backgroundColor: 'var(--color-navy)', color: 'white', padding: isMobile ? '28px 0' : '36px 0', borderTop: '1px solid rgba(198,156,109,0.2)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
              gap: isMobile ? '24px' : '32px',
              textAlign: 'center',
            }}
          >
            {[
              { value: jobPostings.length || '0', label: 'Open Roles' },
              { value: jobPostings.reduce((sum, p) => sum + (p.numberOfOpenings || 0), 0) || '0', label: 'Total Openings' },
              { value: '1', label: 'Office Locations' },
              { value: '100%', label: 'Free to Apply' },
            ].map((stat) => (
              <div key={stat.label}>
                <h2 style={{ color: 'var(--color-gold)', fontSize: isMobile ? '1.8rem' : '2.4rem', marginBottom: '4px', fontWeight: 800 }}>
                  {stat.value}
                </h2>
                <p style={{ fontSize: isMobile ? '0.85rem' : '0.95rem', opacity: 0.85, margin: 0 }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section style={{ padding: isMobile ? '50px 0' : '80px 0' }}>
        <div className="container">
          <div className="section-header text-center">
            <span className="subtitle">Current Openings</span>
            <h2 style={{ fontSize: isMobile ? '2rem' : '2.8rem', color: 'var(--color-navy)' }}>Open Positions</h2>
            <div className="divider mx-auto" />
            <p className="section-desc mx-auto">
              Find a role that matches your skills and ambitions. Click Apply Now to submit your application.
            </p>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '36px', flexWrap: 'wrap' }}>
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '8px 22px',
                  borderRadius: '30px',
                  border: filter === f ? '2px solid var(--color-gold)' : '2px solid #ddd',
                  backgroundColor: filter === f ? 'var(--color-navy)' : 'white',
                  color: filter === f ? 'white' : 'var(--color-navy)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {f}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Loading job postings...</div>
            ) : filteredPositions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>No job postings available at the moment.</div>
            ) : (
              filteredPositions.map((position) => (
                <div
                  key={position._id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: isMobile ? '20px' : '28px 32px',
                    boxShadow: '0 4px 20px rgba(10,28,58,0.06)',
                    border: '1px solid rgba(10,28,58,0.06)',
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    justifyContent: 'space-between',
                    gap: '20px',
                    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(10,28,58,0.12)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(10,28,58,0.06)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: isMobile ? '1.1rem' : '1.25rem', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>
                        {position.title}
                      </h3>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          padding: '3px 10px',
                          borderRadius: '20px',
                          backgroundColor: position.jobTiming === 'Internship' ? '#E8F4FD' : '#F0F4FF',
                          color: position.jobTiming === 'Internship' ? '#1A6FA8' : 'var(--color-navy)',
                        }}
                      >
                        {position.jobTiming}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', color: '#666', fontSize: '0.9rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <HiOutlineLocationMarker style={{ color: 'var(--color-gold)' }} />
                        {position.location}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <HiOutlineBriefcase style={{ color: 'var(--color-gold)' }} />
                        {position.numberOfOpenings} openings
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <HiOutlineClock style={{ color: 'var(--color-gold)' }} />
                        {position.experience}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push(`/careers/${position._id}`)}
                    style={{
                      padding: '12px 28px',
                      backgroundColor: 'var(--color-gold)',
                      color: 'var(--color-navy)',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'background-color 0.2s ease',
                      width: isMobile ? '100%' : 'auto',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-gold-light)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-gold)'; }}
                  >
                    Apply Now
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section style={{ padding: isMobile ? '50px 0' : '80px 0', backgroundColor: 'white' }}>
        <div className="container">
          <div className="section-header text-center">
            <span className="subtitle">Why Us</span>
            <h2 style={{ fontSize: isMobile ? '2rem' : '2.8rem', color: 'var(--color-navy)' }}>
              Why Build Your Career With Us?
            </h2>
            <div className="divider mx-auto" />
            <p className="section-desc mx-auto">
              Join a team that values your growth, celebrates your success, and provides the platform you need to excel.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: '24px',
            }}
          >
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                style={{
                  padding: isMobile ? '28px 24px' : '36px 32px',
                  borderRadius: '12px',
                  backgroundColor: '#F9F9F9',
                  borderLeft: '4px solid var(--color-gold)',
                }}
              >
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '10px' }}>
                  {benefit.icon} {benefit.title}
                </h3>
                <p style={{ color: '#666', lineHeight: 1.7, margin: 0, fontSize: '0.95rem' }}>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Promise */}
      <section style={{ padding: isMobile ? '50px 0' : '70px 0' }}>
        <div className="container">
          <div
            style={{
              background: 'linear-gradient(135deg, var(--color-navy) 0%, #15366F 100%)',
              borderRadius: '16px',
              padding: isMobile ? '32px 24px' : '48px 56px',
              color: 'white',
            }}
          >
            <h2 style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 800, marginBottom: '28px', color: 'var(--color-gold)' }}>
              Our Promise
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '24px' }}>
              {[
                { title: 'Free Application', text: 'Applying is free — no consultancy or placement charges at any stage.' },
                { title: 'Official Channels Only', text: 'We communicate only through our official company channels for interviews and offers.' },
                { title: 'Equal Opportunity', text: 'We welcome candidates from all backgrounds without discrimination.' },
              ].map((item) => (
                <div key={item.title} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-gold)', fontSize: '1.2rem', marginTop: '2px', flexShrink: 0 }}>✓</span>
                  <div>
                    <strong style={{ display: 'block', marginBottom: '6px', fontSize: '1rem' }}>{item.title}</strong>
                    <span style={{ opacity: 0.85, fontSize: '0.9rem', lineHeight: 1.6 }}>{item.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: isMobile ? '50px 0' : '80px 0', backgroundColor: 'white' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="section-header text-center">
            <span className="subtitle">Got Questions?</span>
            <h2 style={{ fontSize: isMobile ? '2rem' : '2.8rem', color: 'var(--color-navy)' }}>
              Frequently Asked Questions
            </h2>
            <div className="divider mx-auto" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, index) => (
              <div
                key={index}
                style={{
                  borderRadius: '10px',
                  border: '1px solid #eee',
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  style={{
                    width: '100%',
                    padding: '18px 24px',
                    backgroundColor: openFaq === index ? 'var(--color-navy)' : '#FAFAFA',
                    color: openFaq === index ? 'white' : 'var(--color-navy)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: 600,
                    fontSize: '1rem',
                    textAlign: 'left',
                    gap: '12px',
                  }}
                >
                  {faq.question}
                  <HiOutlineChevronDown
                    style={{
                      flexShrink: 0,
                      transform: openFaq === index ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}
                  />
                </button>
                {openFaq === index && (
                  <div style={{ padding: '16px 24px 20px', color: '#666', lineHeight: 1.7, fontSize: '0.95rem', backgroundColor: 'white' }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}

            <div
              style={{
                marginTop: '16px',
                padding: '20px 24px',
                borderRadius: '10px',
                backgroundColor: '#F9F9F9',
                textAlign: 'center',
                color: '#666',
                fontSize: '0.95rem',
              }}
            >
              Have more questions? Visit our{' '}
              <Link href="/contact" style={{ color: 'var(--color-gold)', fontWeight: 600, textDecoration: 'none' }}>
                Contact page
              </Link>
              .
            </div>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section style={{ padding: '32px 0', borderTop: '1px solid #eee', textAlign: 'center' }}>
        <div className="container">
          <p style={{ fontSize: '0.85rem', color: '#888', margin: 0, lineHeight: 1.6 }}>
            We are an equal opportunity employer and do not discriminate based on gender, age, disability, ethnicity, religion, or background.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Career;
