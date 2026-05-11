import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { Users, Search, UserPlus, RefreshCcw } from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout.jsx';
import { GetUsers } from '../../../core/use-cases/GetUsers.js';
import { UserRepository } from '../../../data/repositories/UserRepository.js';
import BaseModal from '../../../components/ui/BaseModal.jsx';

// Sub-components
import UserStats from '../components/UserStats.jsx';
import UserTable from '../components/UserTable.jsx';
import UserDetailModal from '../components/UserDetailModal.jsx';
import UserFormModal from '../components/UserFormModal.jsx';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [roleFilter, setRoleFilter] = useState('Tất cả vai trò');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal & Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const [showDetail, setShowDetail] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addError, setAddError] = useState('');
  const [pendingUserData, setPendingUserData] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({ title: '', message: '', type: 'confirm', onConfirm: () => {} });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await GetUsers();
      setUsers(data || []);
    } catch (error) {
      setError('Không thể tải danh sách người dùng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // Actions
  const handleToggleStatus = (user) => {
    const action = user.enabled ? 'khóa' : 'mở khóa';
    setConfirmConfig({
      title: 'Xác nhận thay đổi',
      message: `Bạn có chắc chắn muốn ${action} tài khoản của ${user.fullName || user.username}?`,
      type: user.enabled ? 'danger' : 'confirm',
      onConfirm: async () => {
        setActionLoading(true);
        try {
          user.enabled ? await UserRepository.disableUser(user.userId) : await UserRepository.enableUser(user.userId);
          await fetchUsers();
          setShowConfirm(false);
        } catch (error) { alert('Thao tác thất bại.'); } finally { setActionLoading(false); }
      }
    });
    setShowConfirm(true);
  };

  const handleDeleteUser = (user) => {
    setConfirmConfig({
      title: 'Xóa người dùng vĩnh viễn',
      message: `CẢNH BÁO: Bạn có chắc chắn muốn xóa tài khoản của ${user.fullName || user.username}? Hành động này không thể hoàn tác.`,
      type: 'danger',
      onConfirm: async () => {
        setActionLoading(true);
        try {
          await UserRepository.deleteUser(user.userId);
          await fetchUsers();
          setShowConfirm(false);
        } catch (error) { alert('Xóa thất bại.'); } finally { setActionLoading(false); }
      }
    });
    setShowConfirm(true);
  };

  const handleViewDetail = (user) => { setSelectedUser(user); setShowDetail(true); };

  const handleCreateUserRequest = (formData) => {
    setPendingUserData(formData);
    setAddError('');
    setConfirmConfig({
      title: 'Xác nhận tạo tài khoản',
      message: `Bạn có chắc chắn muốn khởi tạo tài khoản cho ${formData.fullName} với vai trò ${formData.role}?`,
      type: 'confirm',
      confirmLabel: 'Xác nhận',
      onConfirm: async () => {
        setActionLoading(true);
        try {
          await UserRepository.createUser(formData);
          await fetchUsers();
          setShowAddModal(false);
          setShowConfirm(false);
        } catch (error) {
          const msg = error.response?.data?.error || error.response?.data?.message || 'Lỗi khi tạo tài khoản.';
          setAddError(msg);
          setShowConfirm(false);
        } finally {
          setActionLoading(false);
        }
      }
    });
    setShowConfirm(true);
  };

  // Filter & Search Logic
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const roleMap = { 'Quản trị viên': 'ADMIN', 'Nhân viên': 'STAFF', 'Khách hàng': 'CUSTOMER' };
      const matchesRole = roleFilter === 'Tất cả vai trò' || user.userType === roleMap[roleFilter];
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = (user.fullName?.toLowerCase() || '').includes(searchLower) || 
                            (user.email?.toLowerCase() || '').includes(searchLower) ||
                            (user.username?.toLowerCase() || '').includes(searchLower);
      return matchesRole && matchesSearch;
    });
  }, [users, roleFilter, searchTerm]);

  const currentData = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <DashboardLayout>
      <div className="p-4 p-lg-5" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 mb-5">
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="bg-primary p-2 rounded-3 text-white shadow-sm"><Users size={20} /></div>
                <span className="text-muted fw-bold text-uppercase small" style={{ letterSpacing: '1px' }}>Hệ thống quản trị</span>
              </div>
              <h1 className="fw-black m-0" style={{ color: '#001e40', fontSize: '2.5rem', letterSpacing: '-1.5px' }}>Người dùng</h1>
            </div>
            <div className="d-flex gap-2">
              <Button variant="white" className="border shadow-sm rounded-3 p-2.5 hover-bg-light transition-all" onClick={fetchUsers}><RefreshCcw size={20} className={loading ? 'spin-animation' : ''} /></Button>
              <Button 
                className="bg-primary hover-bg-dark border-0 px-4 py-2.5 rounded-3 d-flex align-items-center gap-2 shadow-sm transition-all active-scale-95"
                onClick={() => { setAddError(''); setShowAddModal(true); }}
              >
                <UserPlus size={20} /> <span className="fw-bold">Thêm người dùng</span>
              </Button>
            </div>
          </div>

          <UserStats users={users} />

          <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white mb-4">
            <div className="p-4 border-bottom bg-light bg-opacity-30 d-flex flex-column flex-md-row justify-content-between gap-3">
              <div className="position-relative flex-grow-1" style={{ maxWidth: '400px' }}>
                <Search size={18} className="position-absolute top-50 translate-middle-y ms-3 text-muted" />
                <Form.Control 
                  className="ps-5 border rounded-3 py-2.5 shadow-none border-light" 
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
              </div>
              <Form.Select 
                className="border rounded-3 fw-bold text-dark px-3 py-2 shadow-none cursor-pointer border-light"
                style={{ width: 'auto', minWidth: '160px' }}
                value={roleFilter}
                onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
              >
                <option>Tất cả vai trò</option>
                <option>Quản trị viên</option>
                <option>Nhân viên</option>
                <option>Khách hàng</option>
              </Form.Select>
            </div>
            
            <UserTable 
              users={currentData}
              loading={loading}
              error={error}
              onView={handleViewDetail}
              onEdit={(u) => console.log('Edit', u)}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDeleteUser}
              currentPage={currentPage}
              totalPages={Math.ceil(filteredUsers.length / pageSize)}
              onPageChange={setCurrentPage}
              totalResults={filteredUsers.length}
              onRetry={fetchUsers}
            />
          </Card>
        </div>
      </div>

      <UserDetailModal show={showDetail} onHide={() => setShowDetail(false)} user={selectedUser} />

      <UserFormModal 
        show={showAddModal} 
        onHide={() => setShowAddModal(false)} 
        onSubmit={handleCreateUserRequest}
        loading={actionLoading}
        error={addError}
      />

      <BaseModal 
        show={showConfirm}
        onHide={() => !actionLoading && setShowConfirm(false)}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        type={confirmConfig.type}
        confirmLabel={confirmConfig.confirmLabel || 'Xác nhận'}
        loading={actionLoading}
      />
    </DashboardLayout>
  );
};

export default UserManagement;
