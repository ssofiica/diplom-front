import React, { useState, useEffect } from 'react';
import './addFood.css';
import './.css';
import InputWithUnit from '../input/input';
import Button from '../button/button';
import SelectBox from '../dropdown/dropdown';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dish: { name: string; weight: number; price: number; category: string }) => void;
}

const mockCategories = [
  { value: 1, label: 'Салаты' }, { value: 2, label: 'Десерты' }, { value: 3, label: 'Пицца' },
]

const AddFoodModal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [weight, setWeight] = useState<number | ''>('');
  const [price, setPrice] = useState<number | ''>('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<any>(mockCategories);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка категорий из API
  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       // Пример запроса к API
  //       const response = await fetch('https://localhost:8080/api/categories');
  //       const data = await response.json();
  //       setCategories(data); // Предполагаем, что API возвращает массив строк
  //       if (data.length > 0) {
  //         setCategory(data[0]); // Устанавливаем первую категорию по умолчанию
  //       }
  //     } catch (error) {
  //       console.error('Ошибка при загрузке категорий:', error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchCategories();
  // }, []);

  const handleSubmit = () => {
    if (name && weight && price && category) {
      onSubmit({ name, weight: weight, price: price, category });
      onClose();
    }
  };

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Закрываем модальное окно только если кликнули на область затемнения
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="m-header">
          <h2 className="title">Новое блюдо</h2>
          <div onClick={onClose}>Закрыть</div>
        </div>
        <div className="main">
          <img src="https://eda.yandex/images/3420935/bf93ac4febba46d8ab4e01218a73655b-216x188.jpeg"></img>
          <div className="right">
            <form>
              <InputWithUnit
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Введите название"
                unit=""
              />
              <div className="m-row">
                <InputWithUnit
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value))}
                  placeholder="Введите вес"
                  unit="г"
                  style={{width: "8em", marginRight: '10px'}}
                />
                <InputWithUnit
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value))}
                  placeholder="Введите цену"
                  unit="руб"
                  style={{width: "10em"}}
                />
              </div>
              <div className="m-row">
                <SelectBox
                  options={categories}
                  onChange={setCategory}
                />
                <div className="checkbox">
                  <input type="checkbox" id="stoplist" name="stoplist"/>
                  <label htmlFor="stoplist">В стоп-лист</label>
                </div>
              </div>
            </form>
          </div>
        </div>
        <Button type="button" onClick={handleSubmit} style={{margin: "20px 0px"}}>
          Добавить 
        </Button>
      </div>
    </div>
  );
};

export default AddFoodModal;