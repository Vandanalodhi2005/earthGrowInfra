import { useState } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { HiPlus, HiX, HiCloudUpload, HiInformationCircle, HiLocationMarker, HiViewGrid, HiCheckCircle } from 'react-icons/hi';

const AddPropertyForm = ({ onCancel, onSuccess, initialData }) => {
  const [formData, setFormData] = useState({
    status: initialData?.status || '',
    propertyType: initialData?.propertyType || '',
    price: initialData?.price || '',
    area: initialData?.area || '',
    plotArea: initialData?.plotArea || '',
    bedroom: initialData?.bedroom || '',
    transaction: initialData?.transaction || '',
    furnishing: initialData?.furnishing || '',
    propertyAge: initialData?.propertyAge || '',
    flatNo: initialData?.flatNo || '',
    propertyName: initialData?.propertyName || '',
    buildingName: initialData?.buildingName || '',
    street: initialData?.street || '',
    landmark: initialData?.landmark || '',
    pinCode: initialData?.pinCode || '',
    address: initialData?.address || '',
    city: initialData?.city || '',
    location: initialData?.location || '',
    propertyDescription: initialData?.propertyDescription || '',
    detailedInformation: initialData?.detailedInformation || '',
    amenities: initialData?.amenities || [],
    youtubeUrl: initialData?.youtubeUrl || '',
  });
  
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      const formDataToSend = new FormData();

      Object.keys(formData).forEach(key => {
        if (key === 'amenities') {
          formDataToSend.append(key, Array.isArray(formData[key]) ? formData[key].join(',') : formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      images.forEach((image) => {
        formDataToSend.append('images', image);
      });

      const url = initialData 
        ? `${import.meta.env.VITE_BACKEND_URL}/api/properties/${initialData._id}`
        : `${import.meta.env.VITE_BACKEND_URL}/api/properties`;
        
      const response = await fetch(url, {
        method: initialData ? 'PUT' : 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataToSend,
      });

      if (response.ok) {
        toast.success(`Property ${initialData ? 'updated' : 'added'} successfully!`);
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

  const amenitiesList = [
    'Water Softener', 'Kids Play Area', 'Volleyball Court', 'Badminton Court', 'Cricket Pitch', 'Wifi',
    'Dining Table', 'Curtains', 'Chimney', 'Microwave', 'Stove', 'Water Purifier', 'Washing Machine',
    'Fans', 'Lights', 'Exhaust Fan', 'Sofa', 'Wardrobe', 'T.V', 'Geysers', 'Modular Kitchen', 'Air Condition',
    'Refrigerator', 'Earthquake Resistant', 'Landscaped Garden', 'Indoor Games', 'Jogging park', 'Yoga centre',
    'Amphitre', 'Poolside Party Deck', 'Sklandscaping Party Lawns', 'Sky Lounge', 'Cabana cafe', 'Astro deck',
    'Herbal garden', 'Sky Walkway', 'Yoga Pads', 'UPS', 'Conference Room', 'Cafeteria', 'Garden', 'Terrace',
    'Lawn', 'Intercom', 'Reserved Park', 'CCTV', 'PlayArea', 'Balcony', 'Servant Quarters', 'Gym', 'Internet Connection',
    'Security', 'Parking', 'Swimming Pool', 'Gas Connection', 'Power Backup', 'Rain Water Harvesting', 'Clubhouse',
    'Lift', 'Vaastu', 'Air Conditioning', 'Large Windows/Natural Light', 'Stainless Steel Appliances', 'Laundry'
  ];

  const sectionHeaderStyle = { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', fontWeight: '800', color: 'var(--color-navy)', marginBottom: '30px', paddingBottom: '10px', borderBottom: '2px solid #F0F0F0' };
  const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
  const labelStyle = { fontSize: '12px', fontWeight: '700', color: '#607D8B', textTransform: 'uppercase' };
  const inputStyle = { width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #E6E9EF', backgroundColor: '#F8F9FA', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s' };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', animateOnScroll: 'fade-in-up' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '900', color: 'var(--color-navy)' }}>Add Property Listing</h2>
        <button onClick={onCancel} style={{ background: '#ECEFF1', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', color: '#455A64' }}>Cancel</button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        {error && <div style={{ background: '#FFEBEE', color: '#F44336', padding: '15px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px' }}>{error}</div>}

        {/* Section 1: Property Information */}
        <div className="modal-content" style={cardStyle}>
          <h3 style={sectionHeaderStyle}><HiPlus color="var(--color-gold)" /> Property Information</h3>
          <div className="form-grid" style={formGridStyle}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Status *</label>
              <select name="status" value={formData.status} onChange={handleInputChange} style={inputStyle} required>
                <option value="">Select Status</option>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
              </select>
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Property Type *</label>
              <select name="propertyType" value={formData.propertyType} onChange={handleInputChange} style={inputStyle} required>
                <option value="">Select Type</option>
                 <option value="apartment">Apartment</option>
                 <option value="villa">Villa</option>
                 <option value="plot">Plot</option>
                 <option value="commercial">Commercial</option>
                 <option value="investment">Investment</option>
              </select>
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Price *</label>
              <input type="number" name="price" value={formData.price} onChange={handleInputChange} style={inputStyle} placeholder="Enter price" required />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Area (Sq.ft) *</label>
              <input type="number" name="area" value={formData.area} onChange={handleInputChange} style={inputStyle} placeholder="Enter area" required />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Plot Area (Sq.ft)</label>
              <input type="number" name="plotArea" value={formData.plotArea} onChange={handleInputChange} style={inputStyle} placeholder="Enter plot area" />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Bedroom</label>
              <input type="number" name="bedroom" value={formData.bedroom} onChange={handleInputChange} style={inputStyle} placeholder="Number of bedrooms" />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Transaction</label>
              <select name="transaction" value={formData.transaction} onChange={handleInputChange} style={inputStyle}>
                <option value="">Select Transaction</option>
                <option value="new">New Property</option>
                <option value="resale">Resale</option>
              </select>
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Furnishing</label>
              <select name="furnishing" value={formData.furnishing} onChange={handleInputChange} style={inputStyle}>
                <option value="">Select Furnishing</option>
                <option value="furnished">Furnished</option>
                <option value="semi-furnished">Semi-Furnished</option>
                <option value="unfurnished">Unfurnished</option>
              </select>
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Property Age</label>
              <input type="text" name="propertyAge" value={formData.propertyAge} onChange={handleInputChange} style={inputStyle} placeholder="e.g. 2 years old" />
            </div>
          </div>
        </div>

        {/* Section 2: Location Information */}
        <div className="modal-content" style={cardStyle}>
          <h3 style={sectionHeaderStyle}><HiLocationMarker color="#FF9800" /> Location Information</h3>
          <div className="form-grid" style={formGridStyle}>
             <div style={inputGroupStyle}><label style={labelStyle}>Flat No./Unit No.</label><input type="text" name="flatNo" value={formData.flatNo} onChange={handleInputChange} style={inputStyle} placeholder="Flat/Unit number" /></div>
             <div style={inputGroupStyle}><label style={labelStyle}>Property Name</label><input type="text" name="propertyName" value={formData.propertyName} onChange={handleInputChange} style={inputStyle} placeholder="Property name" /></div>
             <div style={inputGroupStyle}><label style={labelStyle}>Building Name</label><input type="text" name="buildingName" value={formData.buildingName} onChange={handleInputChange} style={inputStyle} placeholder="Building name" /></div>
             <div style={inputGroupStyle}><label style={labelStyle}>Street</label><input type="text" name="street" value={formData.street} onChange={handleInputChange} style={inputStyle} placeholder="Street name" /></div>
             <div style={inputGroupStyle}><label style={labelStyle}>Landmark</label><input type="text" name="landmark" value={formData.landmark} onChange={handleInputChange} style={inputStyle} placeholder="Nearby landmark" /></div>
             <div style={inputGroupStyle}><label style={labelStyle}>Pin Code</label><input type="text" name="pinCode" value={formData.pinCode} onChange={handleInputChange} style={inputStyle} placeholder="Pin code" /></div>
             <div style={inputGroupStyle}><label style={labelStyle}>City *</label><input type="text" name="city" value={formData.city} onChange={handleInputChange} style={inputStyle} placeholder="City name" required /></div>
             <div style={inputGroupStyle}><label style={labelStyle}>Location *</label><input type="text" name="location" value={formData.location} onChange={handleInputChange} style={inputStyle} placeholder="Location/Area" required /></div>
          </div>
          <div style={{ ...inputGroupStyle, marginTop: '20px' }}>
             <label style={labelStyle}>Full Address</label>
             <textarea name="address" value={formData.address} onChange={handleInputChange} style={{ ...inputStyle, minHeight: '80px' }} placeholder="Detailed full address" />
          </div>
        </div>

        {/* Section 3: Description & Media */}
        <div className="modal-content" style={cardStyle}>
          <h3 style={sectionHeaderStyle}><HiInformationCircle color="#2196F3" /> Property Details & Media</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
             <div style={inputGroupStyle}><label style={labelStyle}>Property Short Description</label><textarea name="propertyDescription" value={formData.propertyDescription} onChange={handleInputChange} style={{ ...inputStyle, minHeight: '80px' }} placeholder="Brief description of the property" /></div>
             <div style={inputGroupStyle}><label style={labelStyle}>Detailed Information</label><textarea name="detailedInformation" value={formData.detailedInformation} onChange={handleInputChange} style={{ ...inputStyle, minHeight: '120px' }} placeholder="Comprehensive property details, specs, etc." /></div>
             <div style={inputGroupStyle}><label style={labelStyle}>YouTube Tour URL</label><input type="url" name="youtubeUrl" value={formData.youtubeUrl} onChange={handleInputChange} style={inputStyle} placeholder="https://youtube.com/watch?v=..." /></div>
             
             <div style={{ ...inputGroupStyle, marginTop: '10px' }}>
                <label style={labelStyle}>Property Images</label>
                <div style={uploadBoxStyle}>
                   <input type="file" multiple accept="image/*" onChange={handleImageChange} style={hiddenFileInputStyle} id="fileInput" />
                   <label htmlFor="fileInput" style={uploadLabelStyle}>
                      <HiCloudUpload size={30} />
                      <span>{images.length > 0 ? `${images.length} images selected` : 'Drag & drop or click to upload property images'}</span>
                   </label>
                </div>
                {images.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px', marginTop: '15px' }}>
                    {images.map((img, idx) => (
                      <div key={idx} style={previewBoxStyle}>
                        <img src={URL.createObjectURL(img)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="preview" />
                        <button type="button" onClick={() => removeImage(idx)} style={removeImageButtonStyle}><HiX /></button>
                      </div>
                    ))}
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Section 4: Amenities */}
        <div className="modal-content" style={cardStyle}>
          <h3 style={sectionHeaderStyle}><HiViewGrid color="#9C27B0" /> Amenities</h3>
          <div className="form-grid" style={amenitiesGridStyle}>
            {amenitiesList.map((amenity) => {
              const isChecked = formData.amenities.includes(amenity);
              return (
                <div key={amenity} onClick={() => handleAmenityChange(amenity)} style={amenityItemStyle(isChecked)}>
                   {isChecked ? <HiCheckCircle color="#4CAF50" size={18} /> : <div style={{ width: '18px', height: '18px', border: '2px solid #EEE', borderRadius: '50%' }} />}
                   <span style={{ fontSize: '12px', fontWeight: isChecked ? '700' : '500' }}>{amenity}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', gap: '20px', padding: '20px 0 50px' }}>
           <button type="button" onClick={onCancel} style={{ flex: 1, padding: '15px', borderRadius: '12px', border: '1px solid #E6E9EF', background: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
           <button disabled={loading} type="submit" style={{ flex: 2, padding: '15px', borderRadius: '12px', background: 'var(--color-navy)', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(10, 28, 58, 0.2)' }}>
              {loading ? 'Processing...' : 'Add Property'}
           </button>
        </div>
      </form>
    </div>
  );
};

// Styles
const cardStyle = { backgroundColor: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' };
const formGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' };
const amenitiesGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px' };
const amenityItemStyle = (active) => ({ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 15px', borderRadius: '12px', backgroundColor: active ? '#F1F8E9' : '#F8F9FA', border: active ? '1px solid #C8E6C9' : '1px solid #E6E9EF', cursor: 'pointer', transition: 'all 0.2s' });
const uploadBoxStyle = { border: '2px dashed #E6E9EF', borderRadius: '12px', backgroundColor: '#F8F9FA', padding: '40px', textAlign: 'center', cursor: 'pointer', position: 'relative' };
const hiddenFileInputStyle = { position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' };
const uploadLabelStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: '#90A4AE', fontSize: '14px', fontWeight: '600' };
const previewBoxStyle = { position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '10px', overflow: 'hidden', border: '1px solid #E6E9EF' };
const removeImageButtonStyle = { position: 'absolute', top: '5px', right: '5px', background: '#F44336', color: 'white', border: 'none', borderRadius: '4px', padding: '2px', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' };

AddPropertyForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default AddPropertyForm;