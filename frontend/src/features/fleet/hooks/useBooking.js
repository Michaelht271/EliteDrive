import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GetVehicleDetail } from '../../../core/use-cases/GetVehicleDetail.js';
import { CreateRental } from '../../../core/use-cases/CreateRental.js';
import { RentalRepository } from '../../../data/repositories/RentalRepository.js';

export const useBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const [startDate, setStartDate] = useState(tomorrow);
  const initialEndDate = new Date(tomorrow);
  initialEndDate.setDate(tomorrow.getDate() + 2);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [location, setLocation] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  
  const [showConfirm, setShowConfirm] = useState(false);
  const [bookedDates, setBookedDates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [detailData, unavailableDates] = await Promise.all([
          GetVehicleDetail(id),
          RentalRepository.getBookedDates(id)
        ]);
        setVehicle(detailData);
        
        const dates = unavailableDates.map(d => {
          const dt = new Date(d);
          dt.setHours(0, 0, 0, 0);
          return dt;
        });
        setBookedDates(dates);

        // Tự động tìm ngày trống đầu tiên nếu ngày mặc định bị trùng
        const isDateBooked = (date) => dates.some(d => d.getTime() === date.getTime());
        
        let availableStart = new Date(tomorrow);
        while (isDateBooked(availableStart)) {
          availableStart.setDate(availableStart.getDate() + 1);
        }
        setStartDate(availableStart);

        let availableEnd = new Date(availableStart);
        availableEnd.setDate(availableEnd.getDate() + 2);
        while (isDateBooked(availableEnd)) {
          availableEnd.setDate(availableEnd.getDate() + 1);
        }
        setEndDate(availableEnd);

      } catch (err) {
        setError('Không thể tải thông tin xe.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleStartDateChange = (date) => {
    if (!date) return;
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    setStartDate(normalizedDate);
    
    if (endDate <= normalizedDate) {
      const newEnd = new Date(normalizedDate);
      newEnd.setDate(normalizedDate.getDate() + 1);
      setEndDate(newEnd);
    }
  };

  const handleEndDateChange = (date) => {
    if (!date) return;
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    
    if (normalizedDate <= startDate) {
      alert('Ngày trả xe phải sau ngày nhận ít nhất 1 ngày.');
      return;
    }
    setEndDate(normalizedDate);
  };

  const duration = useMemo(() => {
    const diffTime = endDate - startDate;
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 1;
  }, [startDate, endDate]);

  const total = (vehicle?.pricePerDay || 0) * duration;
  const subtotal = Math.round(total / 1.1);
  const tax = total - subtotal;

  const handleBookingSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const startStr = startDate.toISOString().split('T')[0];
      const endStr = endDate.toISOString().split('T')[0];
      const finalNotes = `Địa điểm nhận: ${location || 'Văn phòng EliteDrive'}. Thanh toán: ${paymentMethod}`;
      
      await CreateRental(id, startStr, endStr, finalNotes);
      navigate('/customer/history', { state: { message: 'Đặt xe thành công!' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi đặt xe.');
      setShowConfirm(false);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    vehicle,
    loading,
    submitting,
    error,
    startDate,
    endDate,
    location,
    setLocation,
    duration,
    subtotal,
    tax,
    total,
    showConfirm,
    setShowConfirm,
    bookedDates,
    tomorrow,
    handleStartDateChange,
    handleEndDateChange,
    handleBookingSubmit,
    navigate
  };
};
