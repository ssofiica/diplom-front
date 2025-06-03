import React, { useState, useEffect } from 'react';
import './addFood.css';
import './.css';
import InputWithUnit from '../input/input';
import Button from '../button/button';
import edit from '../../assets/edit-button.svg'
import {minio} from '../../const/const'


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dish: { name: string; weight: number; price: number; category: number; status: string; img: File|null }) => void;
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
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<string>('');
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    if (food) {
      setName(food.name);
      setPrice(food.price);
      setWeight(food.weight);
      setImage(minio+food.img_url)
      setIsChecked(statusMap[food.status]);
    } else {
      setName('');
      setPrice('');
      setWeight('');
      setImage('')
      setIsChecked(false)
    }
}, [food]);

  const handleSubmit = () => {
    if (name && weight && price && category) {
      let st = isChecked ? 'stop' : 'in'
      const s = parseInt(category)
      onSubmit({ name, weight, price, category:s, status:st, img:file});
      onClose();
      setName('');
      setPrice('');
      setWeight('');
      setIsChecked(false);
    }
  };

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleImageClick = () => {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    if (target.files && target.files.length > 0) {
      const selectedFile = target.files[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
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
          <div
            onClick={handleImageClick}
            style={{ position: 'relative', cursor: 'pointer', height: '200px'}}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img src={image} alt='Фото блюда' style={{height: '100%', width: '220px', objectFit: 'cover'}}/>
            {isHovered && (
            <img
              src={edit}
              alt="Hover"
              style={{position: 'absolute', top: '10px', left: '10px', width: '20%', height: '20%', objectFit: 'cover', color: 'white'}}
          />
        )}
          </div>
          <input
            type="file"
            id="file-input"
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleFileChange}
          />
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