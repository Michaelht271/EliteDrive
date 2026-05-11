import React from 'react';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';

const Layout = ({ children }) => {
  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar />
      <div className="flex-grow-1 d-flex flex-column" style={{ marginLeft: '280px' }}>
        <Header />
        <main className="p-4 bg-light flex-grow-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
