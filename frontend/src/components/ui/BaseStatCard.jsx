import React from 'react';
import { Card } from 'react-bootstrap';

const BaseStatCard = ({ title, value, icon: Icon, color = 'primary' }) => (
  <Card className="border-0 shadow-sm h-100">
    <Card.Body className="p-4">
      <div className="d-flex align-items-center gap-3">
        <div className={`bg-${color} bg-opacity-10 p-3 rounded-4`}>
          <Icon size={24} className={`text-${color}`} />
        </div>
        <div>
          <h6 className="text-muted label-sm mb-1">{title}</h6>
          <h3 className="fw-bold mb-0 text-primary">{value}</h3>
        </div>
      </div>
    </Card.Body>
  </Card>
);

export default BaseStatCard;
