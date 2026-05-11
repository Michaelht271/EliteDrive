import React from 'react';
import { Card, Row, Col, InputGroup, Form, Button } from 'react-bootstrap';
import { Search } from 'lucide-react';

const RentalFilters = ({ filters, setFilters, onReset }) => {
  return (
    <Card className="border-0 shadow-sm rounded-4 mb-4">
      <Card.Body className="p-3">
        <Row className="g-3 align-items-center">
          <Col xs={12} md={6}>
            <InputGroup className="bg-light border-0 rounded-3">
              <InputGroup.Text className="bg-transparent border-0 pe-0 text-muted"><Search size={18} /></InputGroup.Text>
              <Form.Control
                placeholder="Tìm mã đơn, khách hàng hoặc tên xe..."
                className="bg-transparent border-0 py-2 shadow-none small fw-medium"
                value={filters.keyword}
                onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
              />
            </InputGroup>
          </Col>
          <Col xs={8} md={4}>
            <Form.Select 
              className="bg-light border-0 py-2 shadow-none small rounded-3 fw-bold"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="PENDING">Chờ phê duyệt</option>
              <option value="CONFIRMED">Đã xác nhận</option>
              <option value="RENTING">Đang di chuyển</option>
              <option value="COMPLETED">Đã hoàn thành</option>
              <option value="CANCELLED">Đã hủy</option>
            </Form.Select>
          </Col>
          <Col xs={4} md={2} className="text-end">
            <Button variant="link" className="text-primary fw-bold text-decoration-none small p-0 w-100 text-end text-md-center" onClick={onReset}>
              Reset
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default RentalFilters;
