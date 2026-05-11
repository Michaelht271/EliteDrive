import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';

/**
 * DashboardLayout Component
 * 
 * Specialized layout for dashboard features that does not include the standard Header.
 * This provides more vertical space and a cleaner interface for management tasks.
 */
const DashboardLayout = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: '#f3f3f6' }}>
      {/* Mobile Header - Only visible on small screens */}
      <div className="d-lg-none position-fixed top-0 start-0 end-0 bg-white shadow-sm d-flex align-items-center justify-content-between px-3" style={{ height: '64px', zIndex: 1020 }}>
        <Link to="/" className="text-decoration-none">
          <h4 className="fw-bold mb-0 text-primary">EliteDrive</h4>
        </Link>
        <button 
          className="btn btn-light border shadow-sm p-2 rounded-3"
          onClick={() => setShowSidebar(true)}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar - Controlled by showSidebar state on mobile */}
      <Sidebar show={showSidebar} onClose={() => setShowSidebar(false)} />
      
      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex flex-column main-content">
        <main className="flex-grow-1 p-3 p-lg-4" style={{ marginTop: '64px', paddingBottom: '2rem' }}>
          {/* Add spacing for desktop where mobile header is hidden */}
          <div className="d-none d-lg-block" style={{ marginTop: '-64px' }}></div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
