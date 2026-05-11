import React from 'react';
import { Table, Button, Spinner, Dropdown, Pagination } from 'react-bootstrap';
import { Eye, Edit, Lock, Unlock, Trash2, MoreVertical, Search } from 'lucide-react';
import { StatusBadge, RoleBadge } from './UserBadges.jsx';

const UserTable = ({ 
  users, 
  loading, 
  onView, 
  onEdit, 
  onToggleStatus, 
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
  totalResults
}) => {
  if (loading) return (
    <div className="text-center py-5">
      <Spinner animation="border" variant="primary" />
      <p className="mt-3 text-muted fw-medium">Đang đồng bộ dữ liệu...</p>
    </div>
  );

  return (
    <>
      <div className="table-responsive">
        <Table hover className="mb-0 align-middle">
          <thead>
            <tr className="bg-light bg-opacity-50">
              <th className="px-4 py-3 text-muted text-uppercase fw-black" style={{ fontSize: '10px', letterSpacing: '1px' }}>Thông tin người dùng</th>
              <th className="px-4 py-3 text-muted text-uppercase fw-black" style={{ fontSize: '10px', letterSpacing: '1px' }}>Liên hệ</th>
              <th className="px-4 py-3 text-muted text-uppercase fw-black" style={{ fontSize: '10px', letterSpacing: '1px' }}>Vai trò</th>
              <th className="px-4 py-3 text-muted text-uppercase fw-black" style={{ fontSize: '10px', letterSpacing: '1px' }}>Trạng thái</th>
              <th className="px-4 py-3 text-muted text-uppercase fw-black text-end" style={{ fontSize: '10px', letterSpacing: '1px' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.userId || user.username} className="hover-bg-light transition-all cursor-default">
                  <td className="px-4 py-4">
                    <div className="d-flex align-items-center gap-3">
                      <div className="position-relative">
                        <img 
                          src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.fullName || user.username}&background=001e40&color=fff&bold=true`} 
                          alt={user.fullName} 
                          className="rounded-circle object-fit-cover shadow-sm border border-2 border-white" 
                          style={{ width: '48px', height: '48px' }}
                        />
                        {user.enabled && <div className="position-absolute bottom-0 end-0 bg-success rounded-circle border border-2 border-white" style={{ width: '12px', height: '12px' }}></div>}
                      </div>
                      <div>
                        <div className="fw-black text-dark" style={{ fontSize: '15px' }}>{user.fullName || user.username}</div>
                        <div className="text-muted small fw-medium">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="d-flex flex-column">
                      <span className="text-primary fw-bold small">{user.email}</span>
                      <span className="text-muted small">{user.phoneNumber || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <RoleBadge type={user.userType} />
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge enabled={user.enabled} />
                  </td>
                  <td className="px-4 py-4 text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <ActionButton icon={Eye} color="primary" onClick={() => onView(user)} title="Xem chi tiết" />
                      <ActionButton icon={Edit} color="success" onClick={() => onEdit(user)} title="Chỉnh sửa" />
                      <ActionButton 
                        icon={user.enabled ? Lock : Unlock} 
                        color={user.enabled ? "warning" : "info"} 
                        onClick={() => onToggleStatus(user)} 
                        title={user.enabled ? "Khóa" : "Mở khóa"} 
                      />
                      <ActionButton icon={Trash2} color="danger" onClick={() => onDelete(user)} title="Xóa" />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-5">
                  <div className="py-4 text-muted">
                    <Search size={40} className="mb-3 opacity-20" />
                    <h5>Không tìm thấy kết quả</h5>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="px-4 py-4 bg-light bg-opacity-30 border-top d-flex justify-content-between align-items-center">
          <span className="text-muted small fw-bold text-uppercase">Trang {currentPage} / {totalPages} — {totalResults} kết quả</span>
          <Pagination className="mb-0 custom-pagination">
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
    <Icon size={18} />
  </Button>
);

export default UserTable;
