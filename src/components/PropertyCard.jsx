import Link from 'next/link';
import PropTypes from 'prop-types';

const PropertyCard = ({ property }) => {
  // Determine if it's a project, property, or investment
  const isProject = property.isProjectCollection || (property.type && !property.propertyType);
  const isInvestment = property.landType || property.propertyType === 'investment';
  
  const linkBase = isInvestment ? 'investment' : isProject ? 'project' : 'property';
  const linkPath = `/${linkBase}/${property._id}`;

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', transition: 'transform 0.3s ease' }}
         onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
         onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ position: 'relative', height: '220px' }}>
        <img 
          src={property.images && property.images.length > 0 ? property.images[0] : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800'} 
          alt={property.propertyName || property.title || 'Property'} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        
        <div style={{ 
          position: 'absolute', 
          top: '15px', 
          left: '15px', 
          backgroundColor: '#C69C6D', 
          color: 'white', 
          padding: '8px 15px', 
          borderRadius: '8px', 
          fontSize: '0.9rem', 
          fontWeight: 700,
          textTransform: 'uppercase'
        }}>
          Rent
        </div>
      </div>
      
      <div style={{ padding: '25px' }}>
        <p style={{ color: '#495057', fontSize: '0.9rem', marginBottom: '10px' }}>
          {property.location}, {property.city || 'City'}
        </p>
        
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0A1C3A', marginBottom: '15px', lineHeight: 1.3 }}>
          {property.propertyName || property.title || "Premium Property"}
        </h3>
        
        <p style={{ color: '#495057', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '15px' }}>
          This charming {property.propertyType || 'property'} features {property.bedroom ? `${property.bedroom} bedrooms,` : ''} a spacious living room, and a beautifully landscaped backyard.
        </p>
        
        <h4 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#C69C6D', marginBottom: '15px' }}>
          ₹ {property.price?.toLocaleString() || property.totalPrice?.toLocaleString() || 'Price on Request'}
        </h4>
        
        <div style={{ display: 'flex', gap: '30px', color: '#495057', fontSize: '1rem' }}>
          {property.bedroom && (
            <span>
              {property.bedroom} Rooms
            </span>
          )}
          {property.bathroom && (
            <span>
              {property.bathroom} Baths
            </span>
          )}
          {property.area && (
            <span>
              {property.area} Sq Ft
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

PropertyCard.propTypes = {
  property: PropTypes.object.isRequired,
};

export default PropertyCard;
