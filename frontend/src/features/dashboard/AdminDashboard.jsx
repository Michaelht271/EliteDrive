import React from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { Users, Car, Calendar, DollarSign, TrendingUp, AlertCircle, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import BaseStatCard from '../../components/ui/BaseStatCard.jsx';
import { SimpleLineChart, SimplePieChart } from '../../components/ui/SimpleCharts.jsx';

const AdminDashboard = () => {
  const { user } = useAuth();

  // Mock data cho dashboard
  const revenueData = [4500, 5200, 3800, 6500, 7100, 8400, 9200];
  const recentActivities = [
    { id: 1, type: 'rental', user: 'Nguyễn Văn A', car: 'Toyota Camry', status: 'CONFIRMED', time: '2 giờ trước' },
    { id: 2, type: 'user', user: 'Trần Thị B', action: 'Đăng ký mới', status: 'SUCCESS', time: '5 giờ trước' },
    { id: 3, type: 'rental', user: 'Lê Văn C', car: 'Mazda CX-5', status: 'COMPLETED', time: '1 ngày trước' },
  ];

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-5">
        <div className="mb-4">
          <h2 className="fw-black text-primary tracking-tight">Hệ thống Quản trị EliteDrive</h2>
          <p className="text-muted body-md">Chào mừng trở lại, {user?.fullName || user?.username}. Hệ thống đang hoạt động ổn định.</p>
        </div>

        {/* Stats Row */}
        <Row className="g-4 mb-4">
          <Col md={3}>
            <BaseStatCard title="Tổng doanh thu" value="$128.4k" icon={DollarSign} color="primary" />
          </Col>
          <Col md={3}>
            <BaseStatCard title="Tổng người dùng" value="2,482" icon={Users} color="info" />
          </Col>
          <Col md={3}>
            <BaseStatCard title="Đội xe" value="124" icon={Car} color="warning" />
          </Col>
          <Col md={3}>
            <BaseStatCard title="Đơn thuê mới" value="18" icon={Calendar} color="success" />
          </Col>
        </Row>

        <Row className="g-4">
          {/* Revenue Trend */}
          <Col lg={8}>
            <Card className="border-0 shadow-sm rounded-4 h-100">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h5 className="fw-black text-dark mb-1">Xu hướng doanh thu</h5>
                    <p className="text-muted small mb-0">Thống kê 7 tháng gần nhất</p>
                  </div>
                  <div className="text-end">
                    <div className="text-success fw-bold d-flex align-items-center gap-1">
                      <ArrowUpRight size={16} /> +12.5%
                    </div>
                    <div className="small text-muted">so với kỳ trước</div>
                  </div>
                </div>
                <div className="mt-4 pt-2">
                  <SimpleLineChart data={revenueData} color="#003366" height={200} />
                  <div className="d-flex justify-content-between mt-3 text-muted small fw-bold">
                    <span>T1</span><span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Fleet Status */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm rounded-4 h-100">
              <Card.Body className="p-4">
                <h5 className="fw-black text-dark mb-4">Tình trạng đội xe</h5>
                <div className="d-flex justify-content-center py-3">
                  <SimplePieChart percent={82} color="#10b981" size={150} />
                </div>
                <div className="mt-4 space-y-3">
                  <div className="d-flex justify-content-between align-items-center p-2 rounded-3 bg-light mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <div className="rounded-circle" style={{ width: 12, height: 12, backgroundColor: '#10b981' }}></div>
                      <span className="small fw-bold">Sẵn sàng</span>
                    </div>
                    <span className="small fw-black text-dark">102 xe</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center p-2 rounded-3 bg-light mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <div className="rounded-circle" style={{ width: 12, height: 12, backgroundColor: '#3b82f6' }}></div>
                      <span className="small fw-bold">Đang thuê</span>
                    </div>
                    <span className="small fw-black text-dark">18 xe</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center p-2 rounded-3 bg-light">
                    <div className="d-flex align-items-center gap-2">
                      <div className="rounded-circle" style={{ width: 12, height: 12, backgroundColor: '#ef4444' }}></div>
                      <span className="small fw-bold">Bảo trì</span>
                    </div>
                    <span className="small fw-black text-dark">4 xe</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Recent Activity Table */}
          <Col lg={12}>
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
              <Card.Header className="bg-white border-0 p-4">
                <h5 className="fw-black text-dark mb-0">Hoạt động hệ thống gần đây</h5>
              </Card.Header>
              <Table responsive hover className="align-middle mb-0 border-0">
                <thead className="bg-light text-muted small fw-bold uppercase">
                  <tr>
                    <th className="px-4 py-3 border-0">Người dùng</th>
                    <th className="py-3 border-0">Hành động / Xe</th>
                    <th className="py-3 border-0">Thời gian</th>
                    <th className="px-4 py-3 border-0 text-end">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="border-top-0">
                  {recentActivities.map(activity => (
                    <tr key={activity.id} className="border-bottom border-light">
                      <td className="px-4 py-3 fw-bold text-dark">{activity.user}</td>
                      <td className="py-3 text-muted">
                        {activity.type === 'rental' ? (
                          <div className="d-flex align-items-center gap-2">
                            <Car size={16} className="text-primary" /> {activity.car}
                          </div>
                        ) : activity.action}
                      </td>
                      <td className="py-3 small text-muted">{activity.time}</td>
                      <td className="px-4 py-3 text-end">
                        <span className={`px-2 py-1 rounded-pill small fw-bold bg-opacity-10 ${
                          activity.status === 'CONFIRMED' || activity.status === 'SUCCESS' ? 'bg-success text-success' : 'bg-primary text-primary'
                        }`} style={{ fontSize: '10px' }}>
                          {activity.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
