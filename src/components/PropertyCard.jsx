import Link from 'next/link';
import PropTypes from 'prop-types';

const PropertyCard = ({ property }) => {
  // Determine if it's a project, property, or investment
  const isProject = property.isProjectCollection || (property.type && !property.propertyType);
  const isInvestment = property.landType || property.propertyType === 'investment';
  
  const linkBase = isInvestment ? 'investment' : isProject ? 'project' : 'property';
  const linkPath = `/${linkBase}/${property._id}`;

  return (
    <div className="property-card fade-in-up">
      <div className="card-img-wrapper">
        <div className="status-badge" style={{ backgroundColor: isProject ? 'var(--color-navy)' : 'var(--color-gold)', textTransform: 'capitalize' }}>
          {isProject ? 'Project' : (property.status?.replace(/-/g, ' ') || 'Available')}
        </div>
        
        {isProject && (
          <div style={{ position: 'absolute', top: '20px', right: '20px', backgroundColor: 'var(--color-teal)', color: 'white', padding: '4px 12px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', zIndex: '3', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
            NEW LAUNCH
          </div>
        )}

        <img 
          src={property.images && property.images.length > 0 ? property.images[0] : '/assets/images/property_1.png'} 
          alt={property.propertyName || property.title || 'Property'} 
          className="card-img" 
          onError={(e) => { e.target.src = '/assets/images/property_1.png' }}
        />
        
        <div className="price-tag">
          ₹ {property.price?.toLocaleString() || property.totalPrice?.toLocaleString() || 'Price on Request'}
        </div>
        
        {/* Transaction Type Badge for properties */}
        {!isProject && property.transaction && (
          <div className="status-badge" style={{ top: '60px', left: '20px', backgroundColor: 'var(--color-teal)', fontSize: '0.75rem' }}>
             For {property.transaction}
          </div>
        )}
      </div>
      
      <div className="card-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-teal)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {isProject ? `${property.status?.replace(/-/g, ' ')}` : (property.propertyType || 'Residential')}
          </span>
        </div>
        
        <h3 className="line-clamp-1" style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
          {property.propertyName || property.title || "Premium Property"}
        </h3>
        
        <p className="location line-clamp-1" style={{ marginBottom: '15px', opacity: '0.8' }}>
          <i className="fas fa-map-marker-alt" style={{ color: 'var(--color-teal)' }}></i> {property.location}, {property.city}
        </p>
        
        <div className="card-amenities" style={{ borderTop: '1px solid var(--color-gray)', paddingTop: '12px' }}>
          {property.bedroom ? (
            <span><i className="fas fa-bed"></i> {property.bedroom} BHK</span>
          ) : isProject ? (
            <span><i className="fas fa-building"></i> Multi-Unit</span>
          ) : (
            <span><i className="fas fa-expand-arrows-alt"></i> Large Plot</span>
          )}
          
          {property.area && (
            <span><i className="fas fa-vector-square"></i> {property.area} {property.areaUnit || 'sq.ft'}</span>
          )}
          
          {property.furnishing && !property.area && (
             <span style={{ textTransform: 'capitalize' }}><i className="fas fa-couch"></i> {property.furnishing.replace('-', ' ')}</span>
          )}
        </div>
      </div>
      
      <div className="card-footer" style={{ padding: '0 20px 20px' }}>
          <Link 
            href={linkPath} 
            className="btn btn-outline-primary btn-full"
            style={{ fontWeight: '700', padding: '10px 15px', fontSize: '0.9rem' }}
          >
            View Details
         </Link>
      </div>
    </div>
  );
};

PropertyCard.propTypes = {
  property: PropTypes.object.isRequired,
};

export default PropertyCard;
