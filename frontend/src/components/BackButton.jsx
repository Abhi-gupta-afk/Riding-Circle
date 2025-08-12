import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'react-bootstrap-icons';

export default function BackButton({ className }) {
  const navigate = useNavigate();
  return (
    <Button
      variant="outline-secondary"
      className={`d-inline-flex align-items-center gap-2 shadow-sm ${className || ''}`}
      style={{ borderRadius: 24, fontWeight: 500, fontSize: 16, padding: '6px 18px', transition: 'background 0.2s' }}
      onClick={() => navigate(-1)}
    >
      <ArrowLeft size={20} />
      Back
    </Button>
  );
}
