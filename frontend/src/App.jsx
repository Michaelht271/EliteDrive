import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Public Pages
import Home from './features/home/Home';
import VehicleListing from './features/fleet/VehicleListing';
import VehicleDetail from './features/fleet/VehicleDetail';
import BookingPage from './features/fleet/BookingPage';

// Auth Pages
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import VerifyOTP from './features/auth/VerifyOTP';
import ForgotPassword from './features/auth/ForgotPassword';
import ResetPassword from './features/auth/ResetPassword';
import OAuth2RedirectHandler from './features/auth/OAuth2RedirectHandler';

// Dashboard Pages
import DashboardDispatcher from './features/dashboard/DashboardDispatcher';
import AdminDashboard from './features/dashboard/AdminDashboard';
import StaffDashboard from './features/dashboard/StaffDashboard';
import CustomerDashboard from './features/dashboard/CustomerDashboard';
import UserManagement from './features/admin/pages/UserManagement.jsx';
import CarManagement from './features/admin/pages/CarManagement.jsx';
import RentalManagement from './features/staff/RentalManagement';
import RentalHistory from './features/customer/RentalHistory';

// Profile Page
import Profile from './features/profile/Profile';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<VehicleListing />} />
          <Route path="/cars/:id" element={<VehicleDetail />} />
          <Route path="/booking/:id" element={<PrivateRoute><BookingPage /></PrivateRoute>} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/auth/google/success" element={<OAuth2RedirectHandler />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<PrivateRoute><DashboardDispatcher /></PrivateRoute>} />
          
          <Route path="/admin/dashboard" element={<PrivateRoute roles={['ROLE_ADMIN']}><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/users" element={<PrivateRoute roles={['ROLE_ADMIN']}><UserManagement /></PrivateRoute>} />
          <Route path="/admin/cars" element={<PrivateRoute roles={['ROLE_ADMIN']}><CarManagement /></PrivateRoute>} />
          <Route path="/staff/dashboard" element={<PrivateRoute roles={['ROLE_STAFF']}><StaffDashboard /></PrivateRoute>} />
          <Route path="/staff/rentals" element={<PrivateRoute roles={['ROLE_STAFF']}><RentalManagement /></PrivateRoute>} />
          <Route path="/customer/dashboard" element={<PrivateRoute roles={['ROLE_CUSTOMER']}><CustomerDashboard /></PrivateRoute>} />
          <Route path="/customer/history" element={<PrivateRoute roles={['ROLE_CUSTOMER']}><RentalHistory /></PrivateRoute>} />
          
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
