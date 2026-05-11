import React from 'react';
import { Play } from 'lucide-react';

const VehicleMedia = ({ thumbnailUrl, carName }) => {
  const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&q=80&w=1200';
    return url;
  };

  return (
    <div className="position-relative overflow-hidden shadow-sm mb-5" style={{ background: '#fff', padding: '10px', borderRadius: '32px' }}>
      <div className="position-relative overflow-hidden ratio ratio-16x9" style={{ borderRadius: '24px' }}>
        <img src={getImageUrl(thumbnailUrl)} alt={carName} className="w-100 h-100 object-fit-cover" />
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-black bg-opacity-10 d-flex align-items-center justify-content-center">
          <div 
            className="bg-white bg-opacity-90 rounded-circle d-flex align-items-center justify-content-center shadow-lg" 
            style={{ width: '80px', height: '80px', cursor: 'pointer', transition: 'transform 0.3s' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Play size={32} className="text-dark fill-dark ms-1" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleMedia;
