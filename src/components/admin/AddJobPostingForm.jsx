import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { API_URL } from '../../apiConfig';

const AddJobPostingForm = ({ initialData, onCancel, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        experience: '',
        location: '',
        jobTiming: 'Full Time',
        numberOfOpenings: 1,
        description: '',
        requirements: '',
        salary: '',
        status: 'active'
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const token = localStorage.getItem('adminToken');
            const url = initialData 
                ? `${API_URL}/api/job-postings/${initialData._id}`
                : `${API_URL}/api/job-postings`;
            
            const method = initialData ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(initialData ? 'Job posting updated successfully' : 'Job posting created successfully');
                onSuccess();
            } else {
                toast.error(data.message || 'Error saving job posting');
            }
        } catch (error) {
            toast.error('Error saving job posting');
        }
    };

    return (
        <div style={{ padding: '30px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #E6E9EF', paddingBottom: '15px' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#07162F', fontWeight: 'bold' }}>
                    {initialData ? 'Edit Job Posting' : 'Create New Job Posting'}
                </h2>
                <button
                    onClick={onCancel}
                    style={{ backgroundColor: 'transparent', border: 'none', color: '#666', fontSize: '24px', cursor: 'pointer' }}
                >
                    ×
                </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#07162F' }}>
                            Job Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Sales Executive"
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E6E9EF', fontSize: '14px', outline: 'none' }}
                            onFocus={(e) => e.target.style.borderColor = '#F39C12'}
                            onBlur={(e) => e.target.style.borderColor = '#E6E9EF'}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#07162F' }}>
                            Experience Required *
                        </label>
                        <input
                            type="text"
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            required
                            placeholder="e.g., 2-3 years"
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E6E9EF', fontSize: '14px', outline: 'none' }}
                            onFocus={(e) => e.target.style.borderColor = '#F39C12'}
                            onBlur={(e) => e.target.style.borderColor = '#E6E9EF'}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#07162F' }}>
                            Location *
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Delhi NCR"
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E6E9EF', fontSize: '14px', outline: 'none' }}
                            onFocus={(e) => e.target.style.borderColor = '#F39C12'}
                            onBlur={(e) => e.target.style.borderColor = '#E6E9EF'}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#07162F' }}>
                            Job Timing *
                        </label>
                        <select
                            name="jobTiming"
                            value={formData.jobTiming}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E6E9EF', fontSize: '14px', outline: 'none', backgroundColor: 'white' }}
                        >
                            <option value="Full Time">Full Time</option>
                            <option value="Part Time">Part Time</option>
                            <option value="Contract">Contract</option>
                            <option value="Internship">Internship</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#07162F' }}>
                            Number of Openings *
                        </label>
                        <input
                            type="number"
                            name="numberOfOpenings"
                            value={formData.numberOfOpenings}
                            onChange={handleChange}
                            required
                            min="1"
                            placeholder="e.g., 5"
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E6E9EF', fontSize: '14px', outline: 'none' }}
                            onFocus={(e) => e.target.style.borderColor = '#F39C12'}
                            onBlur={(e) => e.target.style.borderColor = '#E6E9EF'}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#07162F' }}>
                            Salary (Optional)
                        </label>
                        <input
                            type="text"
                            name="salary"
                            value={formData.salary}
                            onChange={handleChange}
                            placeholder="e.g., ₹3-5 LPA"
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E6E9EF', fontSize: '14px', outline: 'none' }}
                            onFocus={(e) => e.target.style.borderColor = '#F39C12'}
                            onBlur={(e) => e.target.style.borderColor = '#E6E9EF'}
                        />
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#07162F' }}>
                        Job Description *
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows="6"
                        placeholder="Describe the role, responsibilities, and what we're looking for..."
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E6E9EF', fontSize: '14px', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                        onFocus={(e) => e.target.style.borderColor = '#F39C12'}
                        onBlur={(e) => e.target.style.borderColor = '#E6E9EF'}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#07162F' }}>
                        Requirements (Optional)
                    </label>
                    <textarea
                        name="requirements"
                        value={formData.requirements}
                        onChange={handleChange}
                        rows="4"
                        placeholder="List the required skills, qualifications, and experience..."
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E6E9EF', fontSize: '14px', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                        onFocus={(e) => e.target.style.borderColor = '#F39C12'}
                        onBlur={(e) => e.target.style.borderColor = '#E6E9EF'}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#07162F' }}>
                        Status
                    </label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E6E9EF', fontSize: '14px', outline: 'none', backgroundColor: 'white' }}
                    >
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>

                <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '20px' }}>
                    <button
                        type="button"
                        onClick={onCancel}
                        style={{ padding: '12px 30px', borderRadius: '8px', border: '1px solid #E6E9EF', backgroundColor: 'white', color: '#666', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        style={{ padding: '12px 30px', borderRadius: '8px', border: 'none', backgroundColor: '#F39C12', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
                    >
                        {initialData ? 'Update Job Posting' : 'Create Job Posting'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddJobPostingForm;
