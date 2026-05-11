import React from 'react';
import { Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { Edit2, Save, X } from 'lucide-react';

const InfoField = ({ label, value, name, type = 'text', isEditing, onChange }) => (
  <div className="mb-4">
    <label className="text-muted fw-bold text-uppercase mb-1 d-block" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
      {label}
    </label>
    {isEditing ? (
      <Form.Control
        type={type}
        name={name}
        value={value || ''}
        onChange={onChange}
        className="bg-light border-0 py-2 rounded-3 fw-medium"
      />
    ) : (
      <p className="fs-6 fw-medium text-dark mb-0">{value || 'Not provided'}</p>
    )}
  </div>
);

const PersonalInfo = ({ profileData, isEditing, setIsEditing, handleChange, handleSubmit, isUpdating }) => {
  return (
    <div className="bg-white rounded-4 p-4 soft-elevation mb-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h5 className="fw-bold text-primary mb-0">Personal Information</h5>
        {!isEditing ? (
          <Button 
            variant="link" 
            className="text-primary fw-bold text-decoration-none d-flex align-items-center gap-1 p-0"
            onClick={() => setIsEditing(true)}
            style={{ fontSize: '14px' }}
          >
            <Edit2 size={16} /> Edit
          </Button>
        ) : (
          <Button 
            variant="link" 
            className="text-muted fw-bold text-decoration-none d-flex align-items-center gap-1 p-0"
            onClick={() => setIsEditing(false)}
            style={{ fontSize: '14px' }}
          >
            <X size={16} /> Cancel
          </Button>
        )}
      </div>

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <InfoField label="Full Name" name="fullName" value={profileData?.fullName} isEditing={isEditing} onChange={handleChange} />
          </Col>
          <Col md={6}>
            <InfoField label="Email Address" value={profileData?.email} isEditing={false} />
          </Col>
          <Col md={6}>
            <InfoField label="Phone Number" name="phoneNumber" value={profileData?.phoneNumber} isEditing={isEditing} onChange={handleChange} />
          </Col>
          <Col md={6}>
            <InfoField label="Date of Birth" name="dateOfBirth" type="date" value={profileData?.dateOfBirth} isEditing={isEditing} onChange={handleChange} />
          </Col>
          <Col md={6}>
            <InfoField label="Driver's License" name="driverLicenceId" value={profileData?.driverLicenceId} isEditing={isEditing} onChange={handleChange} />
          </Col>
          <Col md={6}>
            <InfoField label="Citizen ID (CCCD)" name="identifyId" value={profileData?.identifyId} isEditing={isEditing} onChange={handleChange} />
          </Col>
          <Col md={12}>
            <div className="pt-3 border-top border-light">
              <InfoField label="Residential Address" name="address" value={profileData?.address} isEditing={isEditing} onChange={handleChange} />
            </div>
          </Col>
        </Row>

        {isEditing && (
          <div className="d-flex justify-content-end mt-2">
            <Button 
              variant="primary" 
              type="submit" 
              className="px-5 py-2 fw-bold rounded-3 shadow-sm d-flex align-items-center gap-2"
              disabled={isUpdating}
              style={{ backgroundColor: 'var(--primary-container)' }}
            >
              {isUpdating ? <Spinner size="sm" /> : <Save size={18} />}
              {isUpdating ? 'Saving Changes...' : 'Save Profile'}
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
};

export default PersonalInfo;
