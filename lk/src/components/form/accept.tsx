import React from 'react';
import './.css';
import Button from '../button/button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  text: string;
}

const AcceptModal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, text }) => {
  const handleSubmit = () =>{
      onSubmit();
      onClose();
  };

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="m-header">
            <h3 className="title" style={{marginRight: "40px"}}>{text}</h3>
            <div onClick={onClose}>Закрыть</div>
        </div>
        <div style={{marginTop: "20px", display: 'flex', justifyContent: 'flex-start', alignItems: 'center'}}>
          <Button type="button" onClick={handleSubmit} style={{marginRight: "20px"}} variant='danger'>
            Удалить
          </Button>
          <div onClick={onClose}>
            Отменить 
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcceptModal;