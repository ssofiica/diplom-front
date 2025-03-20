import React, { useState, useEffect } from 'react';
import './addFood.css';
import './.css';
import InputWithUnit from '../input/input';
import Button from '../button/button';
import SelectBox from '../dropdown/dropdown';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dish: { name: string; weight: number; price: number; category: number; status: string }) => void;
  title: string;
  food?: any;
  id: any;
}

const mockCategories = [
  { value: 1, label: 'Пицца' }, { value: 2, label: 'Салаты' }, { value: 3, label: 'Паста' },
]

const statusMap: Record<string, boolean> = {
  'in': false,
  'stop': true,
};

const AddFoodModal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, title, food, id }) => {
  const [name, setName] = useState('');
  const [weight, setWeight] = useState<number | ''>('');
  const [price, setPrice] = useState<number | ''>('');
  const [category, setCategory] = useState<any>(id);
  const [isChecked, setIsChecked] = useState(false); //false - in, true - stop
  const [categories, setCategories] = useState<any>(mockCategories);

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

  useEffect(() => {
    if (food) {
        setName(food.name);
        setPrice(food.price);
        setWeight(food.weight);
        setIsChecked(statusMap[food.status]);
    } else {
        setName('');
        setPrice('');
        setWeight('');
        setIsChecked(false)
    }
}, [food]);

  const handleSubmit = () => {
    if (name && weight && price && category) {
      let st = isChecked ? 'stop' : 'in'
      const s = parseInt(category)
      onSubmit({ name, weight, price, category:s, status:st});
      onClose();
      setName('');
      setPrice('');
      setWeight('');
      setIsChecked(false);
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
          <p className="title">{title}</p>
          <div onClick={onClose}>Закрыть</div>
        </div>
        <div className="main">
          <img src="https://eda.yandex/images/3420935/bf93ac4febba46d8ab4e01218a73655b-216x188.jpeg" alt='Фото блюда'></img>
          <div className="right" style={{marginLeft:'20px'}}>
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
                  onChange={(e) => setWeight(parseInt(e.target.value))}
                  placeholder="Введите вес"
                  unit="г"
                  style={{width: "8em", marginRight: '10px'}}
                />
                <InputWithUnit
                  value={price}
                  onChange={(e) => setPrice(parseInt(e.target.value))}
                  placeholder="Введите цену"
                  unit="руб"
                  style={{width: "10em"}}
                />
              </div>
              <div className="m-row">
                <SelectBox
                  options={categories}
                  onChange={setCategory}
                  value={id}
                />
                <div className="checkbox">
                  <input 
                    type="checkbox"
                    id="stoplist" 
                    name="stoplist" 
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                  />
                  <label htmlFor="stoplist">В стоп-лист</label>
                </div>
              </div>
            </form>
          </div>
        </div>
        <Button type="button" onClick={handleSubmit} style={{marginTop: "20px"}}>
          Добавить 
        </Button>
      </div>
    </div>
  );
};

export default AddFoodModal;