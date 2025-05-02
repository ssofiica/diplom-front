import React from 'react';
import './css/mini-order.css'

interface MiniOrderCardProps {
  onClick?: () => void;
  type?: string;
  style?: React.CSSProperties;
  number: string,
  time: string,
  sum: number,
  variant: 'Доставка' | 'Самовывоз',
}

const MiniOrderCard: React.FC<MiniOrderCardProps> = ({onClick, type, style, number, time, sum, variant }) => {
  let cardStyle = {}
  if (type === 'Новые') {
    cardStyle = { backgroundColor: '#ffe8e8', ...style }
  } else if (type === 'На кухне') {
    cardStyle = { border: '2px solid #e6e071', ...style }
  } else if (type === 'Готовы') {
    cardStyle = { border: '2px solid #89d793', ...style }
  }
  return (
    <div
      onClick={onClick}
      className='mini-order'
      style={cardStyle}
    >
        <div className="o-row">
            <p>№ {number}</p>
            <p>{time}</p>
        </div>
        <div className="o-row" style={{marginTop: '0.5em'}}>
            <p>{variant}</p>
            <p>{sum} ₽</p>
        </div>
    </div>
  );
};

export default MiniOrderCard