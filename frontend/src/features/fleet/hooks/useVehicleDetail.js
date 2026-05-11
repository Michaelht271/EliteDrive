import { useState, useEffect } from 'react';
import { GetVehicleDetail } from '../../../core/use-cases/GetVehicleDetail.js';
import { GetVehicles } from '../../../core/use-cases/GetVehicles.js';

/**
 * Hook quản lý dữ liệu cho trang chi tiết xe
 * Bao gồm thông tin xe và danh sách xe đề xuất
 */
export const useVehicleDetail = (id) => {
  const [vehicle, setVehicle] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Lấy thông tin chi tiết xe
        const data = await GetVehicleDetail(id);
        setVehicle(data);

        // 2. Lấy danh sách đề xuất (Cùng hãng ưu tiên)
        const recs = await GetVehicles({ brand: data.brand }, { page: 0, size: 5, sort: 'pricePerDay,asc' });
        let filteredRecs = recs.content.filter(v => v.carId.toString() !== id);

        // 3. Fallback nếu không đủ xe cùng hãng
        if (filteredRecs.length < 3) {
          const otherCars = await GetVehicles({}, { page: 0, size: 10, sort: 'createdDate,desc' });
          const additionalCars = otherCars.content.filter(
            v => v.carId.toString() !== id && !filteredRecs.find(r => r.carId === v.carId)
          );
          filteredRecs = [...filteredRecs, ...additionalCars];
        }
        
        setRecommendations(filteredRecs.slice(0, 3));
      } catch (err) {
        console.error('Data fetching error:', err);
        setError('Không thể tải dữ liệu xe. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
    window.scrollTo(0, 0);
  }, [id]);

  return { vehicle, recommendations, loading, error };
};
