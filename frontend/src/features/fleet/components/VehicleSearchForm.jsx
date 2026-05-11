import React, { useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { MapPin, Calendar } from 'lucide-react';
import BaseInput from '../../../components/ui/BaseInput.jsx';
import BaseButton from '../../../components/ui/BaseButton.jsx';

const VehicleSearchForm = ({ onSearch }) => {
  const [searchData, setSearchData] = useState({
    location: '',
    pickupDate: '',
    returnDate: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchData);
  };

  const todayStr = (() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  })();

  return (
    <Card className="border-0 shadow-lg p-4 mx-auto overflow-visible" style={{ maxWidth: '1000px', borderRadius: '12px' }}>
      <form onSubmit={handleSubmit}>
        <Row className="g-3 align-items-end">
          <Col md={4}>
            <BaseInput 
              label="Tìm kiếm xe" 
              icon={MapPin} 
              placeholder="Nhập tên xe, hãng hoặc địa điểm"
              value={searchData.location}
              onChange={(e) => setSearchData({...searchData, location: e.target.value})}
            />
          </Col>
          <Col md={3}>
            <BaseInput 
              label="Ngày nhận" 
              icon={Calendar} 
              type="date"
              value={searchData.pickupDate}
              onChange={(e) => {
                const newPickupDate = e.target.value;
                setSearchData(prev => ({
                  ...prev,
                  pickupDate: newPickupDate,
                  // Nếu ngày nhận mới sau ngày trả hiện tại, xóa ngày trả
                  returnDate: prev.returnDate && newPickupDate > prev.returnDate ? '' : prev.returnDate
                }));
              }}
              min={todayStr}
              max={searchData.returnDate}
            />
          </Col>
          <Col md={3}>
            <BaseInput 
              label="Ngày trả" 
              icon={Calendar} 
              type="date"
              value={searchData.returnDate}
              onChange={(e) => setSearchData({...searchData, returnDate: e.target.value})}
              min={searchData.pickupDate || todayStr}
            />
          </Col>
          <Col md={2}>
            <BaseButton type="submit" isCTA className="w-100 py-3">
              Tìm kiếm
            </BaseButton>
          </Col>
        </Row>
      </form>
    </Card>
  );
};

export default VehicleSearchForm;
