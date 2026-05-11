import React from 'react';
import { Card, Form, Badge, Button } from 'react-bootstrap';
import { MapPin } from 'lucide-react';

const BookingSidebar = ({ location, setLocation, vehicle, duration = 1, subtotal = 0, tax = 0, total = 0, onConfirm }) => {
  if (!vehicle) return null;

  return (
    <div className="sticky-top" style={{ top: '100px', zIndex: 10 }}>
      {/* Thẻ địa điểm nhận xe */}
      <Card className="border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="h5 fw-black text-primary mb-0 d-flex align-items-center gap-2" style={{ color: '#0f172a' }}>
            <MapPin size={20} /> Địa điểm nhận xe
          </h3>
          <Badge bg="success" className="bg-opacity-10 text-success fw-bold" style={{ fontSize: '10px' }}>HỖ TRỢ GIAO TẬN NƠI</Badge>
        </div>
        <Form.Control 
          as="textarea" rows={2}
          className="p-3 rounded-3 border-light fw-medium text-dark shadow-none bg-light bg-opacity-50"
          placeholder="VD: 123 Đường ABC, Quận Cầu Giấy, Hà Nội..."
          value={location || ''}
          onChange={(e) => setLocation(e.target.value)}
        />
      </Card>

      {/* Thẻ chi tiết thanh toán - Khôi phục đúng cấu trúc gốc */}
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        <Card.Body className="p-4 p-xl-5">
          <h3 className="h5 fw-black mb-4 border-bottom pb-3 text-dark">Chi tiết thanh toán</h3>
          <div className="space-y-3 mb-4 text-muted small">
            <div className="d-flex justify-content-between mb-2">
              <span className="fw-medium">Giá thuê ({(vehicle?.pricePerDay || 0).toLocaleString()} x {duration} ngày)</span>
              <span className="fw-bold text-dark">{(subtotal || 0).toLocaleString()} VND</span>
            </div>
            <div className="d-flex justify-content-between mb-2"><span>Bảo hiểm & Phí dịch vụ</span><span className="fw-bold text-success">0 VND</span></div>
            <div className="d-flex justify-content-between"><span>Thuế VAT (10%)</span><span className="fw-bold text-dark">{(tax || 0).toLocaleString()} VND</span></div>
          </div>
          
          <div className="pt-4 border-top border-light d-flex justify-content-between align-items-end mb-5">
            <div>
              <span className="text-muted text-uppercase fw-black" style={{ fontSize: '10px', letterSpacing: '1px' }}>Tổng cộng</span>
              <div className="h1 fw-black m-0 text-primary" style={{ letterSpacing: '-1.5px', color: '#001e40' }}>{(total || 0).toLocaleString()} <span className="h6 fw-bold">VND</span></div>
            </div>
          </div>

          <Button 
            className="w-100 py-3 fw-black rounded-3 border-0 shadow-lg transition-all active-scale-95"
            onClick={onConfirm}
            style={{ backgroundColor: '#fd7e14', color: '#fff', fontSize: '16px', letterSpacing: '1px' }}
          >
            XÁC NHẬN ĐẶT XE
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default BookingSidebar;
