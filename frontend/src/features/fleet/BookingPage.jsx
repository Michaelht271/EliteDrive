import React from 'react';
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { ArrowLeft } from 'lucide-react';
import Header from '../../components/layout/Header.jsx';
import PublicFooter from '../../components/layout/PublicFooter.jsx';
import BaseModal from '../../components/ui/BaseModal.jsx';

// Import Custom Hook
import { useBooking } from './hooks/useBooking.js';

// Import Sub-components
import VehicleSummary from './components/VehicleSummary.jsx';
import BookingTimeForm from './components/BookingTimeForm.jsx';
import BookingSidebar from './components/BookingSidebar.jsx';

const BookingPage = () => {
  const {
    vehicle, loading, submitting, error, startDate, endDate, location, setLocation,
    duration, subtotal, tax, total, showConfirm, setShowConfirm, bookedDates, tomorrow,
    handleStartDateChange, handleEndDateChange, handleBookingSubmit, navigate
  } = useBooking();

  if (loading) return (
    <div className="min-vh-100 d-flex flex-column bg-white">
      <Header />
      <div className="flex-grow-1 d-flex align-items-center justify-content-center">
        <Spinner animation="border" variant="primary" />
      </div>
      <PublicFooter />
    </div>
  );

  if (!vehicle) return (
    <div className="min-vh-100 d-flex flex-column bg-white">
      <Header />
      <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center p-4">
        <Alert variant="danger">Không tìm thấy thông tin xe.</Alert>
      </div>
      <PublicFooter />
    </div>
  );

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: '#f8fafc', color: '#0f172a', fontFamily: '"Inter", sans-serif' }}>
      <Header />
      
      <main className="flex-grow-1 py-5">
        <Container style={{ maxWidth: '1200px' }}>
          
          <div className="mb-5 d-flex align-items-center gap-4">
             <Button 
                variant="link" 
                className="btn-back-custom shadow-none" 
                onClick={() => navigate(-1)}
             >
               <ArrowLeft size={20} />
             </Button>
             <div>
                <h1 className="fw-black m-0" style={{ fontSize: '2.5rem', letterSpacing: '-1.5px', color: '#0f172a' }}>Hoàn tất đặt xe</h1>
                <p className="text-muted fw-medium mb-0">Kiểm tra thông tin và xác nhận hành trình của bạn.</p>
             </div>
          </div>

          {error && <Alert variant="danger" className="border-0 shadow-sm rounded-4 p-4 mb-4 fw-bold">{error}</Alert>}

          <Row className="g-4">
            <Col lg={7}>
              <VehicleSummary vehicle={vehicle} />
              <BookingTimeForm 
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={handleStartDateChange}
                onEndDateChange={handleEndDateChange}
                minDate={tomorrow}
                bookedDates={bookedDates}
                duration={duration}
              />
            </Col>

            <Col lg={5}>
              <BookingSidebar 
                location={location}
                setLocation={setLocation}
                vehicle={vehicle}
                duration={duration}
                subtotal={subtotal}
                tax={tax}
                total={total}
                onConfirm={() => setShowConfirm(true)}
              />
            </Col>
          </Row>
        </Container>
      </main>

      <BaseModal 
        show={showConfirm}
        onHide={() => !submitting && setShowConfirm(false)}
        onConfirm={handleBookingSubmit}
        title="Xác nhận yêu cầu"
        message={`EliteDrive sẽ tiếp nhận yêu cầu đặt xe ${vehicle?.carName} của bạn. Chúng tôi sẽ liên hệ sớm nhất để hoàn tất thủ tục.`}
        type="confirm"
        confirmLabel="ĐỒNG Ý ĐẶT XE"
        loading={submitting}
      />

      <PublicFooter />
      
      <style>{`
        .date-picker-wrapper .react-datepicker-wrapper { width: 100%; }
        .react-datepicker { font-family: 'Inter', sans-serif; border-radius: 12px; border: 1px solid #e2e8f0; shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
        .react-datepicker__header { background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; border-top-left-radius: 12px; border-top-right-radius: 12px; padding-top: 10px; }
        .react-datepicker__day--selected { background-color: #001e40 !important; border-radius: 8px; }
        .react-datepicker__day--disabled { color: #cbd5e1 !important; text-decoration: line-through; }
      `}</style>
    </div>
  );
};

export default BookingPage;
