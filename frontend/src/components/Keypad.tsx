import React from 'react';

interface KeypadProps {
  onInput: (input: string) => void;
  isShiftMode: boolean;
}

const Keypad: React.FC<KeypadProps> = ({ onInput, isShiftMode }) => {
  const buttons = [
    // Row 1 - Function keys
    [
      { primary: 'AC', secondary: '', class: 'clear' },
      { primary: '±', secondary: '', class: 'function' },
      { primary: '%', secondary: '', class: 'function' },
      { primary: '÷', secondary: '/', class: 'operator' }
    ],
    // Row 2 - Memory and advanced functions
    [
      { primary: 'MC', secondary: '', class: 'memory' },
      { primary: 'MR', secondary: '', class: 'memory' },
      { primary: 'MS', secondary: '', class: 'memory' },
      { primary: 'M+', secondary: 'M-', class: 'memory' }
    ],
    // Row 3 - Trigonometric functions
    [
      { primary: 'sin', secondary: 'asin', class: 'function' },
      { primary: 'cos', secondary: 'acos', class: 'function' },
      { primary: 'tan', secondary: 'atan', class: 'function' },
      { primary: '×', secondary: '*', class: 'operator' }
    ],
    // Row 4 - Logarithmic functions
    [
      { primary: 'ln', secondary: 'e^x', class: 'function' },
      { primary: 'log', secondary: '10^x', class: 'function' },
      { primary: 'x²', secondary: 'x³', class: 'function' },
      { primary: '-', secondary: '', class: 'operator' }
    ],
    // Row 5 - Numbers and basic operations
    [
      { primary: '7', secondary: '', class: 'number' },
      { primary: '8', secondary: '', class: 'number' },
      { primary: '9', secondary: '', class: 'number' },
      { primary: '+', secondary: '', class: 'operator' }
    ],
    // Row 6
    [
      { primary: '4', secondary: '', class: 'number' },
      { primary: '5', secondary: '', class: 'number' },
      { primary: '6', secondary: '', class: 'number' },
      { primary: '√', secondary: 'sqrt', class: 'function' }
    ],
    // Row 7
    [
      { primary: '1', secondary: '', class: 'number' },
      { primary: '2', secondary: '', class: 'number' },
      { primary: '3', secondary: '', class: 'number' },
      { primary: '^', secondary: '', class: 'function' }
    ],
    // Row 8
    [
      { primary: '0', secondary: '', class: 'number zero' },
      { primary: '.', secondary: '', class: 'number' },
      { primary: 'n!', secondary: '', class: 'function' },
      { primary: '=', secondary: '', class: 'equals' }
    ],
    // Row 9 - Special functions
    [
      { primary: '(', secondary: '', class: 'function' },
      { primary: ')', secondary: '', class: 'function' },
      { primary: 'SHIFT', secondary: '', class: 'shift' },
      { primary: 'MODE', secondary: 'NOTATION', class: 'mode' }
    ]
  ];

  const handleButtonClick = (button: any) => {
    if (button.primary === 'SHIFT') {
      onInput('SHIFT');
      return;
    }

    if (button.primary === 'MODE') {
      if (isShiftMode && button.secondary) {
        onInput(button.secondary);
      } else {
        onInput(button.primary);
      }
      return;
    }

    const inputValue = isShiftMode && button.secondary 
      ? button.secondary 
      : button.primary;

    // Handle special display characters
    const actualValue = inputValue === '÷' ? '/' : 
                       inputValue === '×' ? '*' : 
                       inputValue === '√' ? 'sqrt' :
                       inputValue;

    onInput(actualValue);
  };

  return (
    <div className="keypad">
      {buttons.map((row, rowIndex) => (
        <div key={rowIndex} className="keypad-row">
          {row.map((button, buttonIndex) => (
            <button
              key={buttonIndex}
              className={`key ${button.class} ${isShiftMode && button.secondary ? 'shift-active' : ''}`}
              onClick={() => handleButtonClick(button)}
            >
              <span className="key-primary">{button.primary}</span>
              {button.secondary && (
                <span className="key-secondary">{button.secondary}</span>
              )}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keypad;