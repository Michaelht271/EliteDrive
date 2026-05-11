import React from 'react';
import { Button, Spinner, Card, Pagination } from 'react-bootstrap';
import { Plus, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import BaseModal from "../../components/ui/BaseModal.jsx";
import RentalReceiptModal from "../customer/components/RentalReceiptModal.jsx";

// Import Custom Hook
import { useRentalManagement } from './hooks/useRentalManagement.js';

// Import Sub-components
import RentalStats from './components/RentalStats.jsx';
import RentalFilters from './components/RentalFilters.jsx';
import RentalTable from './components/RentalTable.jsx';

const RentalManagement = () => {
  const {
    user, rentals, loading, actionId, totalElements, filters, setFilters, pageable,
    showModal, setShowModal, modalConfig, cancelReason, setCancelReason,
    showDetailModal, setShowDetailModal, selectedRental, fetchingDetail,
    fetchRentals, handleStatusUpdate, confirmStatusUpdate, handleViewDetail, handlePageChange
  } = useRentalManagement();

  const totalPages = Math.ceil(totalElements / pageable.size);

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-5" style={{ backgroundColor: '#f9f9fc', minHeight: '100vh' }}>
        
        {/* Page Header */}
        <div className="mb-4">
          <nav className="d-flex gap-2 small fw-bold text-muted mb-2 uppercase" style={{ letterSpacing: '1px', fontSize: '10px' }}>
            <span>Portal</span>
            <span>/</span>
            <span className="text-primary">Rental Orders</span>
          </nav>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end gap-3">
            <div>
              <h1 className="fw-black text-primary tracking-tight mb-1" style={{ fontSize: 'clamp(24px, 5vw, 32px)' }}>Rental Management</h1>
              <p className="text-muted mb-0 small">Quản lý và giám sát hoạt động vận hành đội xe thời gian thực.</p>
            </div>
            <div className="d-flex gap-2 w-100 w-md-auto">
              <Button variant="outline-primary" className="fw-bold px-3 rounded-3 d-flex align-items-center justify-content-center gap-2 border-2 shadow-none flex-grow-1 flex-md-grow-0" style={{ fontSize: '13px' }}>
                <FileText size={18} /> <span className="d-none d-sm-inline">Export CSV</span>
              </Button>
              <Button variant="primary" className="fw-black px-4 rounded-3 d-flex align-items-center justify-content-center gap-2 border-0 shadow-sm flex-grow-1 flex-md-grow-0" style={{ backgroundColor: '#003366', fontSize: '13px' }} onClick={fetchRentals} disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : <><Plus size={18} /> <span className="d-none d-sm-inline">Làm mới</span><span className="d-sm-none">Refresh</span></>}
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <RentalStats />

        {/* Filters */}
        <RentalFilters 
          filters={filters} 
          setFilters={setFilters} 
          onReset={() => { setFilters({ status: '', keyword: '' }); fetchRentals(); }} 
        />

        {/* Orders Table Container */}
        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
          <Card.Body className="p-0">
            <RentalTable 
              user={user}
              rentals={rentals}
              loading={loading}
              actionId={actionId}
              fetchingDetail={fetchingDetail}
              onStatusUpdate={handleStatusUpdate}
              onViewDetail={handleViewDetail}
              modalStatus={modalConfig.status}
            />
          </Card.Body>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-light px-4 py-3 d-flex justify-content-between align-items-center border-top">
              <div className="text-muted fw-bold" style={{ fontSize: '16px' }}>Showing {rentals.length} of {totalElements} entries</div>
              <Pagination className="mb-0 gap-1 border-0">
                <Pagination.Prev 
                  onClick={() => handlePageChange(pageable.page - 1)} 
                  disabled={pageable.page === 0} 
                  className="border-0 shadow-sm rounded-2"
                >
                  <ChevronLeft size={16} />
                </Pagination.Prev>
                <Pagination.Item active className="rounded-2 shadow-sm border-0">{pageable.page + 1}</Pagination.Item>
                <Pagination.Next 
                  onClick={() => handlePageChange(pageable.page + 1)} 
                  disabled={pageable.page >= totalPages - 1} 
                  className="border-0 shadow-sm rounded-2"
                >
                  <ChevronRight size={16} />
                </Pagination.Next>
              </Pagination>
            </div>
          )}
        </Card>

        {/* Modals */}
        <RentalReceiptModal 
          show={showDetailModal} 
          onHide={() => setShowDetailModal(false)} 
          rental={selectedRental} 
        />

        <BaseModal
          show={showModal}
          onHide={() => setShowModal(false)}
          onConfirm={confirmStatusUpdate}
          title={modalConfig.title}
          message={modalConfig.message}
          type={modalConfig.type}
          loading={actionId !== null}
          showInput={modalConfig.showInput}
          inputValue={cancelReason}
          onInputChange={setCancelReason}
          confirmLabel="XÁC NHẬN"
          cancelLabel="ĐÓNG"
        />
      </div>
    </DashboardLayout>
  );
};

export default RentalManagement;
