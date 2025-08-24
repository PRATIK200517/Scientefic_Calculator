import React, { useState } from 'react';

type UnitConverterProps = {
  onClose: () => void;
  onConvert: (request: {
    category: string;
    fromUnit: string;
    toUnit: string;
    value: number;
  }) => Promise<number>;
};

const UnitConverter = ({ onClose, onConvert }: UnitConverterProps) => {
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('ft');
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const conversions = {
    length: ['m', 'ft', 'in', 'cm', 'mm', 'km'],
    mass: ['kg', 'g', 'lb', 'oz', 'ton'],
    temperature: ['c', 'f', 'k'],
    area: ['m²', 'ft²', 'in²', 'cm²', 'km²'],
    volume: ['l', 'ml', 'gal', 'qt', 'pt', 'cup', 'fl oz']
  };

  const convert = async () => {
    if (!inputValue) return;
    
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult('Invalid input');
      return;
    }

    setIsLoading(true);
    try {
      const convertedValue = await onConvert({
        category,
        fromUnit,
        toUnit,
        value
      });
      setResult(convertedValue.toFixed(6));
    } catch (error) {
      setResult('Conversion failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getUnitsForCategory = (cat: string) => {
    return conversions[cat as keyof typeof conversions] || [];
  };

  return (
    <div className="unit-converter">
      <div className="converter-header">
        <h3>Unit Converter</h3>
        <button onClick={onClose} className="close-btn">×</button>
      </div>
      
      <div className="converter-content">
        <div className="category-selector">
          <label>Category:</label>
          <select 
            value={category} 
            onChange={(e) => {
              setCategory(e.target.value);
              const units = getUnitsForCategory(e.target.value);
              setFromUnit(units[0]);
              setToUnit(units[1] || units[0]);
              setResult('');
            }}
          >
            <option value="length">Length</option>
            <option value="mass">Mass</option>
            <option value="temperature">Temperature</option>
            <option value="area">Area</option>
            <option value="volume">Volume</option>
          </select>
        </div>
        
        <div className="conversion-row">
          <div className="input-group">
            <label>From:</label>
            <input 
              type="number" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
            />
            <select 
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
            >
              {getUnitsForCategory(category).map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
          
          <div className="input-group">
            <label>To:</label>
            <input 
              type="text" 
              value={result}
              readOnly
              placeholder={isLoading ? "Converting..." : "Result"}
            />
            <select 
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
            >
              {getUnitsForCategory(category).map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>
        
        <button onClick={convert} className="convert-btn" disabled={isLoading}>
          {isLoading ? 'Converting...' : 'Convert'}
        </button>
      </div>
    </div>
  );
};

export default UnitConverter;