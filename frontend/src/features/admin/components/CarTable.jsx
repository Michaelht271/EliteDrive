import React from 'react';
import { Table, Button, Spinner, Pagination } from 'react-bootstrap';
import { Eye, Edit, Trash2, Search, Settings, Users, Fuel } from 'lucide-react';
import { CarStatusBadge, FuelBadge } from './CarBadges.jsx';

const CarTable = ({ 
  vehicles, 
  loading, 
  onView, 
  onEdit, 
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
  totalResults
}) => {
  
  const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&q=80&w=800';
    return url;
  };

  if (loading) return (
    <div className="text-center py-5">
      <Spinner animation="border" variant="primary" />
      <p className="mt-3 text-muted fw-medium">Đang tải danh sách đội xe...</p>
    </div>
  );

  return (
    <>
      <div className="table-responsive">
        <Table hover className="mb-0 align-middle">
          <thead>
            <tr className="bg-light bg-opacity-50">
              <th className="px-4 py-3 text-muted text-uppercase fw-black" style={{ fontSize: '10px', letterSpacing: '1px' }}>Thông tin xe</th>
              <th className="px-4 py-3 text-muted text-uppercase fw-black" style={{ fontSize: '10px', letterSpacing: '1px' }}>Thông số</th>
              <th className="px-4 py-3 text-muted text-uppercase fw-black" style={{ fontSize: '10px', letterSpacing: '1px' }}>Giá thuê</th>
              <th className="px-4 py-3 text-muted text-uppercase fw-black" style={{ fontSize: '10px', letterSpacing: '1px' }}>Trạng thái</th>
              <th className="px-4 py-3 text-muted text-uppercase fw-black text-end" style={{ fontSize: '10px', letterSpacing: '1px' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.length > 0 ? (
              vehicles.map((car) => (
                <tr key={car.carId} className="hover-bg-light transition-all">
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center gap-3">
                      <img 
                        src={getImageUrl(car.thumbnailUrl)} 
                        alt={car.carName} 
                        className="rounded-3 object-fit-cover shadow-sm" 
                        style={{ width: '64px', height: '40px' }}
                      />
                      <div>
                        <div className="fw-black text-dark" style={{ fontSize: '14px' }}>{car.carName}</div>
                        <div className="text-muted small fw-bold text-uppercase" style={{ fontSize: '10px' }}>{car.brand} • {car.licensePlate}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="d-flex gap-2">
                      <span className="d-flex align-items-center gap-1 text-muted small fw-bold"><Users size={12} /> {car.seats}</span>
                      <span className="d-flex align-items-center gap-1 text-muted small fw-bold"><Settings size={12} /> {car.transmission === 'AUTOMATIC' ? 'AT' : 'MT'}</span>
                      <FuelBadge type={car.fuelType} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="fw-black text-primary">{car.pricePerDay?.toLocaleString()} <span style={{ fontSize: '10px' }}>VND</span></div>
                  </td>
                  <td className="px-4 py-3">
                    <CarStatusBadge status={car.carStatus} />
                  </td>
                  <td className="px-4 py-3 text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <ActionButton icon={Eye} color="primary" onClick={() => onView(car)} title="Xem chi tiết" />
                      <ActionButton icon={Edit} color="success" onClick={() => onEdit(car)} title="Chỉnh sửa" />
                      <ActionButton icon={Trash2} color="danger" onClick={() => onDelete(car)} title="Xóa xe" />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-5">
                  <Search size={40} className="text-muted opacity-20 mb-3" />
                  <h6 className="text-muted">Không tìm thấy xe nào trong kho</h6>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="px-4 py-3 bg-light bg-opacity-30 border-top d-flex justify-content-between align-items-center">
          <span className="text-muted small fw-bold">Tổng cộng {totalResults} xe</span>
          <Pagination className="mb-0 custom-pagination small">
            <Pagination.Prev onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} />
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => onPageChange(i + 1)}>
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} />
          </Pagination>
        </div>
      )}
    </>
  );
};

const ActionButton = ({ icon: Icon, color, onClick, title }) => (
  <Button 
    variant="light" 
    className={`p-2 rounded-circle border-0 text-${color} bg-${color} bg-opacity-10 hover-bg-opacity-20 transition-all shadow-none`}
    onClick={onClick}
    title={title}
  >
    <Icon size={16} />
  </Button>
);

export default CarTable;
