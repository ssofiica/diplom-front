import React from 'react';
import './.css'

// Определяем типы для пропсов
interface ButtonProps {
  children?: React.ReactNode; // Внутреннее содержимое кнопки (текст или элементы)
  onClick?: () => void; // Функция, вызываемая при клике
  disabled?: boolean; // Состояние кнопки (активна/неактивна)
  type?: 'button' | 'submit' | 'reset'; // Тип кнопки
  style?: React.CSSProperties;
  imgStyle?: React.CSSProperties;
  src?: string;
  variant?: 'default' | 'danger' | 'action';
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  type = 'button',
  style,
  variant = 'default',
}) => {
  let buttonStyle = {};
  if (variant === 'default'){
    buttonStyle = {...style}
  } else if (variant === 'danger'){
    buttonStyle = { backgroundColor: '#ff3c3c', color: '#fff', ...style }
  } else if (variant === 'action'){
    buttonStyle = { backgroundColor: '#ffe6c4', color: '#000', ...style }
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className='default-button'
      style={buttonStyle}
    >
      {children}
    </button>
  );
};

export const ImgButton: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  type = 'button',
  style,
  imgStyle,
  src,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className='img-button'
      style={style}
    >
      <img src={src} style={imgStyle}/>
      {children}
    </button>
  );
};

export default Button;