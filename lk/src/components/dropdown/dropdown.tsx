import React, { useState } from 'react';
import './.css'

interface SelectBoxProps {
  options: { value: string; label: string }[];
  onChange: (selectedValue: string) => void;
  placeholder?: string;
}

const SelectBox: React.FC<SelectBoxProps> = ({ options, onChange, placeholder }) => {
  const [selectedValue, setSelectedValue] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedValue(value);
    onChange(value);
  };

  return (
    <select value={selectedValue} onChange={handleChange}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default SelectBox;