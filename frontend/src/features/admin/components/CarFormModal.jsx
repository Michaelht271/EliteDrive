import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form, Row, Col, Spinner, InputGroup, Image } from 'react-bootstrap';
import { 
  Car, Hash, Calendar, Palette, Users, Settings, 
  Fuel, DollarSign, X, Camera, Plus, CheckCircle2, Upload, AlertCircle
} from 'lucide-react';
import api from '../../../infrastructure/api/axios.js';

const CarFormModal = ({ show, onHide, onSubmit, initialData, loading }) => {
  const [formData, setFormData] = useState({
    carName: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    color: '',
    seats: 4,
    fuelType: 'GASOLINE',
    transmission: 'AUTOMATIC',
    pricePerDay: '',
    description: '',
    thumbnailUrl: ''
  });

  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        description: initialData.description || '',
        color: initialData.color || '',
        thumbnailUrl: initialData.thumbnailUrl || ''
      });
      setPreviewUrl(initialData.thumbnailUrl ? `http://localhost:8080${initialData.thumbnailUrl}` : '');
    } else {
      setFormData({
        carName: '', brand: '', model: '', year: new Date().getFullYear(),
        licensePlate: '', color: '', seats: 4, fuelType: 'GASOLINE',
        transmission: 'AUTOMATIC', pricePerDay: '', description: '', thumbnailUrl: ''
      });
      setPreviewUrl('');
    }
    setValidated(false);
  }, [initialData, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      const response = await api.post('/v1/files/upload-car', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({ ...prev, thumbnailUrl: response.data.url }));
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Không thể tải ảnh lên máy chủ.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    onSubmit(formData);
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg" backdrop="static">
      <Modal.Body className="p-0 overflow-hidden rounded-4 border-0 shadow-2xl">
        {/* Header */}
        <div className="bg-primary p-4 text-white d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-3">
              <Car size={24} />
            </div>
            <h4 className="fw-black mb-0 text-uppercase" style={{ letterSpacing: '1px' }}>
              {initialData ? 'Cập nhật thông tin xe' : 'Thêm xe mới vào kho'}
            </h4>
          </div>
          <Button variant="link" className="text-white p-0 opacity-70 hover-opacity-100 shadow-none border-0" onClick={onHide} disabled={loading || uploading}>
            <X size={24} />
          </Button>
        </div>

        <Form noValidate validated={validated} onSubmit={handleSubmit} className="p-4 p-md-5 bg-white">
          <Row className="g-4">
            {/* Upload Ảnh Section */}
            <Col md={12} className="mb-2">
              <h6 className="fw-black text-muted text-uppercase mb-3" style={{ fontSize: '11px', letterSpacing: '2px' }}>Hình ảnh đại diện</h6>
              <div 
                className={`position-relative border-2 border-dashed rounded-4 d-flex flex-column align-items-center justify-content-center bg-light overflow-hidden transition-all ${validated && !formData.thumbnailUrl ? 'border-danger' : 'border-secondary border-opacity-25'}`}
                style={{ height: '200px', cursor: 'pointer' }}
                onClick={() => fileInputRef.current.click()}
              >
                {previewUrl ? (
                  <>
                    <Image src={previewUrl} className="w-100 h-100 object-fit-cover" />
                    <div className="position-absolute top-0 end-0 m-3 shadow-sm bg-white p-2 rounded-circle text-primary"><Camera size={20} /></div>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <Upload size={32} className="text-muted mb-2" />
                    <p className="fw-bold text-dark mb-0">Tải ảnh xe lên</p>
                    <p className="small text-muted mb-0">Bắt buộc chọn ảnh đại diện</p>
                  </div>
                )}
                {uploading && (
                  <div className="position-absolute inset-0 bg-white bg-opacity-75 d-flex flex-column align-items-center justify-content-center">
                    <Spinner animation="border" variant="primary" size="sm" className="mb-2" />
                    <span className="small fw-bold">Đang xử lý ảnh...</span>
                  </div>
                )}
              </div>
              <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleFileChange} />
              {validated && !formData.thumbnailUrl && <div className="text-danger small mt-2 fw-bold"><AlertCircle size={14} /> Vui lòng tải ảnh lên trước khi lưu.</div>}
            </Col>

            <Col md={12}>
              <h6 className="fw-black text-muted text-uppercase mb-3 mt-2" style={{ fontSize: '11px', letterSpacing: '2px' }}>Thông tin chi tiết</h6>
              <Form.Group controlId="carName">
                <Form.Label className="small fw-bold text-dark">Tên xe hiển thị</Form.Label>
                <InputGroup hasValidation className="border rounded-3 overflow-hidden shadow-xs">
                  <InputGroup.Text className="bg-light border-0"><Car size={18} className="text-muted" /></InputGroup.Text>
                  <Form.Control 
                    required
                    name="carName"
                    placeholder="VD: Toyota Camry 2.5Q"
                    className="border-0 py-2.5 fw-medium"
                    value={formData.carName}
                    onChange={handleChange}
                  />
                  <Form.Control.Feedback type="invalid" className="ps-3 mb-1">Tên xe không được để trống.</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="brand">
                <Form.Label className="small fw-bold text-dark">Thương hiệu</Form.Label>
                <Form.Control 
                  required
                  name="brand"
                  placeholder="Toyota"
                  className="rounded-3 py-2.5 fw-medium border-light bg-light bg-opacity-50"
                  value={formData.brand}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">Nhập hãng xe.</Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={4}>
              <Form.Group controlId="model">
                <Form.Label className="small fw-bold text-dark">Model</Form.Label>
                <Form.Control 
                  required
                  name="model"
                  placeholder="Camry"
                  className="rounded-3 py-2.5 fw-medium border-light bg-light bg-opacity-50"
                  value={formData.model}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">Nhập model xe.</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="year">
                <Form.Label className="small fw-bold text-dark">Năm sản xuất</Form.Label>
                <Form.Control 
                  required
                  type="number"
                  name="year"
                  min="1900"
                  max={new Date().getFullYear() + 2}
                  className="rounded-3 py-2.5 fw-medium border-light bg-light bg-opacity-50"
                  value={formData.year}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">Năm không hợp lệ.</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="licensePlate">
                <Form.Label className="small fw-bold text-dark">Biển số xe</Form.Label>
                <InputGroup hasValidation className="border rounded-3 overflow-hidden shadow-xs">
                  <InputGroup.Text className="bg-light border-0"><Hash size={18} className="text-muted" /></InputGroup.Text>
                  <Form.Control 
                    required
                    name="licensePlate"
                    placeholder="30A-12345"
                    className="border-0 py-2.5 fw-medium"
                    value={formData.licensePlate}
                    onChange={handleChange}
                  />
                  <Form.Control.Feedback type="invalid" className="ps-3 mb-1">Biển số bắt buộc.</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="color">
                <Form.Label className="small fw-bold text-dark">Màu sắc</Form.Label>
                <InputGroup className="border rounded-3 overflow-hidden shadow-xs">
                  <InputGroup.Text className="bg-light border-0"><Palette size={18} className="text-muted" /></InputGroup.Text>
                  <Form.Control 
                    name="color"
                    placeholder="Trắng"
                    className="border-0 py-2.5 fw-medium"
                    value={formData.color}
                    onChange={handleChange}
                  />
                </InputGroup>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="seats">
                <Form.Label className="small fw-bold text-dark">Số chỗ ngồi</Form.Label>
                <InputGroup hasValidation className="border rounded-3 overflow-hidden shadow-xs">
                  <InputGroup.Text className="bg-light border-0"><Users size={18} className="text-muted" /></InputGroup.Text>
                  <Form.Control 
                    required
                    type="number"
                    name="seats"
                    min="1"
                    className="border-0 py-2.5 fw-medium"
                    value={formData.seats}
                    onChange={handleChange}
                  />
                  <Form.Control.Feedback type="invalid" className="ps-3 mb-1">Nhập số ghế.</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="fuelType">
                <Form.Label className="small fw-bold text-dark">Nhiên liệu</Form.Label>
                <Form.Select 
                  name="fuelType"
                  className="rounded-3 py-2.5 fw-bold text-primary border-light shadow-none"
                  value={formData.fuelType}
                  onChange={handleChange}
                >
                  <option value="GASOLINE">XĂNG</option>
                  <option value="DIESEL">DẦU (DIESEL)</option>
                  <option value="ELECTRIC">ĐIỆN</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="transmission">
                <Form.Label className="small fw-bold text-dark">Hộp số</Form.Label>
                <Form.Select 
                  name="transmission"
                  className="rounded-3 py-2.5 fw-bold text-primary border-light shadow-none"
                  value={formData.transmission}
                  onChange={handleChange}
                >
                  <option value="AUTOMATIC">TỰ ĐỘNG (AT)</option>
                  <option value="MANUAL">SỐ SÀN (MT)</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="pricePerDay">
                <Form.Label className="small fw-bold text-dark">Giá thuê/ngày</Form.Label>
                <InputGroup hasValidation className="border rounded-3 overflow-hidden shadow-xs border-primary border-opacity-25">
                  <InputGroup.Text className="bg-primary bg-opacity-10 text-primary border-0"><DollarSign size={18} /></InputGroup.Text>
                  <Form.Control 
                    required
                    type="number"
                    min="1000"
                    name="pricePerDay"
                    placeholder="1500000"
                    className="border-0 py-2.5 fw-black text-primary"
                    value={formData.pricePerDay}
                    onChange={handleChange}
                  />
                  <Form.Control.Feedback type="invalid" className="ps-3 mb-1">Giá thuê phải lớn hơn 1,000đ.</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group controlId="description">
                <Form.Label className="small fw-bold text-dark">Mô tả giới thiệu</Form.Label>
                <Form.Control 
                  as="textarea"
                  rows={2}
                  name="description"
                  placeholder="Nhập mô tả về xe, trang bị, tình trạng..."
                  className="rounded-3 border-light bg-light bg-opacity-50 p-3 fw-medium shadow-none"
                  value={formData.description}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="mt-5 p-4 rounded-4 bg-light d-flex justify-content-between align-items-center">
            <div className="text-muted small fw-medium pe-4">
              Vui lòng đảm bảo các thông số kỹ thuật là chính xác trước khi lưu.
            </div>
            <div className="d-flex gap-2">
              <Button variant="white" className="border-0 fw-bold px-4 rounded-3 text-muted shadow-none" onClick={onHide} disabled={loading || uploading}>Hủy</Button>
              <Button type="submit" variant="primary" className="fw-black px-4 rounded-3 border-0 bg-primary d-flex align-items-center gap-2 shadow-lg" disabled={loading || uploading}>
                {loading ? <Spinner size="sm" /> : initialData ? <CheckCircle2 size={18} /> : <Plus size={18} />} 
                {initialData ? 'LƯU THAY ĐỔI' : 'THÊM XE MỚI'}
              </Button>
            </div>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CarFormModal;
