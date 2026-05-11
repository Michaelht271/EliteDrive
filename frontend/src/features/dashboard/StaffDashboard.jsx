import React from 'react';
import { Row, Col, Card, Badge, Table, ProgressBar } from 'react-bootstrap';
import { Calendar, ClipboardList, Car, Clock, CheckCircle2, MessageSquare, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import BaseStatCard from '../../components/ui/BaseStatCard.jsx';
import { SimpleBarChart } from '../../components/ui/SimpleCharts.jsx';

const StaffDashboard = () => {
  const { user } = useAuth();

  // Mock data cho staff
  const performanceData = [12, 19, 15, 8, 22, 25, 18]; // Đơn xử lý mỗi ngày
  const pendingTasks = [
    { id: 1, task: 'Kiểm tra xe Ford Everest (29A-123.45) trả muộn', priority: 'high', time: '15 phút trước' },
    { id: 2, task: 'Xác nhận 3 đơn thuê mới từ khách hàng VIP', priority: 'medium', time: '45 phút trước' },
    { id: 3, task: 'Cập nhật hình ảnh cho Mazda 3 mới nhập', priority: 'low', time: '2 giờ trước' },
  ];

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-5" style={{ backgroundColor: '#f3f3f6', minHeight: '100%' }}>
        <div className="mb-4 d-flex justify-content-between align-items-center">
          <div>
            <h2 className="fw-black text-primary mb-1">Cổng thông tin Nhân viên</h2>
            <p className="text-muted body-md mb-0">Chào {user?.fullName || user?.username}, chúc bạn một ngày làm việc hiệu quả!</p>
          </div>
          <div className="text-end">
            <Badge bg="primary" className="px-3 py-2 rounded-3 fs-6 mb-1 shadow-sm border-0">{user?.shift || 'Ca Sáng (08:00 - 17:00)'}</Badge>
            <div className="small text-muted fw-bold uppercase" style={{ fontSize: '10px' }}>Trạng thái: Trực tuyến</div>
          </div>
        </div>

        {/* Operational Stats */}
        <Row className="g-4 mb-4">
          <Col md={3}>
            <BaseStatCard title="Đang thuê" value="42" icon={Car} color="primary" />
          </Col>
          <Col md={3}>
            <BaseStatCard title="Chờ bàn giao" value="08" icon={Clock} color="warning" />
          </Col>
          <Col md={3}>
            <BaseStatCard title="Cần xử lý" value="12" icon={ClipboardList} color="danger" />
          </Col>
          <Col md={3}>
            <BaseStatCard title="Hoàn thành/Ngày" value="15" icon={CheckCircle2} color="success" />
          </Col>
        </Row>

        <Row className="g-4">
          {/* Task List */}
          <Col lg={7}>
            <Card className="border-0 shadow-sm rounded-4 h-100">
              <Card.Header className="bg-white border-0 p-4 d-flex justify-content-between align-items-center">
                <h5 className="fw-black text-dark mb-0">Danh sách việc cần làm</h5>
                <Badge bg="light" className="text-dark border rounded-pill px-3 py-1 fw-bold">{pendingTasks.length} việc</Badge>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="px-4 pb-4">
                  {pendingTasks.map((task, i) => (
                    <div key={task.id} className={`p-3 rounded-4 mb-3 border-start border-4 shadow-sm ${
                      task.priority === 'high' ? 'bg-danger bg-opacity-10 border-danger' : 
                      task.priority === 'medium' ? 'bg-warning bg-opacity-10 border-warning' : 'bg-info bg-opacity-10 border-info'
                    }`}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="fw-bold text-dark mb-1">{task.task}</div>
                        <span className="small text-muted fw-medium">{task.time}</span>
                      </div>
                      <div className="d-flex align-items-center gap-2 mt-2">
                         <Badge bg={task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'info'} className="small rounded-pill" style={{ fontSize: '9px' }}>
                           {task.priority.toUpperCase()}
                         </Badge>
                         <button className="btn btn-link p-0 text-primary small fw-bold text-decoration-none ms-auto">Xử lý ngay</button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Performance Chart */}
          <Col lg={5}>
            <Card className="border-0 shadow-sm rounded-4 h-100">
              <Card.Body className="p-4">
                <h5 className="fw-black text-dark mb-4">Hiệu suất xử lý đơn</h5>
                <div className="mt-2">
                  <SimpleBarChart data={performanceData} color="#3b82f6" height={150} />
                  <div className="d-flex justify-content-between mt-3 text-muted small fw-bold">
                    <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span>
                  </div>
                </div>
                <div className="mt-5">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="small fw-bold">Chỉ tiêu tuần này</span>
                    <span className="small fw-black text-primary">85%</span>
                  </div>
                  <ProgressBar now={85} variant="primary" className="rounded-pill" style={{ height: '8px' }} />
                  <p className="small text-muted mt-2 mb-0">Bạn đã xử lý vượt mức 15% so với tuần trước.</p>
                </div>
                
                <div className="mt-4 pt-4 border-top">
                  <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-4">
                    <div className="bg-warning bg-opacity-20 p-2 rounded-3 text-warning">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <div className="small fw-black text-dark">Lưu ý bảo trì</div>
                      <div className="small text-muted">04 xe sắp đến hạn bảo trì định kỳ.</div>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </DashboardLayout>
  );
};

export default StaffDashboard;
