import React, { useState, useCallback, useEffect } from 'react';
import Display from './Display';
import Keypad from './Keypad';
import MemoryPanel from './MemoryPanel';
import UnitConverter from './UnitConverter';
import { calculatorApi } from '../services/calculatorApi';
import { formatNumber } from '../utils/formatter';
import "../styles/Calculator.css";

type CalculatorState = {
  display: string;
  previousValue: string;
  operation: string;
  waitingForNewValue: boolean;
  isShiftMode: boolean;
  memory: { [key: string]: number };
  history: string[];
  angleMode: "deg" | "rad" | "grad";
  notation: "normal" | "scientific" | "engineering";
};

const Calculator = () => {
  const [state, setState] = useState<CalculatorState>({
    display: "0",
    previousValue: "",
    operation: "",
    waitingForNewValue: false,
    isShiftMode: false,
    memory: {},
    history: [],
    angleMode: "deg",
    notation: "normal",
  });

  const [showMemoryPanel, setShowMemoryPanel] = useState(false);
  const [showUnitConverter, setShowUnitConverter] = useState(false);
  const [showConstants, setShowConstants] = useState(false);
  const [apiConstants, setApiConstants] = useState<{ [key: string]: number }>({});

  // Load constants from backend on component mount
  useEffect(() => {
    const loadConstants = async () => {
      try {
        const constants = await calculatorApi.getConstants();
        setApiConstants(constants);
      } catch (error) {
        console.error('Failed to load constants:', error);
      }
    };
    loadConstants();
  }, []);

  const handleInput = useCallback(async (input: string) => {
    // Handle basic operations locally
    if (input === 'AC') {
      setState(prev => ({
        ...prev,
        display: '0',
        previousValue: '',
        operation: '',
        waitingForNewValue: false,
        isShiftMode: false
      }));
      return;
    }

    if (input === 'SHIFT') {
      setState(prev => ({ ...prev, isShiftMode: !prev.isShiftMode }));
      return;
    }

    if (input === 'MODE') {
      const modes: ('deg' | 'rad' | 'grad')[] = ['deg', 'rad', 'grad'];
      const currentIndex = modes.indexOf(state.angleMode);
      const nextIndex = (currentIndex + 1) % modes.length;
      setState(prev => ({ ...prev, angleMode: modes[nextIndex] }));
      return;
    }

    if (input === 'NOTATION') {
      const notations: ('normal' | 'scientific' | 'engineering')[] = ['normal', 'scientific', 'engineering'];
      const currentIndex = notations.indexOf(state.notation);
      const nextIndex = (currentIndex + 1) % notations.length;
      setState(prev => ({ ...prev, notation: notations[nextIndex] }));
      return;
    }

    // Handle numbers and decimal point locally
    if (/^\d$/.test(input) || input === '.') {
      setState(prev => {
        if (prev.waitingForNewValue) {
          return {
            ...prev,
            display: input === '.' ? '0.' : input,
            waitingForNewValue: false,
          };
        } else {
          if (input === '.' && prev.display.includes('.')) {
            return prev;
          }
          return {
            ...prev,
            display: prev.display === '0' && input !== '.' ? input : prev.display + input,
          };
        }
      });
      return;
    }

    // Handle constants
    if (input.startsWith('CONST_')) {
      const constantName = input.replace('CONST_', '');
      const constantValue = apiConstants[constantName];
      if (constantValue !== undefined) {
        setState(prev => ({
          ...prev,
          display: formatNumber(constantValue, prev.notation),
          waitingForNewValue: false
        }));
      }
      return;
    }

    // Handle memory operations via API
    if (input.startsWith('M')) {
      try {
        let request: any = { action: input, slot: 'M1' };
        
        if (input === 'MS' || input === 'M+' || input === 'M-') {
          const currentValue = parseFloat(state.display);
          if (!isNaN(currentValue)) {
            request.value = currentValue;
          }
        }

        const response = await calculatorApi.memoryOperation(request);
        
        if (response.success) {
          setState(prev => ({
            ...prev,
            memory: response.memory,
            waitingForNewValue: input === 'MR' ? false : prev.waitingForNewValue,
            display: input === 'MR' && response.memory['M1'] !== undefined 
              ? formatNumber(response.memory['M1'], prev.notation) 
              : prev.display
          }));
        }
      } catch (error) {
        console.error('Memory operation failed:', error);
      }
      return;
    }

    // Handle complex functions via API
    const complexFunctions = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'ln', 'log', 'sqrt', 'x²', 'x³', '10^x', 'e^x', 'n!'];
    if (complexFunctions.includes(input)) {
      try {
        const currentValue = parseFloat(state.display);
        if (isNaN(currentValue)) return;

        const response = await calculatorApi.calculateFunction({
          function: input,
          value: currentValue,
          angleMode: state.angleMode
        });

        if (response.success && response.result !== undefined) {
          const result=response.result;
          setState(prev => ({
            ...prev,
            display: formatNumber(result, prev.notation),
            waitingForNewValue: true
          }));
        } else {
          setState(prev => ({
            ...prev,
            display: 'Error',
            waitingForNewValue: true
          }));
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          display: 'Error',
          waitingForNewValue: true
        }));
      }
      return;
    }

    // Handle basic operations
    if (['+', '-', '*', '/', '^', '%'].includes(input)) {
      setState(prev => {
        if (prev.operation && !prev.waitingForNewValue) {
          // Calculate existing operation
          calculateExpression(prev.previousValue + prev.operation + prev.display);
        }
        return {
          ...prev,
          previousValue: prev.display,
          operation: input,
          waitingForNewValue: true,
          isShiftMode: false
        };
      });
      return;
    }

    // Handle equals sign - send to backend
    if (input === '=') {
      if (state.previousValue && state.operation) {
        calculateExpression(state.previousValue + state.operation + state.display);
      }
      return;
    }
  }, [state, apiConstants]);

  const calculateExpression = async (expression: string) => {
    try {
      const response = await calculatorApi.calculateExpression({
        expression,
        angleMode: state.angleMode
      });

      if (response.success && response.result !== undefined) {
        const result=response.result;
        setState(prev => ({
          ...prev,
          display: formatNumber(result, prev.notation),
          previousValue: '',
          operation: '',
          waitingForNewValue: true,
          history: [...prev.history, `${expression} = ${response.result}`].slice(-10)
        }));
      } else {
        setState(prev => ({
          ...prev,
          display: 'Error',
          waitingForNewValue: true
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        display: 'Error',
        waitingForNewValue: true
      }));
    }
  };

  // ... rest of the component (render method) remains the same ...
  // Only the logic has been removed, the UI structure stays

  return (
    <div className="calculator">
      {/* Header, Display, Controls remain the same */}
      <div className="calculator-header">
        <h1>Scientific Calculator</h1>
        <div className="mode-indicators">
          <span className={`mode-indicator ${state.angleMode}`}>
            {state.angleMode.toUpperCase()}
          </span>
          <span className={`mode-indicator ${state.notation}`}>
            {state.notation.toUpperCase()}
          </span>
          {state.isShiftMode && <span className="mode-indicator shift">SHIFT</span>}
        </div>
      </div>

      <Display 
        value={state.display}
        previousValue={state.previousValue}
        operation={state.operation}
        history={state.history}
        memory={state.memory}
      />

      <div className="calculator-controls">
        <button 
          className={`control-btn ${showMemoryPanel ? 'active' : ''}`}
          onClick={() => setShowMemoryPanel(!showMemoryPanel)}
        >
          Memory
        </button>
        <button 
          className={`control-btn ${showUnitConverter ? 'active' : ''}`}
          onClick={() => setShowUnitConverter(!showUnitConverter)}
        >
          Convert
        </button>
        <button 
          className={`control-btn ${showConstants ? 'active' : ''}`}
          onClick={() => setShowConstants(!showConstants)}
        >
          Constants
        </button>
      </div>

      {showMemoryPanel && (
        <MemoryPanel 
          memory={state.memory}
          onMemoryAction={handleInput}
          onClose={() => setShowMemoryPanel(false)}
        />
      )}

      {showUnitConverter && (
        <UnitConverter 
          onClose={() => setShowUnitConverter(false)}
          onConvert={async (request) => {
            try {
              const response = await calculatorApi.convertUnit(request);
              if (response.success) {
                return response.result;
              }
              throw new Error(response.error);
            } catch (error) {
              console.error('Conversion failed:', error);
              throw error;
            }
          }}
        />
      )}

      {showConstants && (
        <div className="constants-panel">
          <div className="constants-header">
            <h3>Physical Constants</h3>
            <button onClick={() => setShowConstants(false)}>×</button>
          </div>
          <div className="constants-grid">
            {Object.entries(apiConstants).map(([key, value]) => (
              <button 
                key={key}
                className="constant-btn"
                onClick={() => handleInput(`CONST_${key}`)}
              >
                <span className="constant-name">{key}</span>
                <span className="constant-value">{formatNumber(value, 'scientific')}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <Keypad 
        onInput={handleInput}
        isShiftMode={state.isShiftMode}
      />
    </div>
  );
};

export default Calculator;