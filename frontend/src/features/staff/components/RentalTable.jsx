import React from 'react';
import { Table, Button, Spinner, Dropdown } from 'react-bootstrap';
import { Car, Clock, Eye, MoreVertical, XCircle } from 'lucide-react';
import RentalBadge from './RentalBadge.jsx';

const RentalTable = ({ 
  user,
  rentals, 
  loading, 
  actionId, 
  fetchingDetail, 
  onStatusUpdate, 
  onViewDetail,
  modalStatus // Để kiểm tra spinner trên đúng nút đang xử lý
}) => {
  const roles = (user?.authorities || []).map(auth => 
    typeof auth === 'string' ? auth : auth.authority
  );
  const isStaff = roles.includes('ROLE_STAFF');
  const isAdmin = roles.includes('ROLE_ADMIN');

  // Admin chỉ được xem, không được update
  const canUpdateStatus = isStaff && !isAdmin;

  return (
    <div className="table-responsive">
      <Table className="align-middle mb-0">
        <thead className="bg-light text-muted small fw-black uppercase border-bottom" style={{ letterSpacing: '0.5px' }}>
          <tr>
            <th className="px-4 py-3 border-0 d-none d-md-table-cell" style={{ width: '10%' }}>ID</th>
            <th className="py-3 border-0" style={{ width: '20%' }}>Khách hàng</th>
            <th className="py-3 border-0" style={{ width: '20%' }}>Phương tiện</th>
            <th className="py-3 border-0 d-none d-lg-table-cell" style={{ width: '15%' }}>Lịch trình</th>
            <th className="py-3 border-0 text-end d-none d-sm-table-cell" style={{ width: '12%' }}>Tổng tiền</th>
            <th className="py-3 border-0 text-center" style={{ width: '10%' }}>Trạng thái</th>
            <th className="px-4 py-3 border-0 text-end" style={{ width: '13%' }}>Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {loading && rentals.length === 0 ? (
            <tr><td colSpan="7" className="text-center py-5"><Spinner animation="border" variant="primary" /></td></tr>
          ) : rentals.length === 0 ? (
            <tr><td colSpan="7" className="text-center py-5 text-muted fw-bold">Không tìm thấy đơn thuê nào.</td></tr>
          ) : rentals.map((rental) => {
            const s = String(rental.status || '').toUpperCase();
            
            return (
              <tr key={rental.rentalId} className="hover-bg-light transition-all border-bottom border-light">
                <td className="px-4 py-4 fw-bold text-primary small d-none d-md-table-cell">#{String(rental.rentalId).substring(0, 5)}</td>
                <td className="py-4">
                  <div className="d-flex align-items-center gap-2 gap-md-3">
                    <div className="rounded-circle d-none d-sm-flex align-items-center justify-content-center text-white fw-bold small shadow-sm flex-shrink-0" style={{ width: '32px', height: '32px', backgroundColor: '#fd8b00', fontSize: '12px' }}>
                      {rental.customerName?.charAt(0)}
                    </div>
                    <div className="text-truncate" style={{ maxWidth: '120px' }}>
                      <div className="small fw-black text-dark text-truncate">{rental.customerName}</div>
                      <div className="text-muted d-none d-md-block" style={{ fontSize: '10px' }}>Customer Account</div>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <div className="d-flex align-items-center gap-2">
                    <div className="bg-light rounded p-2 d-none d-xl-block">
                      <Car size={16} className="text-primary" />
                    </div>
                    <div className="text-truncate" style={{ maxWidth: '140px' }}>
                      <div className="small fw-bold text-dark text-truncate">{rental.carName}</div>
                      <div className="text-muted d-sm-none" style={{ fontSize: '10px' }}>
                        {rental.totalPrice?.toLocaleString()} đ
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 d-none d-lg-table-cell">
                  <div className="small fw-bold text-dark">
                    {new Date(rental.startDate).toLocaleDateString('vi-VN')}
                  </div>
                  <div className="text-muted d-flex align-items-center gap-1" style={{ fontSize: '10px' }}>
                    <Clock size={10} /> 3 Days
                  </div>
                </td>
                <td className="py-4 text-end fw-black text-primary d-none d-sm-table-cell">
                  {rental.totalPrice?.toLocaleString()} <span style={{ fontSize: '9px' }}>đ</span>
                </td>
                <td className="py-4">
                  <div className="d-flex justify-content-center"><RentalBadge status={rental.status} /></div>
                </td>
                <td className="px-4 py-4 text-end">
                  <div className="d-flex justify-content-end align-items-center gap-1 gap-md-2">
                    {canUpdateStatus && s === 'PENDING' && (
                      <div className="d-flex gap-1">
                        <Button variant="success" 
                          className="rounded-3 px-2 py-1 fw-black border-0 shadow-sm transition-all"
                          style={{ backgroundColor: '#22c55e', fontSize: '9px' }}
                          onClick={() => onStatusUpdate(rental.rentalId, 'CONFIRMED')}
                          disabled={actionId !== null}>
                          {actionId === rental.rentalId && modalStatus === 'CONFIRMED' ?
                            <Spinner animation="border" size="sm" /> : 'DUYỆT'}
                        </Button>
                        <Button variant="danger"
                          className="rounded-3 px-2 py-1 fw-black border-0 shadow-sm transition-all d-none d-md-block"
                          style={{ backgroundColor: '#ef4444', fontSize: '9px' }}
                          onClick={() => onStatusUpdate(rental.rentalId, 'CANCELLED')}
                          disabled={actionId !== null}>
                          {actionId === rental.rentalId && modalStatus === 'CANCELLED' ?
                            <Spinner animation="border" size="sm" /> : 'HUỶ'}
                        </Button>
                      </div>
                    )}
                    {canUpdateStatus && s === 'CONFIRMED' && (
                      <Button variant="warning"
                        className="rounded-3 px-2 py-1 fw-black border-0 shadow-sm text-white transition-all"
                        style={{ backgroundColor: '#f59e0b', fontSize: '9px' }}
                        onClick={() => onStatusUpdate(rental.rentalId, 'RENTING')}
                        disabled={actionId !== null}>
                        {actionId === rental.rentalId && modalStatus === 'RENTING' ?
                          <Spinner animation="border" size="sm" /> : 'GIAO'}
                      </Button>
                    )}
                    {canUpdateStatus && s === 'RENTING' && (
                      <Button variant="success"
                        className="rounded-3 px-2 py-1 fw-black border-0 shadow-sm transition-all"
                        style={{ backgroundColor: '#10b981', fontSize: '9px' }}
                        onClick={() => onStatusUpdate(rental.rentalId, 'COMPLETED')}
                        disabled={actionId !== null}>
                        {actionId === rental.rentalId && modalStatus === 'COMPLETED' ?
                          <Spinner animation="border" size="sm" /> : 'TRẢ'}
                      </Button>
                    )}
                    <Button 
                      variant="light" 
                      className="p-1 p-md-2 border-0 shadow-none rounded-circle transition-all hover-bg-primary hover-text-white"
                      onClick={() => onViewDetail(rental.rentalId)}
                      disabled={actionId !== null}
                    >
                      {fetchingDetail && actionId === rental.rentalId ? <Spinner animation="border" size="sm" /> : <Eye size={16} />}
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default RentalTable;
