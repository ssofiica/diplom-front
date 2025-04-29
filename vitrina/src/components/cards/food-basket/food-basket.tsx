import React from 'react';
import Button from '../../button/button';
import './food-basket.css'
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

const BasketFoodCard: React.FC<MainFoodCardProps> = ({style, id, name, price,
    weight, img, count, onAdd, onRemove}) => {

  return (
    <div className='basket-food-card' style={style}>
        <img src={img} alt={name} className="basket-card-image"/>
        <div className='part' style={{textAlign: 'left'}}>
            <span className="name" style={{marginTop: '2px'}}>{name}</span>
            <span className="weight">{weight} г</span>
        <div className="o-row" style={{marginTop: '0.5em', alignItems:'center', marginBottom: '0.5em'}}>
            <span className="price">{price} ₽</span>
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
    </div>
  );
};

export default BasketFoodCard