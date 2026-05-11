import React from 'react';
import { Card, Row, Col, Form } from 'react-bootstrap';
import { Calendar as CalendarIcon, Info } from 'lucide-react';
import DatePicker from 'react-datepicker';

const BookingTimeForm = ({ startDate, endDate, onStartDateChange, onEndDateChange, minDate, bookedDates, duration }) => {
  return (
    <Card className="border-0 shadow-sm rounded-4 p-4 bg-white">
      <h3 className="h5 fw-black mb-4 d-flex align-items-center gap-2" style={{ color: '#0f172a' }}>
        <CalendarIcon size={20} /> Thời gian thuê
      </h3>
      <Row className="g-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label className="small fw-black text-muted text-uppercase" style={{ letterSpacing: '1px' }}>Ngày nhận xe</Form.Label>
            <div className="date-picker-wrapper">
              <DatePicker
                selected={startDate}
                onChange={onStartDateChange}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                minDate={minDate}
                excludeDates={bookedDates}
                dateFormat="dd/MM/yyyy"
                className="form-control p-3 rounded-3 border-light fw-bold text-dark shadow-none bg-light bg-opacity-50"
              />
            </div>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label className="small fw-black text-muted text-uppercase" style={{ letterSpacing: '1px' }}>Ngày trả xe</Form.Label>
            <div className="date-picker-wrapper">
              <DatePicker
                selected={endDate}
                onChange={onEndDateChange}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                excludeDates={bookedDates}
                dateFormat="dd/MM/yyyy"
                className="form-control p-3 rounded-3 border-light fw-bold text-dark shadow-none bg-light bg-opacity-50"
              />
            </div>
          </Form.Group>
        </Col>
      </Row>
      <div className="mt-4 p-3 rounded-3 d-flex align-items-center gap-3 border" style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }}>
        <div className="bg-white p-2 rounded-2 text-primary shadow-sm"><Info size={18} /></div>
        <p className="mb-0 text-primary small fw-bold">Tổng thời gian: <span className="fs-6 fw-black">{duration} ngày</span></p>
      </div>
    </Card>
  );
};

export default BookingTimeForm;
