import { useState } from 'react';
import { HiCamera, HiTrash, HiPlus, HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';

const AddGalleryForm = ({ onImageAdded, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error('Please select an image');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Publishing asset...');

    try {
      const uploadData = new FormData();
      uploadData.append('title', 'Architectural Capture');
      uploadData.append('category', 'General');
      uploadData.append('image', imageFile);

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/gallery`, {
        method: 'POST',
        body: uploadData,
        headers: {
           'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.ok) {
         toast.success('Asset published', { id: toastId });
         setImageFile(null);
         setPreview(null);
         if (onImageAdded) onImageAdded();
      } else {
         const err = await response.json();
         throw new Error(err.message || 'Upload failed');
      }
    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = { backgroundColor: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' };
  const labelStyle = { fontSize: '12px', fontWeight: '800', color: '#90A4AE', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' };
  const inputStyle = { width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #E6E9EF', outline: 'none', color: '#455A64', fontSize: '13px' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: 'var(--color-navy)', fontSize: '24px', fontWeight: 'bold' }}>Add Gallery Asset</h2>
          <button onClick={onCancel} style={{ background: '#F8F9FA', border: 'none', p: 0, padding: '10px', borderRadius: '10px', cursor: 'pointer', color: '#455A64' }}>
             <HiX size={20} />
          </button>
      </div>

      <div style={cardStyle}>
        <div style={{ borderBottom: '1px solid #E6E9EF', paddingBottom: '15px', marginBottom: '25px' }}>
            <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--color-navy)', fontWeight: '700' }}>Asset Details</h4>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <div>
               <label style={labelStyle}>Image Upload</label>
               <div style={{ position: 'relative', border: '2px dashed #E6E9EF', borderRadius: '15px', padding: '40px', textAlign: 'center', backgroundColor: '#FBFBFC' }}>
                   {preview ? (
                     <div style={{ position: 'relative', display: 'inline-block' }}>
                        <img src={preview} style={{ width: '250px', height: '180px', objectFit: 'cover', borderRadius: '10px', border: '4px solid white', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} alt="Preview" />
                        <button 
                          type="button"
                          onClick={() => {setImageFile(null); setPreview(null);}}
                          style={{ position: 'absolute', top: '-10px', right: '-10px', border: 'none', background: '#F44336', color: 'white', padding: '6px', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}
                        >
                           <HiTrash />
                        </button>
                     </div>
                   ) : (
                     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '60px', height: '60px', backgroundColor: '#F0F4F8', border: '1px solid #E6E9EF', color: '#90A4AE', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <HiPlus size={24} />
                        </div>
                        <div>
                           <p style={{ margin: 0, fontWeight: '700', fontSize: '14px', color: '#455A64' }}>Choose Image</p>
                           <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#90A4AE' }}>Supports JPG, PNG (Main assets for gallery)</p>
                        </div>
                        <input 
                           type="file" 
                           style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                           onChange={handleFileChange}
                           accept="image/*"
                         />
                     </div>
                   )}
               </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
               <button
                 type="submit"
                 disabled={loading}
                 style={{ padding: '15px 40px', backgroundColor: 'var(--color-navy)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s', opacity: loading ? 0.7 : 1 }}
               >
                 {loading ? 'UPLOADING...' : 'PUBLISH ASSET'}
               </button>
               <button
                 type="button"
                 onClick={onCancel}
                 style={{ padding: '15px 40px', backgroundColor: 'white', border: '1px solid #E6E9EF', color: '#607D8B', borderRadius: '10px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}
               >
                 CANCEL
               </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AddGalleryForm;
