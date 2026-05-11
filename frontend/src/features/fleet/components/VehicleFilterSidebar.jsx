import React, { useState, useEffect } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { Shield, MessageSquare, Users, Check } from 'lucide-react';

const VehicleFilterSidebar = ({ onFilterChange, initialFilters }) => {
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState(null);
  const [priceRange, setPriceRange] = useState(5000000);
  const [dates, setDates] = useState({
    startDate: initialFilters?.startDate || '',
    endDate: initialFilters?.endDate || ''
  });

  useEffect(() => {
    if (initialFilters) {
      setDates(prev => {
        if (prev.startDate === initialFilters.startDate && prev.endDate === initialFilters.endDate) {
          return prev;
        }
        return {
          startDate: initialFilters.startDate || '',
          endDate: initialFilters.endDate || ''
        };
      });
    }
  }, [initialFilters?.startDate, initialFilters?.endDate]);

  const brands = ['Toyota', 'Honda', 'VinFast', 'Hyundai', 'Ford', 'Mercedes', 'BMW', 'Audi'];
  const seatOptions = [4, 5, 7];

  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
  };

  const handleSeatToggle = (seats) => {
    setSelectedSeats(prev => prev === seats ? null : seats);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDates(prev => {
      const newDates = { ...prev, [name]: value };
      if (name === 'startDate' && prev.endDate && value > prev.endDate) {
        newDates.endDate = '';
      }
      if (name === 'endDate' && prev.startDate && value < prev.startDate) {
        newDates.startDate = '';
      }
      return newDates;
    });
  };

  const handleReset = () => {
    setSelectedBrands([]);
    setSelectedSeats(null);
    setPriceRange(5000000);
    setDates({ startDate: '', endDate: '' });
  };

  useEffect(() => {
    const filters = {
      brand: selectedBrands.length > 0 ? selectedBrands.join(',') : undefined,
      seats: selectedSeats || undefined,
      maxPrice: priceRange,
      startDate: dates.startDate || undefined,
      endDate: dates.endDate || undefined
    };
    onFilterChange(filters);
  }, [selectedBrands, selectedSeats, priceRange, dates.startDate, dates.endDate]);

  return (
    <aside className="d-flex flex-column gap-4">
      <Card className="border-0 shadow-sm p-4" style={{ borderRadius: '20px' }}>
        <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
          <h3 className="h5 fw-black mb-0 text-primary">Bộ lọc tìm kiếm</h3>
          <Button 
            variant="link" 
            className="text-muted p-0 label-sm fw-bold text-decoration-none hover-text-primary"
            onClick={handleReset}
          >
            Xóa hết
          </Button>
        </div>

        {/* Lọc theo ngày thuê */}
        <div className="mb-4">
          <span className="label-sm fw-black text-dark text-uppercase tracking-wider d-block mb-3" style={{ fontSize: '11px' }}>Thời gian chuyến đi</span>
          <div className="d-flex flex-column gap-3">
            <Form.Group>
              <Form.Label className="small fw-bold text-muted mb-2">Ngày nhận xe</Form.Label>
              <Form.Control 
                type="date" 
                name="startDate"
                className="rounded-3 border-light bg-light bg-opacity-50 small fw-bold py-2 shadow-none"
                value={dates.startDate}
                onChange={handleDateChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="small fw-bold text-muted mb-2">Ngày trả xe</Form.Label>
              <Form.Control 
                type="date" 
                name="endDate"
                className="rounded-3 border-light bg-light bg-opacity-50 small fw-bold py-2 shadow-none"
                value={dates.endDate}
                onChange={handleDateChange}
                min={dates.startDate || new Date().toISOString().split('T')[0]}
              />
            </Form.Group>
          </div>
        </div>

        {/* Số ghế */}
        <div className="mb-4 py-3 border-top">
          <span className="label-sm fw-black text-dark text-uppercase tracking-wider d-block mb-3" style={{ fontSize: '11px' }}>Sức chứa (Số ghế)</span>
          <div className="d-flex flex-wrap gap-2">
            {seatOptions.map(seats => (
              <button 
                key={seats} 
                className={`btn border-0 rounded-pill px-3 py-2 transition-all d-flex align-items-center gap-2 fw-bold ${selectedSeats === seats ? 'bg-primary text-white shadow-md' : 'bg-light text-muted hover-bg-primary hover-bg-opacity-10'}`}
                onClick={() => handleSeatToggle(seats)}
                style={{ fontSize: '12px' }}
              >
                <Users size={14} />
                {seats} chỗ
              </button>
            ))}
          </div>
        </div>

        {/* Khoảng giá */}
        <div className="mb-4 py-3 border-top">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="label-sm fw-black text-dark text-uppercase tracking-wider" style={{ fontSize: '11px' }}>Giá tối đa / ngày</span>
            <span className="fw-black text-primary small">{priceRange.toLocaleString()}đ</span>
          </div>
          <input 
            type="range" 
            className="form-range custom-range" 
            min="500000" 
            max="10000000" 
            step="100000" 
            value={priceRange}
            onChange={(e) => setPriceRange(parseInt(e.target.value))}
          />
          <div className="d-flex justify-content-between mt-1">
            <span className="text-muted fw-bold" style={{ fontSize: '10px' }}>500K</span>
            <span className="text-muted fw-bold" style={{ fontSize: '10px' }}>10M+</span>
          </div>
        </div>

        {/* Thương hiệu */}
        <div className="mb-2 py-3 border-top">
          <span className="label-sm fw-black text-dark text-uppercase tracking-wider d-block mb-3" style={{ fontSize: '11px' }}>Thương hiệu xe</span>
          <div className="d-flex flex-wrap gap-2">
            {brands.map(brand => (
              <button 
                key={brand} 
                className={`btn btn-sm rounded-pill px-3 py-1.5 border transition-all fw-bold d-flex align-items-center gap-1 ${selectedBrands.includes(brand) ? 'bg-primary border-primary text-white' : 'bg-white text-muted border-light hover-border-primary'}`}
                onClick={() => handleBrandToggle(brand)}
                style={{ fontSize: '11px' }}
              >
                {selectedBrands.includes(brand) && <Check size={12} />}
                {brand}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Hỗ trợ Section - Đã sửa lỗi tương phản: Nền trắng, viền xanh nhạt */}
      <div className="p-4 rounded-4 border border-primary border-opacity-20 bg-white shadow-sm position-relative overflow-hidden">
        <div className="position-relative z-1 d-flex flex-column align-items-center text-center">
          <div className="bg-primary bg-opacity-10 p-2 rounded-circle mb-3">
            <MessageSquare size={24} className="text-primary" />
          </div>
          <h4 className="h6 fw-black mb-2 text-primary">Cần hỗ trợ tìm xe?</h4>
          <p className="mb-3 text-dark fw-medium" style={{ fontSize: '12px', lineHeight: '1.6' }}>
            Đội ngũ chuyên viên của EliteDrive luôn sẵn sàng giúp bạn chọn mẫu xe ưng ý nhất.
          </p>
          <Button 
            variant="primary" 
            className="w-100 py-2 fw-black rounded-pill shadow-sm border-0" 
            style={{ fontSize: '11px', letterSpacing: '0.5px' }}
          >
            LIÊN HỆ NGAY
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default VehicleFilterSidebar;
