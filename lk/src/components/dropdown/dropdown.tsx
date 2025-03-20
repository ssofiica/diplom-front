import React, { useEffect, useState } from 'react';
import './.css'

interface SelectBoxProps {
  options: { value: any; label: string }[];
  onChange: (selectedValue: any) => void;
  value?: any;
}

const SelectBox: React.FC<SelectBoxProps> = ({ options, onChange, value }) => {
  const [selectedValue, setSelectedValue] = useState<any>('');
  useEffect(() => {
    if (value) {
      setSelectedValue(value)
    } else {
      setSelectedValue(options[0].value)
    }
  }, [])

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