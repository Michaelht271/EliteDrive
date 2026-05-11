import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, Form, Button, Spinner } from 'react-bootstrap';
import { Car, Search, Plus, RefreshCcw } from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout.jsx';
import { GetVehicles } from '../../../core/use-cases/GetVehicles.js';
import { VehicleRepository } from '../../../data/repositories/VehicleRepository.js';
import BaseModal from '../../../components/ui/BaseModal.jsx';

// Sub-components
import CarStats from '../components/CarStats.jsx';
import CarTable from '../components/CarTable.jsx';
import CarFormModal from '../components/CarFormModal.jsx';

const CarManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả trạng thái');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modals
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({ title: '', message: '', type: 'confirm', onConfirm: () => {} });

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      // Lấy toàn bộ xe cho Admin (có thể cần API riêng nếu muốn lấy cả xe đã xóa hoặc ẩn)
      const data = await GetVehicles({}, { page: 0, size: 100, sort: 'createdDate,desc' });
      setVehicles(data.content || []);
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchVehicles(); }, [fetchVehicles]);

  // CRUD Handlers
  const handleCreateOrUpdate = async (formData) => {
    setActionLoading(true);
    try {
      if (editingVehicle) {
        await VehicleRepository.updateVehicle(editingVehicle.carId, formData);
      } else {
        await VehicleRepository.createVehicle(formData);
      }
      await fetchVehicles();
      setShowFormModal(false);
    } catch (error) {
      alert('Thao tác thất bại. Vui lòng kiểm tra lại dữ liệu.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRequest = (car) => {
    setConfirmConfig({
      title: 'Xác nhận xóa xe',
      message: `Bạn có chắc chắn muốn xóa xe ${car.carName} (BS: ${car.licensePlate}) khỏi hệ thống?`,
      type: 'danger',
      onConfirm: async () => {
        setActionLoading(true);
        try {
          await VehicleRepository.deleteVehicle(car.carId);
          await fetchVehicles();
          setShowConfirm(false);
        } catch (error) { alert('Không thể xóa xe này.'); } finally { setActionLoading(false); }
      }
    });
    setShowConfirm(true);
  };

  const handleEditClick = (car) => {
    setEditingVehicle(car);
    setShowFormModal(true);
  };

  const handleAddClick = () => {
    setEditingVehicle(null);
    setShowFormModal(true);
  };

  // Filter Logic
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const matchesStatus = statusFilter === 'Tất cả trạng thái' || v.carStatus === statusFilter;
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = v.carName.toLowerCase().includes(searchLower) || 
                            v.brand.toLowerCase().includes(searchLower) ||
                            v.licensePlate.toLowerCase().includes(searchLower);
      return matchesStatus && matchesSearch;
    });
  }, [vehicles, statusFilter, searchTerm]);

  const currentData = filteredVehicles.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <DashboardLayout>
      <div className="p-4 p-lg-5" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 mb-5">
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="bg-primary p-2 rounded-3 text-white shadow-sm"><Car size={20} /></div>
                <span className="text-muted fw-bold text-uppercase small" style={{ letterSpacing: '1px' }}>Quản trị đội xe</span>
              </div>
              <h1 className="fw-black m-0" style={{ color: '#001e40', fontSize: '2.5rem', letterSpacing: '-1.5px' }}>Đội xe</h1>
            </div>
            <div className="d-flex gap-2">
              <Button variant="white" className="border shadow-sm rounded-3 p-2.5 hover-bg-light transition-all" onClick={fetchVehicles}><RefreshCcw size={20} className={loading ? 'spin-animation' : ''} /></Button>
              <Button 
                className="bg-primary hover-bg-dark border-0 px-4 py-2.5 rounded-3 d-flex align-items-center gap-2 shadow-sm transition-all active-scale-95"
                onClick={handleAddClick}
              >
                <Plus size={20} /> <span className="fw-bold">Thêm xe mới</span>
              </Button>
            </div>
          </div>

          <CarStats vehicles={vehicles} />

          <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white mb-4">
            <div className="p-4 border-bottom bg-light bg-opacity-30 d-flex flex-column flex-md-row justify-content-between gap-3">
              <div className="position-relative flex-grow-1" style={{ maxWidth: '400px' }}>
                <Search size={18} className="position-absolute top-50 translate-middle-y ms-3 text-muted" />
                <Form.Control 
                  className="ps-5 border rounded-3 py-2.5 shadow-none border-light" 
                  placeholder="Tìm theo tên xe, thương hiệu, biển số..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
              </div>
              <Form.Select 
                className="border rounded-3 fw-bold text-dark px-3 py-2 shadow-none cursor-pointer border-light"
                style={{ width: 'auto', minWidth: '200px' }}
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              >
                <option>Tất cả trạng thái</option>
                <option value="AVAILABLE">SẴN SÀNG</option>
                <option value="MAINTENANCE">ĐANG BẢO TRÌ</option>
                <option value="UNAVAILABLE">BẬN / HẾT XE</option>
              </Form.Select>
            </div>
            
            <CarTable 
              vehicles={currentData}
              loading={loading}
              onView={(car) => window.open(`/cars/${car.carId}`, '_blank')}
              onEdit={handleEditClick}
              onDelete={handleDeleteRequest}
              currentPage={currentPage}
              totalPages={Math.ceil(filteredVehicles.length / pageSize)}
              onPageChange={setCurrentPage}
              totalResults={filteredVehicles.length}
            />
          </Card>
        </div>
      </div>

      <CarFormModal 
        show={showFormModal} 
        onHide={() => setShowFormModal(false)} 
        onSubmit={handleCreateOrUpdate}
        initialData={editingVehicle}
        loading={actionLoading}
      />

      <BaseModal 
        show={showConfirm}
        onHide={() => !actionLoading && setShowConfirm(false)}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        type={confirmConfig.type}
        loading={actionLoading}
      />
    </DashboardLayout>
  );
};

export default CarManagement;
