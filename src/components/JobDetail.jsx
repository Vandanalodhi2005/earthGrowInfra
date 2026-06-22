'use client'

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { HiOutlineLocationMarker, HiOutlineBriefcase, HiOutlineClock, HiOutlineArrowLeft } from 'react-icons/hi';
import { API_URL } from '../apiConfig';

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  border: '1px solid #E0E0E0',
  borderRadius: '8px',
  fontSize: '0.95rem',
  color: 'var(--color-navy)',
  outline: 'none',
  backgroundColor: '#FAFAFA',
  boxSizing: 'border-box',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.85rem',
  fontWeight: 600,
  color: 'var(--color-navy)',
  marginBottom: '6px',
};

const JobDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth <= 1024);
  const [jobPosting, setJobPosting] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fetchingJob, setFetchingJob] = useState(true);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    position: '',
    location: '',
    experience: 0,
    message: '',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchJobPosting = async () => {
      try {
        const response = await fetch(`${API_URL}/api/job-postings/${id}`);
        const data = await response.json();
        if (data.success) {
          setJobPosting(data.data);
          setFormData(prev => ({
            ...prev,
            position: data.data.title,
            location: data.data.location,
          }));
        }
      } catch (error) {
        console.error('Error fetching job posting:', error);
      } finally {
        setFetchingJob(false);
      }
    };
    fetchJobPosting();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate all required fields
    if (!formData.fullName || !formData.email || !formData.mobile || !formData.position || formData.experience < 0 || !formData.location) {
      alert('Please fill in all required fields');
      setLoading(false);
      return;
    }

    // Ensure experience is a number
    const dataToSend = {
      ...formData,
      experience: Number(formData.experience)
    };

    console.log('Submitting form data:', dataToSend);

    try {
      const response = await fetch(`${API_URL}/api/candidates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();
      console.log('Response from server:', result);

      if (result.success) {
        setSubmitted(true);
        setTimeout(() => router.push('/careers'), 3000);
      } else {
        alert(`Error submitting application: ${result.message || 'Please try again.'}`);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F9F9F9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '480px', width: '100%', backgroundColor: 'white', borderRadius: '16px', padding: '48px 32px', textAlign: 'center', boxShadow: '0 8px 40px rgba(10,28,58,0.1)' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '2rem', color: '#4CAF50' }}>✓</div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '12px' }}>Application Submitted!</h2>
          <p style={{ color: '#666', lineHeight: 1.7, marginBottom: '8px' }}>
            Thank you for applying for <strong>{formData.position}</strong>. We have received your application and will review it shortly.
          </p>
          <p style={{ fontSize: '0.85rem', color: '#999' }}>Redirecting to careers page...</p>
        </div>
      </div>
    );
  }

  if (fetchingJob) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F9F9F9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ color: '#666', fontSize: '1.1rem' }}>Loading job details...</div>
      </div>
    );
  }

  if (!jobPosting) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F9F9F9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '16px' }}>Job Not Found</h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>The job posting you're looking for doesn't exist or has been closed.</p>
          <button
            onClick={() => router.push('/careers')}
            style={{
              padding: '12px 28px',
              backgroundColor: 'var(--color-gold)',
              color: 'var(--color-navy)',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
            }}
          >
            Back to Careers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9F9F9' }}>
      {/* Hero */}
      <section style={{ backgroundColor: 'var(--color-navy)', padding: isMobile ? '32px 0 40px' : '40px 0 56px' }}>
        <div className="container" style={{ padding: '0 24px' }}>
          <button
            onClick={() => router.push('/careers')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer',
              fontSize: '0.9rem',
              marginBottom: '24px',
              padding: 0,
            }}
          >
            <HiOutlineArrowLeft /> Back to Careers
          </button>

          <span style={{ color: 'var(--color-gold)', letterSpacing: '4px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
            Job Application
          </span>
          <h1 style={{ fontSize: isMobile ? '1.75rem' : '2.5rem', fontWeight: 900, color: 'white', marginBottom: '16px', lineHeight: 1.2 }}>
            {jobPosting.title}
          </h1>
          <div style={{ width: '50px', height: '3px', backgroundColor: 'var(--color-gold)', marginBottom: '20px' }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HiOutlineLocationMarker style={{ color: 'var(--color-gold)' }} />
              {jobPosting.location}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HiOutlineBriefcase style={{ color: 'var(--color-gold)' }} />
              {jobPosting.numberOfOpenings} openings
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HiOutlineClock style={{ color: 'var(--color-gold)' }} />
              {jobPosting.experience}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HiOutlineBriefcase style={{ color: 'var(--color-gold)' }} />
              {jobPosting.jobTiming}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: isMobile ? '32px 0 60px' : '48px 0 80px' }}>
        <div className="container" style={{ padding: '0 24px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 380px',
              gap: '32px',
              alignItems: 'start',
            }}
          >
            {/* Job Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {jobPosting.description && (
                <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: isMobile ? '24px' : '32px', boxShadow: '0 4px 20px rgba(10,28,58,0.06)' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid var(--color-gold)' }}>
                    About This Role
                  </h2>
                  <p style={{ color: '#555', lineHeight: 1.8, margin: 0, fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>{jobPosting.description}</p>
                </div>
              )}

              {jobPosting.requirements && (
                <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: isMobile ? '24px' : '32px', boxShadow: '0 4px 20px rgba(10,28,58,0.06)' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid var(--color-gold)' }}>
                    Requirements
                  </h2>
                  <p style={{ color: '#555', lineHeight: 1.8, margin: 0, fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>{jobPosting.requirements}</p>
                </div>
              )}

              {jobPosting.salary && (
                <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: isMobile ? '24px' : '32px', boxShadow: '0 4px 20px rgba(10,28,58,0.06)' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid var(--color-gold)' }}>
                    Salary
                  </h2>
                  <p style={{ color: '#555', lineHeight: 1.8, margin: 0, fontSize: '0.95rem' }}>{jobPosting.salary}</p>
                </div>
              )}
            </div>

            {/* Application Form */}
            <div style={{ position: isMobile ? 'static' : 'sticky', top: '100px' }}>
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: isMobile ? '24px' : '28px', boxShadow: '0 8px 30px rgba(10,28,58,0.1)', border: '1px solid rgba(198,156,109,0.2)' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '6px' }}>Apply Now</h3>
                <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '24px' }}>Fill in your details and our HR team will get back to you.</p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Full Name *</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required style={inputStyle} placeholder="Your name" />
                  </div>

                  <div>
                    <label style={labelStyle}>Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} placeholder="your@email.com" />
                  </div>

                  <div>
                    <label style={labelStyle}>Mobile Number *</label>
                    <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required style={inputStyle} placeholder="+91 XXXXXXXXXX" />
                  </div>

                  <div>
                    <label style={labelStyle}>Experience (Years) *</label>
                    <input type="number" name="experience" value={formData.experience} onChange={handleChange} required min="0" style={inputStyle} placeholder="0" />
                  </div>

                  <div>
                    <label style={labelStyle}>Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="3"
                      style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '14px',
                      backgroundColor: loading ? '#ccc' : 'var(--color-gold)',
                      color: 'var(--color-navy)',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '1rem',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      marginTop: '4px',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    {loading ? 'Submitting...' : 'Submit Application'}
                  </button>

                  <p style={{ fontSize: '0.75rem', color: '#aaa', textAlign: 'center', margin: 0 }}>
                    By applying, you agree to our terms and conditions.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JobDetail;
