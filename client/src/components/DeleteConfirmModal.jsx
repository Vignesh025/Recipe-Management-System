import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../styles/custom.css';

function DeleteConfirmModal({ show, onHide, onConfirm, loading }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete this recipe? This action cannot be undone.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button className='custom-btn' variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button className='custom-btn' variant="danger" onClick={onConfirm} disabled={loading}>
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteConfirmModal; 