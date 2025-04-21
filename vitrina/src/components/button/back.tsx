import React from 'react';
import Button from './button';

interface ButtonProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const BackButton: React.FC<ButtonProps> = ({ children, style}) => {
    const handleBack = () => {
        window.history.back();
    };

    return (
        <Button onClick={handleBack} 
            style={{...style, backgroundColor:"#f4f4f4", color:"#222"}}
        >
            {children}
        </Button>
    );
};

export default BackButton;
