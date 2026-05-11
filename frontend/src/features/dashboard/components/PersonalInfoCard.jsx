import React from 'react';
import { Card, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { Edit2, Save, X } from 'lucide-react';

/**
 * Clean Code: Moving InfoItem outside to prevent re-creation on every render.
 */
const InfoItem = ({ label, value, name, type = "text", readOnly = false, isEditing, handleChange, options, error }) => (
  <div className="mb-4">
    <label className="text-muted small fw-bold text-uppercase tracking-wider mb-1 d-block" style={{ fontSize: '11px' }}>
      {label}
    </label>
    {isEditing && !readOnly ? (
      <>
        {type === "select" ? (
          <Form.Select 
            name={name}
            value={value || ''}
            onChange={handleChange}
            isInvalid={!!error}
            className="bg-light border-0 py-2 fw-medium rounded-3"
            style={{ fontSize: '15px' }}
          >
            <option value="">Chọn {label.toLowerCase()}</option>
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </Form.Select>
        ) : (
          <Form.Control 
            name={name}
            type={type}
            value={value || ''}
            onChange={handleChange}
            isInvalid={!!error}
            className="bg-light border-0 py-2 fw-medium rounded-3"
            style={{ fontSize: '15px' }}
            autoComplete="off"
          />
        )}
        {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
      </>
    ) : (
      <p className="fw-medium mb-0" style={{ color: '#1a1c1e', fontSize: '16px' }}>
        {type === "select" ? (options?.find(o => o.value === value)?.label || value || 'Chưa cập nhật') : (value || 'Chưa cập nhật')}
      </p>
    )}
  </div>
);

const PersonalInfoCard = ({ 
  profileData, 
  isEditing, 
  setIsEditing, 
  handleChange, 
  onSave, 
  isUpdating, 
  showEditButton = true, 
  isAdmin = false,
  isStaff = false,
  errors = {}
}) => {
  return (
    <Card className="border-0 shadow-sm rounded-4 p-4 bg-white">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0" style={{ color: '#001e40' }}>Thông tin cá nhân</h5>
        {showEditButton && (
          <div className="d-flex gap-2">
            {isEditing ? (
              <>
                <Button 
                  variant="light" 
                  size="sm"
                  className="fw-bold text-muted d-flex align-items-center gap-1 rounded-3 px-3"
                  onClick={() => setIsEditing(false)}
                  disabled={isUpdating}
                >
                  <X size={14} /> Hủy
                </Button>
                <Button 
                  variant="primary" 
                  size="sm"
                  className="fw-bold d-flex align-items-center gap-1 rounded-3 px-3"
                  style={{ backgroundColor: '#001e40', border: 'none' }}
                  onClick={onSave}
                  disabled={isUpdating}
                >
                  {isUpdating ? <Spinner size="sm" /> : <Save size={14} />} 
                  {isUpdating ? 'Đang lưu...' : 'Lưu'}
                </Button>
              </>
            ) : (
              <Button 
                variant="link" 
                className="p-0 text-primary fw-bold text-decoration-none d-flex align-items-center gap-1"
                style={{ fontSize: '14px' }}
                onClick={() => setIsEditing(true)}
              >
                <Edit2 size={14} /> Chỉnh sửa
              </Button>
            )}
          </div>
        )}
      </div>
      
      <Row>
        <Col md={6}>
          <InfoItem label="Họ và tên" value={profileData?.fullName} name="fullName" isEditing={isEditing} handleChange={handleChange} error={errors.fullName} />
        </Col>
        <Col md={6}>
          <InfoItem label="Địa chỉ Email" value={profileData?.email} name="email" readOnly isEditing={isEditing} handleChange={handleChange} />
        </Col>
        <Col md={6}>
          <InfoItem label="Số điện thoại" value={profileData?.phoneNumber} name="phoneNumber" isEditing={isEditing} handleChange={handleChange} error={errors.phoneNumber} />
        </Col>
        <Col md={6}>
          <InfoItem label="Ngày sinh" value={profileData?.dateOfBirth} name="dateOfBirth" type="date" isEditing={isEditing} handleChange={handleChange} error={errors.dateOfBirth} />
        </Col>

        {/* Thông tin dành riêng cho Staff */}
        {isStaff && (
          <>
            <Col md={6}>
              <InfoItem 
                label="Mức lương" 
                value={profileData?.salary} 
                name="salary" 
                type="number"
                readOnly={true} // Staff không được tự sửa lương
                isEditing={isEditing} 
                handleChange={handleChange} 
              />
            </Col>
            <Col md={6}>
              <InfoItem 
                label="Ca làm việc" 
                value={profileData?.shift} 
                name="shift" 
                type="select"
                options={[
                  { label: 'Ca sáng (08:00 - 16:00)', value: 'MORNING' },
                  { label: 'Ca chiều (16:00 - 00:00)', value: 'AFTERNOON' }
                ]}
                readOnly={true} // Staff không được tự sửa ca làm việc
                isEditing={isEditing} 
                handleChange={handleChange} 
              />
            </Col>
          </>
        )}

        {/* Thông tin dành cho Customer (Không phải Admin và không phải Staff) */}
        {!isAdmin && !isStaff && (
          <>
            <Col md={6}>
              <InfoItem label="Bằng lái xe" value={profileData?.driverLicenceId} name="driverLicenceId" isEditing={isEditing} handleChange={handleChange} error={errors.driverLicenceId} />
            </Col>
            <Col md={6}>
              <InfoItem label="Số CCCD" value={profileData?.identifyId} name="identifyId" isEditing={isEditing} handleChange={handleChange} error={errors.identifyId} />
            </Col>
          </>
        )}

        <Col md={12} className="pt-3 border-top mt-2">
          <InfoItem label="Địa chỉ thường trú" value={profileData?.address} name="address" isEditing={isEditing} handleChange={handleChange} error={errors.address} />
        </Col>
      </Row>
    </Card>
  );
};

export default PersonalInfoCard;
