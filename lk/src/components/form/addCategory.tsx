import React, { useState } from 'react';
import './.css';
import Button from '../button/button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

const AddCategoryModal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = () =>{
      if (name) {
        onSubmit(name);
        setName('')
        onClose();
      }
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
            <h2 className="title">Новая категория</h2>
            <div onClick={onClose}>Закрыть</div>
        </div>
        <input
            type="text"
            value={name}
            maxLength={100}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введите название"
            className="input-field"
        />
        <Button type="button" onClick={handleSubmit} style={{marginTop: "20px"}}>
            Добавить 
        </Button>
      </div>
    </div>
  );
};

export default AddCategoryModal;