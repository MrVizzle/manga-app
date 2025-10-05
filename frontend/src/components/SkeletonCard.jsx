import './SkeletonCard.css';

const SkeletonCard = ({ 
  icon: Icon, 
  title, 
  hoverContent, 
  cardType, 
  hoveredCard, 
  onHover, 
  onLeave,
  actionButton 
}) => {
  return (
    <div 
      className={`skeleton-card ${hoveredCard === cardType ? 'hovered' : ''}`}
      onMouseEnter={() => onHover(cardType)}
      onMouseLeave={onLeave}
    >
      <div className="card-content">
        <div className="card-icon">
          <Icon className="icon" />
        </div>
        <h4 className="card-title">{title}</h4>
        
        <div className={`hover-content ${hoveredCard === cardType ? 'expanded' : ''}`}>
          <div className="hover-inner">
            <p className="hover-description">{hoverContent.description}</p>
            <ul className="hover-features">
              {hoverContent.features.map((feature, index) => (
                <li key={index} className="feature-item">
                  <div className="feature-dot"></div>
                  {feature}
                </li>
              ))}
            </ul>
            {actionButton && (
              <div className="action-section">
                {actionButton}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;