import React from 'react';
import { Form } from 'react-bootstrap';

const BaseSelect = ({ options, label, ...props }) => {
  return (
    <div className="d-flex align-items-center gap-2">
      {label && <span className="body-md text-muted">{label}</span>}
      <Form.Select 
        className="border-outline-variant rounded-3 body-md px-3 py-2 shadow-none focus-ring-primary"
        style={{ width: 'auto', minWidth: '180px' }}
        {...props}
      >
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value}>{opt.label}</option>
        ))}
      </Form.Select>
    </div>
  );
};

export default BaseSelect;
