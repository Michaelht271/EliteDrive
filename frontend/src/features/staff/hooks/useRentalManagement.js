import { useState, useEffect, useCallback } from 'react';
import { RentalRepository as RentalRepo } from '../../../data/repositories/RentalRepository.js';
import { useAuth } from '../../../context/AuthContext.jsx';

export const useRentalManagement = () => {
  const { user } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [totalElements, setTotalElements] = useState(0);
  const [filters, setFilters] = useState({ status: '', keyword: '' });
  const [pageable, setPageable] = useState({ page: 0, size: 10 });

  // Modal State for Confirmation (Status Update)
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({ id: null, status: '', title: '', message: '', type: 'confirm', showInput: false });
  const [cancelReason, setCancelReason] = useState('');

  // Detail Modal State
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  const [fetchingDetail, setFetchingDetail] = useState(false);

  const fetchRentals = useCallback(async () => {
    setLoading(true);
    try {
      const data = await RentalRepo.getAllRentals({ ...filters, ...pageable });
      setRentals(data.content || []);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      console.error('Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, pageable]);

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  const handleStatusUpdate = (id, newStatus) => {
    let config = { 
      id, 
      status: newStatus, 
      title: 'Xác nhận trạng thái', 
      message: `Bạn có chắc chắn muốn chuyển sang trạng thái ${newStatus}?`,
      type: 'confirm',
      showInput: false
    };

    if (newStatus === 'CONFIRMED') {
      config.title = 'Phê duyệt đơn thuê';
      config.message = 'Xác nhận phê duyệt đơn đặt xe này và thông báo cho khách hàng?';
      config.type = 'success';
    } else if (newStatus === 'RENTING') {
      config.title = 'Bắt đầu chuyến đi';
      config.message = 'Xác nhận đã giao xe cho khách hàng và bắt đầu tính thời gian thuê?';
      config.type = 'info';
    } else if (newStatus === 'COMPLETED') {
      config.title = 'Hoàn thành đơn thuê';
      config.message = 'Xác nhận đã nhận lại xe và khách hàng đã thanh toán đầy đủ?';
      config.type = 'success';
    } else if (newStatus === 'CANCELLED') {
      config.title = 'Từ chối / Hủy đơn';
      config.message = 'Vui lòng cung cấp lý do từ chối hoặc hủy đơn thuê này.';
      config.type = 'danger';
      config.showInput = true;
    }

    setModalConfig(config);
    setCancelReason('');
    setShowModal(true);
  };

  const confirmStatusUpdate = async () => {
    const { id, status } = modalConfig;
    setActionId(id);
    try {
      await RentalRepo.updateRentalStatus(id, status, status === 'CANCELLED' ? { cancelReason } : {});
      setShowModal(false);
      setTimeout(() => {
        fetchRentals();
        setActionId(null);
      }, 500);
    } catch (error) {
      alert(`THẤT BẠI: ${error.response?.data?.message || error.message}`);
      setActionId(null);
    }
  };

  const handleViewDetail = async (id) => {
    setFetchingDetail(true);
    setActionId(id);
    try {
      const data = await RentalRepo.getStaffRentalDetail(id);
      setSelectedRental(data);
      setShowDetailModal(true);
    } catch (error) {
      alert("Không thể lấy thông tin chi tiết đơn thuê.");
    } finally {
      setFetchingDetail(false);
      setActionId(null);
    }
  };

  const handlePageChange = (newPage) => {
    setPageable(prev => ({ ...prev, page: newPage }));
  };

  return {
    user,
    rentals,
    loading,
    actionId,
    totalElements,
    filters,
    setFilters,
    pageable,
    showModal,
    setShowModal,
    modalConfig,
    cancelReason,
    setCancelReason,
    showDetailModal,
    setShowDetailModal,
    selectedRental,
    fetchingDetail,
    fetchRentals,
    handleStatusUpdate,
    confirmStatusUpdate,
    handleViewDetail,
    handlePageChange
  };
};
