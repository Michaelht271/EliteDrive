import React, { useState } from 'react';
import { Container, Spinner, Button, Row, Col } from 'react-bootstrap';
import { History, ChevronDown } from 'lucide-react';
import Header from '../../components/layout/Header.jsx';
import PublicFooter from '../../components/layout/PublicFooter.jsx';
import RentalCard from './components/RentalCard.jsx';
import { useRentalHistory } from './hooks/useRentalHistory.js';
import { RentalRepository } from '../../data/repositories/RentalRepository.js';
import BaseModal from '../../components/ui/BaseModal.jsx';
import RentalReceiptModal from './components/RentalReceiptModal.jsx';

const RentalHistory = () => {
  const {
    rentals,
    loading,
    statusFilter,
    handleStatusChange,
    totalElements,
    refresh
  } = useRentalHistory();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const handleCancelClick = (rental) => {
    setSelectedRental(rental);
    setCancelReason('');
    setShowCancelModal(true);
  };

  const handleReceiptClick = (rental) => {
    setSelectedRental(rental);
    setShowReceiptModal(true);
  };

  const onConfirmCancel = async () => {
    if (!cancelReason.trim()) return;

    setCancelling(true);
    try {
      await RentalRepository.cancelRental(selectedRental.rentalId, cancelReason);
      refresh();
      setShowCancelModal(false);
    } catch (error) {
      alert('Không thể hủy đơn đặt xe này.');
    } finally {
      setCancelling(false);
    }
  };

  const statuses = [
    { key: 'ALL', label: 'Tất cả' },
    { key: 'PENDING', label: 'Chờ xác nhận' },
    { key: 'CONFIRMED', label: 'Đã xác nhận' },
    { key: 'RENTING', label: 'Đang di chuyển' },
    { key: 'COMPLETED', label: 'Hoàn thành' },
    { key: 'CANCELLED', label: 'Đã hủy' }
  ];

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: '#f8fafc', color: '#0f172a' }}>
      <Header />
      
      <main className="flex-grow-1 py-4 py-md-5">
        <Container style={{ maxWidth: '1140px' }}>
          
          <div className="mb-4 mb-md-5">
            <h1 className="fw-black mb-2" style={{ fontSize: 'calc(1.8rem + 1.2vw)', letterSpacing: '-1.5px', color: '#0f172a' }}>Lịch sử thuê xe</h1>
            <p className="text-muted fw-medium fs-6 fs-md-5">Quản lý và xem lại những hành trình đẳng cấp của bạn.</p>
          </div>

          <div className="d-flex align-items-center border-bottom mb-4 mb-md-5 overflow-x-auto no-scrollbar scroll-smooth" style={{ WebkitOverflowScrolling: 'touch' }}>
            {statuses.map((s) => (
              <button
                key={s.key}
                onClick={() => handleStatusChange(s.key)}
                className={`px-3 px-md-4 py-2 py-md-3 fw-bold small text-uppercase transition-all border-0 bg-transparent ${
                  statusFilter === s.key 
                    ? 'text-primary border-bottom border-3 border-primary' 
                    : 'text-muted opacity-60 hover-text-primary'
                }`}
                style={{ letterSpacing: '0.5px', whiteSpace: 'nowrap', marginBottom: '-1px' }}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="d-flex flex-column gap-3">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted fw-bold">Đang tải lịch sử...</p>
              </div>
            ) : rentals.length > 0 ? (
              rentals.map((rental) => (
                <RentalCard 
                  key={rental.rentalId} 
                  rental={rental} 
                  onCancel={handleCancelClick}
                  onViewReceipt={handleReceiptClick}
                />
              ))
            ) : (
              <div className="text-center py-5 bg-white rounded-4 shadow-sm border border-light">
                <div className="bg-light d-inline-block p-4 rounded-circle mb-3">
                  <History size={48} className="text-muted opacity-20" />
                </div>
                <h5 className="fw-bold">Chưa có chuyến đi nào</h5>
                <p className="text-muted mb-4">Hãy bắt đầu hành trình đầu tiên của bạn cùng EliteDrive.</p>
                <Button variant="primary" href="/cars" className="rounded-pill px-5 py-2 fw-bold shadow-sm border-0 bg-primary">Thuê xe ngay</Button>
              </div>
            )}
          </div>

          {!loading && rentals.length < totalElements && (
            <div className="mt-5 text-center">
              <Button variant="outline-dark" className="rounded-pill px-5 py-2 fw-bold border-2 d-inline-flex align-items-center gap-2">
                <ChevronDown size={20} /> Tải thêm chuyến đi
              </Button>
            </div>
          )}

        </Container>
      </main>

      <RentalReceiptModal 
        show={showReceiptModal} 
        onHide={() => setShowReceiptModal(false)} 
        rental={selectedRental} 
      />

      <BaseModal 
        show={showCancelModal}
        onHide={() => !cancelling && setShowCancelModal(false)}
        onConfirm={onConfirmCancel}
        title="Xác nhận hủy đơn"
        message={`Bạn có chắc chắn muốn hủy đơn đặt xe ${selectedRental?.carName}?`}
        type="danger"
        confirmLabel="XÁC NHẬN HỦY"
        loading={cancelling}
        showInput={true}
        inputPlaceholder="Vui lòng nhập lý do hủy đơn (ví dụ: Thay đổi kế hoạch, Đặt nhầm xe...)"
        inputValue={cancelReason}
        onInputChange={setCancelReason}
      />

      <PublicFooter />
    </div>
  );
};

export default RentalHistory;
