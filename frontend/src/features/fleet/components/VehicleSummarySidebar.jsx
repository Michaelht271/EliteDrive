import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { ShieldCheck, Zap, Headphones, CheckCircle2, ChevronRight, CreditCard, Sparkles } from 'lucide-react';

const VehicleSummarySidebar = ({ vehicle, isAvailable, onBookNow }) => {
  if (!vehicle) return null;

  return (
    <div className="sticky-top" style={{ top: '100px', zIndex: 10 }}>
      <Card className="border-0 shadow-lg rounded-4 overflow-hidden bg-white mb-4">
        <div className="bg-primary p-4 text-white position-relative">
          <div className="position-absolute top-0 end-0 p-3 opacity-10">
            <Sparkles size={60} />
          </div>
          <div className="position-relative z-1">
            <div className="d-flex align-items-center gap-2 mb-2 opacity-75">
              <CreditCard size={16} />
              <span className="label-sm fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>Giá thuê mỗi ngày</span>
            </div>
            <div className="d-flex align-items-baseline gap-2">
              <h2 className="fw-black m-0" style={{ fontSize: '2.5rem', letterSpacing: '-1px' }}>
                {(vehicle.pricePerDay || 0).toLocaleString()}
              </h2>
              <span className="fw-bold opacity-75">VND / ngày</span>
            </div>
          </div>
        </div>

        <Card.Body className="p-4">
          <div className="mb-4">
            <h4 className="h6 fw-black text-dark mb-3 text-uppercase" style={{ letterSpacing: '0.5px' }}>Dịch vụ đi kèm</h4>
            <ul className="list-unstyled mb-0">
              <li className="d-flex align-items-start gap-3 mb-3">
                <div className="bg-success bg-opacity-10 p-1 rounded">
                  <ShieldCheck size={18} className="text-success" />
                </div>
                <div>
                  <span className="d-block fw-bold text-dark" style={{ fontSize: '13px' }}>Bảo hiểm chuyến đi</span>
                  <small className="text-muted d-block" style={{ fontSize: '11px' }}>An tâm hơn với gói bảo hiểm tiêu chuẩn</small>
                </div>
              </li>
              <li className="d-flex align-items-start gap-3 mb-3">
                <div className="bg-info bg-opacity-10 p-1 rounded">
                  <Headphones size={18} className="text-info" />
                </div>
                <div>
                  <span className="d-block fw-bold text-dark" style={{ fontSize: '13px' }}>Hỗ trợ 24/7</span>
                  <small className="text-muted d-block" style={{ fontSize: '11px' }}>Luôn đồng hành cùng bạn trên mọi nẻo đường</small>
                </div>
              </li>
              <li className="d-flex align-items-start gap-3">
                <div className="bg-warning bg-opacity-10 p-1 rounded">
                  <Zap size={18} className="text-warning" />
                </div>
                <div>
                  <span className="d-block fw-bold text-dark" style={{ fontSize: '13px' }}>Vệ sinh khử khuẩn</span>
                  <small className="text-muted d-block" style={{ fontSize: '11px' }}>Xe luôn sạch sẽ và thơm tho trước khi giao</small>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-light rounded-4 p-3 mb-4 border border-light">
            <div className="d-flex align-items-center gap-2 text-dark mb-1">
              <CheckCircle2 size={16} className="text-primary" />
              <span className="fw-black" style={{ fontSize: '12px' }}>Chính sách hủy linh hoạt</span>
            </div>
            <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Hoàn tiền 100% nếu hủy trước 24h nhận xe.</p>
          </div>

          <Button 
            variant="primary"
            className="w-100 py-3 fw-black rounded-pill border-0 shadow-md d-flex align-items-center justify-content-center gap-2 transition-all active-scale-95"
            onClick={onBookNow}
            disabled={!isAvailable}
            style={{ fontSize: '14px', letterSpacing: '0.5px' }}
          >
            {isAvailable ? (
              <> TIẾP TỤC ĐẶT XE <ChevronRight size={18} /> </>
            ) : (
              'XE HIỆN KHÔNG CÓ SẴN'
            )}
          </Button>
        </Card.Body>
      </Card>

      <div className="text-center px-4">
        <p className="text-muted small mb-0">
          * Giá đã bao gồm phí bảo trì và các loại thuế phí theo quy định.
        </p>
      </div>
    </div>
  );
};

export default VehicleSummarySidebar;
