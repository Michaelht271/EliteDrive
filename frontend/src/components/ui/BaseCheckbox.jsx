import React from 'react';
import { Form } from 'react-bootstrap';

const BaseCheckbox = ({ label, icon: Icon, ...props }) => {
  return (
    <label className={`d-flex align-items-center gap-3 px-3 py-2 rounded-3 cursor-pointer transition-all hover-bg-light ${props.checked ? 'bg-surface-container-low' : ''}`}>
      <Form.Check 
        type="checkbox" 
        className="custom-checkbox"
        {...props}
      />
      {Icon && <Icon size={18} className="text-primary" />}
      <span className="body-md font-medium text-on-surface">{label}</span>
    </label>
  );
};

export default BaseCheckbox;
