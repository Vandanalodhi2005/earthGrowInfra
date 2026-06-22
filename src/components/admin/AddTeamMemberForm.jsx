import { useState } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { HiCloudUpload, HiX } from 'react-icons/hi';

const AddTeamMemberForm = ({ onCancel, onSuccess, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    role: initialData?.role || '',
    bio: initialData?.bio || '',
    order: initialData?.order || 0,
  });
  
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData?.image || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      const formDataToSend = new FormData();

      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      if (image) {
        formDataToSend.append('image', image);
      } else if (initialData?.image) {
          formDataToSend.append('image', initialData.image);
      }

      const url = initialData 
        ? `${import.meta.env.VITE_BACKEND_URL}/api/team-members/${initialData._id}`
        : `${import.meta.env.VITE_BACKEND_URL}/api/team-members`;

      const response = await fetch(url, {
        method: initialData ? 'PUT' : 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataToSend,
      });

      if (response.ok) {
        toast.success(`Team member ${initialData ? 'updated' : 'added'} successfully!`);
        onSuccess();
      } else {
        const data = await response.json();
        setError(data.message || 'Error processing request');
      }
    } catch (err) {
      setError('System connection error');
    } finally {
      setLoading(false);
    }
  };

  const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
  const labelStyle = { fontSize: '13px', fontWeight: '700', color: 'var(--color-navy)' };
  const inputStyle = { width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #E6E9EF', backgroundColor: '#F8F9FA', fontSize: '14px', outline: 'none' };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-navy)' }}>
            {initialData ? 'Edit Team Member' : 'Add Team Member'}
        </h2>
        <div style={{ height: '4px', width: '60px', backgroundColor: 'var(--color-gold)', borderRadius: '2px' }}></div>
      </div>

      <form onSubmit={handleSubmit} style={cardStyle}>
        {error && <div style={{ background: '#FFEBEE', color: '#F44336', padding: '15px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', marginBottom: '20px' }}>{error}</div>}

        <div className="form-grid" style={formGridStyle}>
          {/* Name */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Full Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} style={inputStyle} placeholder="e.g. Ashu Tiwari" required />
          </div>

          {/* Role */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Role *</label>
            <input type="text" name="role" value={formData.role} onChange={handleInputChange} style={inputStyle} placeholder="e.g. GM Sales & Marketing" required />
          </div>

          {/* Order */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Display Order</label>
            <input type="number" name="order" value={formData.order} onChange={handleInputChange} style={inputStyle} placeholder="0" />
          </div>
        </div>

        {/* Bio/Quote */}
        <div style={{ ...inputGroupStyle, marginTop: '20px' }}>
          <label style={labelStyle}>Bio / Quote *</label>
          <textarea name="bio" value={formData.bio} onChange={handleInputChange} style={{ ...inputStyle, minHeight: '100px' }} placeholder="Short bio or quote" required />
        </div>

        {/* Image */}
        <div style={{ ...inputGroupStyle, marginTop: '20px' }}>
          <label style={labelStyle}>Member Photo *</label>
          <div style={uploadBoxStyle}>
            <input type="file" accept="image/*" onChange={handleImageChange} style={hiddenFileInputStyle} id="memberImageInput" />
            <label htmlFor="memberImageInput" style={uploadLabelStyle}>
              <HiCloudUpload size={30} />
              <span>{image ? image.name : 'Click to upload photo'}</span>
            </label>
          </div>
          {imagePreview && (
            <div style={{ marginTop: '15px', position: 'relative', width: '150px', height: '150px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--color-gold)' }}>
              <img src={imagePreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="preview" />
              <button type="button" onClick={removeImage} style={removeImageButtonStyle}><HiX /></button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', gap: '15px', marginTop: '40px' }}>
          <button type="button" onClick={onCancel} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: '1px solid #E6E9EF', background: 'white', fontWeight: 'bold', cursor: 'pointer', color: '#666' }}>Cancel</button>
          <button disabled={loading} type="submit" style={{ flex: 2, padding: '14px', borderRadius: '10px', background: 'var(--color-gold)', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(243, 156, 18, 0.2)' }}>
            {loading ? 'Processing...' : initialData ? 'Update Member' : 'Add Member'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Styles
const cardStyle = { backgroundColor: 'white', borderRadius: '15px', padding: '40px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '30px' };
const formGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' };
const uploadBoxStyle = { border: '2px dashed #E6E9EF', borderRadius: '12px', backgroundColor: '#F8F9FA', padding: '30px', textAlign: 'center', cursor: 'pointer', position: 'relative' };
const hiddenFileInputStyle = { position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' };
const uploadLabelStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#90A4AE', fontSize: '14px', fontWeight: '600' };
const removeImageButtonStyle = { position: 'absolute', top: '5px', right: '5px', background: '#F44336', color: 'white', border: 'none', borderRadius: '50%', padding: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };

AddTeamMemberForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  initialData: PropTypes.object
};

export default AddTeamMemberForm;
