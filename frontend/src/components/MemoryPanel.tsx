import React, { useState } from 'react';

interface MemoryPanelProps {
  memory: { [key: string]: number };
  onMemoryAction: (action: string) => void;
  onClose: () => void;
}

const MemoryPanel: React.FC<MemoryPanelProps> = ({ memory, onMemoryAction, onClose }) => {
  const [selectedSlot, setSelectedSlot] = useState('M1');

  const memorySlots = ['M1', 'M2', 'M3', 'M4', 'M5'];

  return (
    <div className="memory-panel">
      <div className="memory-header">
        <h3>Memory Functions</h3>
        <button onClick={onClose} className="close-btn">×</button>
      </div>
      
      <div className="memory-slots">
        {memorySlots.map(slot => (
          <div 
            key={slot} 
            className={`memory-slot ${selectedSlot === slot ? 'selected' : ''}`}
            onClick={() => setSelectedSlot(slot)}
          >
            <div className="slot-label">{slot}</div>
            <div className="slot-value">
              {memory[slot] !== undefined ? memory[slot].toString() : '0'}
            </div>
          </div>
        ))}
      </div>
      
      <div className="memory-actions">
        <button onClick={() => onMemoryAction('MS')} className="memory-btn">
          Store
        </button>
        <button onClick={() => onMemoryAction('MR')} className="memory-btn">
          Recall
        </button>
        <button onClick={() => onMemoryAction('M+')} className="memory-btn">
          Add
        </button>
        <button onClick={() => onMemoryAction('M-')} className="memory-btn">
          Subtract
        </button>
        <button onClick={() => onMemoryAction('MC')} className="memory-btn clear">
          Clear All
        </button>
      </div>
      
      <div className="memory-info">
        <p>Select a memory slot and use the action buttons to store, recall, or modify values.</p>
      </div>
    </div>
  );
};

export default MemoryPanel;