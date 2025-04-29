import React, { useEffect, useState } from 'react';
import './css/mini-order.css'

interface MiniOrderCardProps {
  onClick: (id: number) => void;
  status: string;
  style?: React.CSSProperties;
  number: number,
  sum: number,
  variant: string,
  date?: any | string | Date,
}

const MiniOrderCard: React.FC<MiniOrderCardProps> = ({ onClick, status, style, number, sum, variant, date }) => {
  const [isToday, setIsToday] = useState<boolean>(false);

  useEffect(() => {
      const createdAt = new Date(date);
      const today = new Date();

      const isSameDate = (
          createdAt.getFullYear() === today.getFullYear() &&
          createdAt.getMonth() === today.getMonth() &&
          createdAt.getDate() === today.getDate()
      );

      setIsToday(isSameDate);
  }, [date]);

  const createdAt = new Date(date);
  const d = createdAt.toLocaleDateString('ru-RU');
  const time = createdAt.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
  });

  let displayTime = isToday ? time : d;

  let cardStyle = {}
  if (status === "Завершен" || status === "Отменен") {
      cardStyle = { backgroundColor: '#f9f9f9', ...style};
  }

  return (
      <div
          onClick={() => onClick(number)}
          className='mini-order'
          style={cardStyle}
      >
          {isToday ? 
              <div className="o-row">
                  <p>№ {number}</p>
                  <p>{status} в {displayTime}</p>
              </div>
          : 
              <>
                  <div className="o-row">
                      <p>№ {number}</p>
                      <p>{status}</p>
                  </div>
                  <p style={{ textAlign: 'right' }}>{displayTime}</p>
              </>
          }
          <div className="o-row" style={{ marginTop: '1em' }}>
              <p>{variant}</p>
              <p>{sum} ₽</p>
          </div>
      </div>
  );
};

export default MiniOrderCard