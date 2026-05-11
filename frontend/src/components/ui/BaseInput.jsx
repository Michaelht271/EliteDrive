import React, { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { Eye, EyeOff } from 'lucide-react';

const BaseInput = ({ label, icon: Icon, error, type, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <Form.Group className="mb-0 w-100">
      {label && <Form.Label className="label-sm text-muted mb-2">{label}</Form.Label>}
      <InputGroup className="position-relative border-bottom align-items-center">
        {Icon && (
          <InputGroup.Text className="bg-transparent border-0 ps-0">
            <Icon size={20} className="text-primary" />
          </InputGroup.Text>
        )}
        <Form.Control
          {...props}
          type={inputType}
          className={`border-0 rounded-0 bg-transparent shadow-none body-md px-0 ${props.className || ''} ${error ? 'is-invalid' : ''}`}
        />
        {isPassword && (
          <div 
            className="cursor-pointer text-muted hover-text-primary ms-2 p-1"
            onClick={() => setShowPassword(!showPassword)}
            style={{ zIndex: 5 }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </div>
        )}
      </InputGroup>
      {error && <Form.Control.Feedback type="invalid" className="d-block">{error}</Form.Control.Feedback>}
    </Form.Group>
  );
};

export default BaseInput;

