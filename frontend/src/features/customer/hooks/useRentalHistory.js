import { useState, useEffect, useCallback } from 'react';
import { RentalRepository } from '../../../data/repositories/RentalRepository.js';

export const useRentalHistory = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(0);

  const fetchRentals = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: page,
        size: 10, // Tăng size để xem được nhiều hơn
      };
      
      // Chỉ thêm status vào params nếu không phải là 'ALL'
      if (statusFilter !== 'ALL') {
        params.status = statusFilter;
      }

      const data = await RentalRepository.getMyRentals(params);
      setRentals(data.content || []);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      console.error('Failed to fetch rentals:', error);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  const handleStatusChange = (newStatus) => {
    setStatusFilter(newStatus);
    setPage(0);
  };

  return {
    rentals,
    loading,
    totalElements,
    statusFilter,
    page,
    setPage,
    handleStatusChange,
    refresh: fetchRentals
  };
};
