import './.css';

interface InputWithUnitProps {
    placeholder: string;
    unit: string;
    value: string | number; 
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    style?: React.CSSProperties;
}

const InputWithUnit: React.FC<InputWithUnitProps> = ({ value, onChange, placeholder, unit, style}) => {
  return (
    <div className="input-container">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-field"
        style={style}
      />
      {value && <span className="unit-inside">, {unit}</span>}
    </div>
  );
};

export default InputWithUnit;
