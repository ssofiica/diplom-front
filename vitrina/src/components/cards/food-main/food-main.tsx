import React from 'react';
import Button from '../../button/button';
import './food-main.css'
import def from './../88.jpg' 

interface MainFoodCardProps {
  style?: React.CSSProperties,
  id: number,
  name: string,
  price: number,
  weight: number,
  img: string,
  count: number,
  onAdd: (id: number, food: any) => void,
  onRemove: (id: number, food: any) => void,
}

const MainFoodCard: React.FC<MainFoodCardProps> = ({style, id, name, price,
    weight, img, count, onAdd, onRemove}) => {

  return (
    <div className='main-food' style={style}>
      <div className="part">
        <img src={def} alt={name} className="food-card-image"/>
        <span className="name" style={{}}>{name}</span>
      </div>
      <div className='part'>
        <div className="o-row" style={{marginTop: '0.5em', alignItems:'center', marginBottom: '0.5em'}}>
            <span className="price">{price} ₽</span>
            <span className="weight">{weight} г</span>
        </div>
        { count > 0 ? 
          <div className="food-count-card">
            <button 
              onClick={() => onRemove(id, {id, name, price, weight, img, count})}>-</button>
            <span>{count}</span>
            <button  onClick={() => onAdd(id, {id, name, price, weight, img, count})}>+</button>
          </div>
            : <Button onClick={() => onAdd(id, {id, name, price, weight, img, count})} >Добавить</Button>}
      </div>
    </div>
  );
};

export default MainFoodCard