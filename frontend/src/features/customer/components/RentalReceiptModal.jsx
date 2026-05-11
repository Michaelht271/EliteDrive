import React from 'react';
import { Modal, Button, Row, Col, Table, Alert } from 'react-bootstrap';
import { Printer, X, Download, ShieldCheck, MapPin, Calendar, CreditCard, Phone, User, Info, AlertCircle, FileText } from 'lucide-react';

const RentalReceiptModal = ({ show, onHide, rental }) => {
  if (!rental) return null;

  // Xử lý dữ liệu linh hoạt giữa RentalResponse và RentalDetailResponse
  const items = rental.items || [{
    carName: rental.carName || 'Thông tin xe',
    brand: rental.brand,
    licensePlate: rental.licensePlate || 'N/A',
    pricePerDay: (rental.totalPrice / 1.1) / (Math.ceil(Math.abs(new Date(rental.endDate) - new Date(rental.startDate)) / (1000 * 60 * 60 * 24)) || 1),
    days: Math.ceil(Math.abs(new Date(rental.endDate) - new Date(rental.startDate)) / (1000 * 60 * 60 * 24)) || 1,
    subtotal: rental.totalPrice / 1.1
  }];

  return (
    <Modal show={show} onHide={onHide} centered size="lg" className="receipt-modal border-0">
      <Modal.Body className="p-0 overflow-hidden rounded-4 shadow-2xl">
        <div className="bg-white p-4 p-md-5">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-start mb-4 pb-4 border-bottom">
            <div>
              <h2 className="fw-black text-primary mb-1" style={{ letterSpacing: '-1px' }}>EliteDrive</h2>
              <p className="text-muted small fw-bold text-uppercase mb-0">Chi tiết dịch vụ thuê xe</p>
            </div>
            <div className="text-end">
              <div className="fw-black text-dark h5 mb-1">Mã đơn: #RD-{rental.rentalId}</div>
              <div className="text-muted small fw-bold">Ngày tạo: {new Date(rental.createdAt || rental.createdDate).toLocaleDateString('vi-VN')}</div>
            </div>
          </div>

          {/* Alert for Cancellation */}
          {rental.status === 'CANCELLED' && (
            <Alert variant="danger" className="border-0 rounded-4 mb-4 d-flex gap-3 align-items-center">
              <AlertCircle size={24} />
              <div>
                <div className="fw-black small uppercase">Đơn hàng đã bị hủy</div>
                <div className="small opacity-75">Lý do: {rental.cancelReason || 'Không có lý do cụ thể'}</div>
              </div>
            </Alert>
          )}

          <Row className="mb-4 g-4">
            <Col md={6}>
              <h6 className="fw-black text-muted text-uppercase mb-3" style={{ fontSize: '10px', letterSpacing: '2px' }}>Thông tin khách hàng</h6>
              <div className="d-flex align-items-start gap-2 mb-1">
                <User size={14} className="mt-1 text-muted" />
                <div className="fw-black text-dark h6 mb-0">{rental.customerName}</div>
              </div>
              <div className="text-muted small fw-medium ms-4">{rental.customerEmail}</div>
              {rental.customerPhone && (
                <div className="text-muted small fw-bold ms-4 mt-1 d-flex align-items-center gap-1">
                  <Phone size={12} /> {rental.customerPhone}
                </div>
              )}
              <div className="mt-3 d-flex align-items-center gap-2 text-muted small fw-bold">
                <MapPin size={14} /> Điểm nhận: Showroom EliteDrive Hà Nội
              </div>
            </Col>
            <Col md={6}>
              <h6 className="fw-black text-muted text-uppercase mb-3" style={{ fontSize: '10px', letterSpacing: '2px' }}>Thời gian & Phụ trách</h6>
              <div className="d-flex align-items-center gap-2 mb-2">
                <Calendar size={16} className="text-primary" />
                <span className="small fw-black">{new Date(rental.startDate).toLocaleDateString('vi-VN')}</span>
                <span className="text-muted mx-2">—</span>
                <span className="small fw-black">{new Date(rental.endDate).toLocaleDateString('vi-VN')}</span>
              </div>
              {rental.staffName && (
                <div className="small fw-bold text-muted mb-2 d-flex align-items-center gap-1">
                  <ShieldCheck size={14} className="text-success" /> Nhân viên: {rental.staffName}
                </div>
              )}
              <div className={`px-3 py-1 rounded-pill d-inline-block small fw-bold border ${rental.status === 'CANCELLED' ? 'border-danger text-danger bg-danger bg-opacity-10' : 'border-primary text-primary bg-light'}`}>
                Trạng thái: {rental.status}
              </div>
            </Col>
          </Row>

          {/* Customer Notes */}
          {rental.notes && (
            <div className="mb-4 p-3 bg-light rounded-4 border-start border-primary border-4">
              <div className="d-flex align-items-center gap-2 text-primary fw-black small uppercase mb-1" style={{ fontSize: '9px' }}>
                <FileText size={14} /> Ghi chú từ khách hàng
              </div>
              <div className="small text-dark italic">"{rental.notes}"</div>
            </div>
          )}

          {/* Table */}
          <div className="mb-4 border rounded-4 overflow-hidden shadow-xs">
            <Table borderless hover className="mb-0 align-middle">
              <thead className="bg-light">
                <tr className="border-bottom">
                  <th className="px-4 py-3 text-muted text-uppercase fw-black" style={{ fontSize: '10px' }}>Hạng mục phương tiện</th>
                  <th className="px-4 py-3 text-muted text-uppercase fw-black text-center" style={{ fontSize: '10px' }}>Số ngày</th>
                  <th className="px-4 py-3 text-muted text-uppercase fw-black text-end" style={{ fontSize: '10px' }}>Đơn giá</th>
                  <th className="px-4 py-3 text-muted text-uppercase fw-black text-end" style={{ fontSize: '10px' }}>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} className="border-bottom border-light">
                    <td className="px-4 py-4">
                      <div className="fw-black text-dark mb-1">{item.carName}</div>
                      <div className="text-muted small fw-medium d-flex gap-2">
                        <span>Biển số: <span className="text-dark fw-bold">{item.licensePlate || 'N/A'}</span></span>
                        <span>|</span>
                        <span>{item.brand}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center fw-bold">
                      {item.days}
                    </td>
                    <td className="px-4 py-4 text-end fw-bold text-muted small">
                      {item.pricePerDay?.toLocaleString()}đ
                    </td>
                    <td className="px-4 py-4 text-end fw-black text-primary">
                      {item.subtotal?.toLocaleString()}đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Totals */}
          <div className="d-flex justify-content-end">
            <div style={{ width: '300px' }}>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted small fw-bold">Tạm tính:</span>
                <span className="fw-bold text-dark">{(rental.totalPrice / 1.1).toLocaleString()} VND</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted small fw-bold">VAT (10%):</span>
                <span className="fw-bold text-dark">{(rental.totalPrice - (rental.totalPrice / 1.1)).toLocaleString()} VND</span>
              </div>
              <div className="d-flex justify-content-between pt-3 mt-2 border-top">
                <span className="fw-black text-dark h6">TỔNG CỘNG:</span>
                <span className="fw-black text-primary h5 mb-0">{rental.totalPrice?.toLocaleString()} VND</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-top text-center no-print">
            <div className="d-flex align-items-center justify-content-center gap-2 text-success small fw-bold mb-4">
              <ShieldCheck size={18} /> EliteDrive cam kết chất lượng dịch vụ chuẩn Premium
            </div>
            <div className="d-flex gap-2 justify-content-center">
              <Button variant="white" className="border fw-bold px-4 rounded-3 d-flex align-items-center gap-2 py-2 shadow-none" onClick={() => window.print()}>
                <Printer size={18} /> In hóa đơn
              </Button>
              <Button variant="primary" className="fw-black px-4 rounded-3 border-0 d-flex align-items-center gap-2 py-2 bg-primary shadow-sm">
                <Download size={18} /> Tải PDF
              </Button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default RentalReceiptModal;
