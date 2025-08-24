import React from 'react';

interface DisplayProps {
  value: string;
  previousValue: string;
  operation: string;
  history: string[];
  memory: { [key: string]: number };
}

const Display: React.FC<DisplayProps> = ({ 
  value, 
  previousValue, 
  operation, 
  history,
  memory 
}) => {
  return (
    <div className="display">
      <div className="display-history">
        {history.slice(-3).map((entry, index) => (
          <div key={index} className="history-entry">
            {entry}
          </div>
        ))}
      </div>
      
      <div className="display-calculation">
        {previousValue && operation && (
          <div className="previous-calculation">
            {previousValue} {operation}
          </div>
        )}
      </div>
      
      <div className="display-main">
        {value}
      </div>
      
      <div className="display-status">
        <div className="memory-status">
          {Object.keys(memory).length > 0 && (
            <span className="memory-indicator">
              M: {Object.keys(memory).join(', ')}
            </span>
          )}
        </div>
        <div className="parentheses-count">
          {/* TODO: Add parentheses counter */}
        </div>
      </div>
    </div>
  );
};

export default Display;