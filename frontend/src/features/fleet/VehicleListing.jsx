import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Pagination, Spinner, Form, InputGroup } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import Header from '../../components/layout/Header.jsx';
import PublicFooter from '../../components/layout/PublicFooter.jsx';
import VehicleFilterSidebar from './components/VehicleFilterSidebar.jsx';
import VehicleListingCard from './components/VehicleListingCard.jsx';
import BaseSelect from '../../components/ui/BaseSelect.jsx';
import { GetVehicles } from '../../core/use-cases/GetVehicles.js';

const VehicleListing = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  // Trích xuất các tham số từ URL
  const initialKeyword = queryParams.get('keyword') || '';
  const initialStartDate = queryParams.get('pickup') || '';
  const initialEndDate = queryParams.get('return') || '';

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Khởi tạo bộ lọc từ URL
  const [filters, setFilters] = useState({
    keyword: initialKeyword,
    startDate: initialStartDate,
    endDate: initialEndDate
  });

  const [pageable, setPageable] = useState({
    page: 0,
    size: 9,
    sort: 'pricePerDay,asc'
  });

  // Cập nhật bộ lọc khi URL thay đổi (người dùng nhấn tìm kiếm mới từ Landing Page)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setFilters(prev => ({ 
      ...prev, 
      keyword: params.get('keyword') || '',
      startDate: params.get('pickup') || '',
      endDate: params.get('return') || ''
    }));
    setPageable(prev => ({ ...prev, page: 0 }));
  }, [location.search]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPageable(prev => ({ ...prev, page: 0 }));
  }, []);

  const handleKeywordChange = (e) => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, keyword: value }));
    setPageable(prev => ({ ...prev, page: 0 }));
  };

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await GetVehicles(filters, pageable);
      setVehicles(data.content || []);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, pageable]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Tự động đóng bộ lọc mobile khi màn hình lớn lên
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setShowMobileFilters(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePageChange = (newPage) => {
    setPageable(prev => ({ ...prev, page: newPage }));
  };

  const totalPages = Math.ceil(totalElements / pageable.size);

  return (
    <div className="bg-surface min-vh-100 d-flex flex-column">
      <Header />
      
      <main className="flex-grow-1 py-5">
        <Container fluid="xl">
          {/* Mobile Filter Toggle */}
          <div className="d-lg-none mb-4">
            <button 
              className="btn btn-white border w-100 py-2.5 d-flex align-items-center justify-content-center gap-2 rounded-3 shadow-sm fw-bold bg-white"
              onClick={() => setShowMobileFilters(true)}
            >
              <Filter size={18} /> Lọc và Sắp xếp
            </button>
          </div>

          <Row className="g-4">
            {/* Overlay for mobile filter */}
            {showMobileFilters && (
              <div 
                className="sidebar-overlay d-lg-none" 
                style={{ zIndex: 199, display: 'block', opacity: 1 }} 
                onClick={() => setShowMobileFilters(false)} 
              />
            )}

            {/* Left Sidebar */}
            <Col 
              lg={4} 
              xl={3} 
              className={`${showMobileFilters ? 'd-block' : 'd-none'} d-lg-block ${showMobileFilters ? 'position-fixed top-0 start-0 h-100 z-200 p-4 bg-white overflow-y-auto shadow-lg' : ''}`}
              style={showMobileFilters ? { width: '320px', transition: 'all 0.3s ease' } : {}}
            >

              {showMobileFilters && (
                <div className="d-lg-none d-flex justify-content-between align-items-center mb-4">

                  <button className="btn btn-link text-dark p-0" onClick={() => setShowMobileFilters(false)}>
                    <X size={24} />
                  </button>
                </div>
              )}
              <VehicleFilterSidebar 
                key={location.search}
                onFilterChange={(newFilters) => {
                  handleFilterChange(newFilters);
                  setShowMobileFilters(false);
                }} 
                initialFilters={{
                  startDate: initialStartDate,
                  endDate: initialEndDate
                }}
              />
            </Col>

            {/* Main Content Area */}
            <Col lg={8} xl={9}>
              {/* Toolbar */}
              <div className="d-flex flex-column gap-4 mb-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                  <div>
                    <h1 className="h2 fw-bold mb-1" style={{ color: '#0f172a' }}>Đội xe hiện có</h1>
                    <p className="body-md text-muted mb-0">Hiển thị {vehicles.length} trên {totalElements} xe</p>
                  </div>
                  
                  <div className="d-flex align-items-center gap-3">
                    <InputGroup className="shadow-sm rounded-3 overflow-hidden border-0" style={{ width: '300px' }}>
                      <InputGroup.Text className="bg-white border-0 pe-0">
                        <Search size={18} className="text-muted" />
                      </InputGroup.Text>
                      <Form.Control
                        placeholder="Tìm theo tên hoặc model..."
                        className="border-0 py-2 shadow-none"
                        value={filters.keyword}
                        onChange={handleKeywordChange}
                      />
                    </InputGroup>

                    <BaseSelect 
                      label="Sắp xếp:"
                      value={pageable.sort}
                      onChange={(e) => setPageable(prev => ({ ...prev, sort: e.target.value }))}
                      options={[
                        { label: 'Giá: Thấp đến Cao', value: 'pricePerDay,asc' },
                        { label: 'Giá: Cao đến Thấp', value: 'pricePerDay,desc' },
                        { label: 'Xe mới nhất', value: 'createdDate,desc' }
                      ]}
                    />
                  </div>
                </div>
              </div>

              {/* Grid */}
              {loading ? (
                <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '400px' }}>
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : (
                <div className="fade-in">
                  <Row className="g-4">
                    {vehicles.length > 0 ? (
                      vehicles.map((car, idx) => (
                        <Col md={6} xl={4} key={car.carId} className="fade-in-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                          <VehicleListingCard vehicle={car} />
                        </Col>
                      ))
                    ) : (
                      <Col xs={12}>
                        <div className="text-center py-5 bg-white rounded-4 shadow-sm border border-light">
                          <div className="bg-light d-inline-flex p-4 rounded-circle mb-4">
                            <Search size={48} className="text-muted opacity-50" />
                          </div>
                          <h3 className="fw-black text-dark mb-2">Không tìm thấy xe nào</h3>
                          <p className="text-muted body-md mb-4 mx-auto" style={{ maxWidth: '400px' }}>
                            Chúng tôi không tìm thấy xe nào khớp với tiêu chí của bạn. Hãy thử thay đổi bộ lọc hoặc xóa hết để xem tất cả xe.
                          </p>
                          <Button 
                            variant="primary" 
                            className="rounded-pill px-4 fw-black shadow-sm"
                            onClick={() => window.location.reload()}
                          >
                            XEM TẤT CẢ XE
                          </Button>
                        </div>
                      </Col>
                    )}
                  </Row>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-5">
                      <Pagination className="custom-pagination">
                        <Pagination.Prev 
                          onClick={() => handlePageChange(pageable.page - 1)} 
                          disabled={pageable.page === 0} 
                        />
                        {[...Array(totalPages)].map((_, idx) => (
                          <Pagination.Item 
                            key={idx} 
                            active={idx === pageable.page}
                            onClick={() => handlePageChange(idx)}
                          >
                            {idx + 1}
                          </Pagination.Item>
                        ))}
                        <Pagination.Next 
                          onClick={() => handlePageChange(pageable.page + 1)} 
                          disabled={pageable.page === totalPages - 1} 
                        />
                      </Pagination>
                    </div>
                  )}
                </div>

              )}
            </Col>
          </Row>
        </Container>
      </main>

      <PublicFooter />
    </div>
  );
};

export default VehicleListing;
