'use client';

import { useState, useCallback } from 'react';
import { sounds } from '@/lib/sounds';

type Operator = '+' | '-' | '×' | '÷' | null;

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [expression, setExpression] = useState('');

  const inputDigit = useCallback((digit: string) => {
    sounds.keypress();
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  }, [display, waitingForOperand]);

  const inputDecimal = useCallback(() => {
    sounds.keypress();
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  }, [display, waitingForOperand]);

  const clear = useCallback(() => {
    sounds.click();
    setDisplay('0');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
    setExpression('');
  }, []);

  const toggleSign = useCallback(() => {
    sounds.click();
    const value = parseFloat(display);
    setDisplay(String(-value));
  }, [display]);

  const percentage = useCallback(() => {
    sounds.click();
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  }, [display]);

  const calculate = useCallback((a: number, b: number, op: Operator): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 0;
      default: return b;
    }
  }, []);

  const performOperation = useCallback((nextOperator: Operator) => {
    sounds.click();
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
      setExpression(`${display} ${nextOperator}`);
    } else if (operator) {
      const result = calculate(previousValue, inputValue, operator);
      setPreviousValue(result);
      setDisplay(String(result));
      setExpression(`${result} ${nextOperator}`);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  }, [display, previousValue, operator, calculate]);

  const handleEquals = useCallback(() => {
    sounds.click();
    if (previousValue === null || operator === null) return;

    const inputValue = parseFloat(display);
    const result = calculate(previousValue, inputValue, operator);

    setDisplay(String(result));
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(true);
    setExpression(`${previousValue} ${operator} ${inputValue} =`);
  }, [display, previousValue, operator, calculate]);

  const formatDisplay = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '0';
    if (value.endsWith('.')) return value;
    if (value.includes('.') && value.endsWith('0')) return value;
    if (Math.abs(num) > 999999999999) return num.toExponential(6);
    return value;
  };

  const buttonStyle = (type: 'number' | 'operator' | 'function'): React.CSSProperties => ({
    flex: 1,
    height: '52px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '18px',
    fontWeight: type === 'operator' ? 600 : 400,
    cursor: 'pointer',
    transition: 'background 0.1s, transform 0.05s',
    fontFamily: "'Ubuntu', sans-serif",
    ...(type === 'number' ? { background: '#3a3a3e', color: '#ffffff' } :
      type === 'operator' ? { background: '#E95420', color: '#ffffff' } :
      { background: '#4a4a4e', color: '#ffffff' }),
  });

  const handleButtonHover = (e: React.MouseEvent, type: 'number' | 'operator' | 'function') => {
    const el = e.currentTarget as HTMLElement;
    if (type === 'number') el.style.background = '#4a4a4e';
    else if (type === 'operator') el.style.background = '#f0652f';
    else el.style.background = '#5a5a5e';
  };

  const handleButtonLeave = (e: React.MouseEvent, type: 'number' | 'operator' | 'function') => {
    const el = e.currentTarget as HTMLElement;
    if (type === 'number') el.style.background = '#3a3a3e';
    else if (type === 'operator') el.style.background = '#E95420';
    else el.style.background = '#4a4a4e';
  };

  const handleButtonDown = (e: React.MouseEvent) => {
    (e.currentTarget as HTMLElement).style.transform = 'scale(0.95)';
  };

  const handleButtonUp = (e: React.MouseEvent) => {
    (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
  };

  return (
    <div className="w-full h-full flex flex-col" style={{ background: '#222226', color: '#ffffff' }}>
      {/* Display */}
      <div
        className="flex-shrink-0"
        style={{
          padding: '16px 20px 12px',
          background: '#1d1d20',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div
          className="ubuntu-text-select"
          style={{
            fontSize: '12px',
            color: '#929299',
            textAlign: 'right',
            height: '18px',
            overflow: 'hidden',
          }}
        >
          {expression}
        </div>
        <div
          className="ubuntu-text-select"
          style={{
            fontSize: display.length > 10 ? '28px' : display.length > 7 ? '34px' : '42px',
            fontWeight: 300,
            textAlign: 'right',
            lineHeight: 1.2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {formatDisplay(display)}
        </div>
      </div>

      {/* Buttons */}
      <div
        className="flex-1 flex flex-col gap-2"
        style={{ padding: '12px' }}
      >
        {/* Row 1: C, ±, %, ÷ */}
        <div className="flex gap-2">
          <button
            onClick={clear}
            style={buttonStyle('function')}
            onMouseEnter={e => handleButtonHover(e, 'function')}
            onMouseLeave={e => handleButtonLeave(e, 'function')}
            onMouseDown={handleButtonDown}
            onMouseUp={handleButtonUp}
          >
            C
          </button>
          <button
            onClick={toggleSign}
            style={buttonStyle('function')}
            onMouseEnter={e => handleButtonHover(e, 'function')}
            onMouseLeave={e => handleButtonLeave(e, 'function')}
            onMouseDown={handleButtonDown}
            onMouseUp={handleButtonUp}
          >
            ±
          </button>
          <button
            onClick={percentage}
            style={buttonStyle('function')}
            onMouseEnter={e => handleButtonHover(e, 'function')}
            onMouseLeave={e => handleButtonLeave(e, 'function')}
            onMouseDown={handleButtonDown}
            onMouseUp={handleButtonUp}
          >
            %
          </button>
          <button
            onClick={() => performOperation('÷')}
            style={buttonStyle('operator')}
            onMouseEnter={e => handleButtonHover(e, 'operator')}
            onMouseLeave={e => handleButtonLeave(e, 'operator')}
            onMouseDown={handleButtonDown}
            onMouseUp={handleButtonUp}
          >
            ÷
          </button>
        </div>

        {/* Row 2: 7, 8, 9, × */}
        <div className="flex gap-2">
          <button onClick={() => inputDigit('7')} style={buttonStyle('number')} onMouseEnter={e => handleButtonHover(e, 'number')} onMouseLeave={e => handleButtonLeave(e, 'number')} onMouseDown={handleButtonDown} onMouseUp={handleButtonUp}>7</button>
          <button onClick={() => inputDigit('8')} style={buttonStyle('number')} onMouseEnter={e => handleButtonHover(e, 'number')} onMouseLeave={e => handleButtonLeave(e, 'number')} onMouseDown={handleButtonDown} onMouseUp={handleButtonUp}>8</button>
          <button onClick={() => inputDigit('9')} style={buttonStyle('number')} onMouseEnter={e => handleButtonHover(e, 'number')} onMouseLeave={e => handleButtonLeave(e, 'number')} onMouseDown={handleButtonDown} onMouseUp={handleButtonUp}>9</button>
          <button onClick={() => performOperation('×')} style={buttonStyle('operator')} onMouseEnter={e => handleButtonHover(e, 'operator')} onMouseLeave={e => handleButtonLeave(e, 'operator')} onMouseDown={handleButtonDown} onMouseUp={handleButtonUp}>×</button>
        </div>

        {/* Row 3: 4, 5, 6, − */}
        <div className="flex gap-2">
          <button onClick={() => inputDigit('4')} style={buttonStyle('number')} onMouseEnter={e => handleButtonHover(e, 'number')} onMouseLeave={e => handleButtonLeave(e, 'number')} onMouseDown={handleButtonDown} onMouseUp={handleButtonUp}>4</button>
          <button onClick={() => inputDigit('5')} style={buttonStyle('number')} onMouseEnter={e => handleButtonHover(e, 'number')} onMouseLeave={e => handleButtonLeave(e, 'number')} onMouseDown={handleButtonDown} onMouseUp={handleButtonUp}>5</button>
          <button onClick={() => inputDigit('6')} style={buttonStyle('number')} onMouseEnter={e => handleButtonHover(e, 'number')} onMouseLeave={e => handleButtonLeave(e, 'number')} onMouseDown={handleButtonDown} onMouseUp={handleButtonUp}>6</button>
          <button onClick={() => performOperation('-')} style={buttonStyle('operator')} onMouseEnter={e => handleButtonHover(e, 'operator')} onMouseLeave={e => handleButtonLeave(e, 'operator')} onMouseDown={handleButtonDown} onMouseUp={handleButtonUp}>−</button>
        </div>

        {/* Row 4: 1, 2, 3, + */}
        <div className="flex gap-2">
          <button onClick={() => inputDigit('1')} style={buttonStyle('number')} onMouseEnter={e => handleButtonHover(e, 'number')} onMouseLeave={e => handleButtonLeave(e, 'number')} onMouseDown={handleButtonDown} onMouseUp={handleButtonUp}>1</button>
          <button onClick={() => inputDigit('2')} style={buttonStyle('number')} onMouseEnter={e => handleButtonHover(e, 'number')} onMouseLeave={e => handleButtonLeave(e, 'number')} onMouseDown={handleButtonDown} onMouseUp={handleButtonUp}>2</button>
          <button onClick={() => inputDigit('3')} style={buttonStyle('number')} onMouseEnter={e => handleButtonHover(e, 'number')} onMouseLeave={e => handleButtonLeave(e, 'number')} onMouseDown={handleButtonDown} onMouseUp={handleButtonUp}>3</button>
          <button onClick={() => performOperation('+')} style={buttonStyle('operator')} onMouseEnter={e => handleButtonHover(e, 'operator')} onMouseLeave={e => handleButtonLeave(e, 'operator')} onMouseDown={handleButtonDown} onMouseUp={handleButtonUp}>+</button>
        </div>

        {/* Row 5: 0 (wide), ., = */}
        <div className="flex gap-2">
          <button
            onClick={() => inputDigit('0')}
            style={{ ...buttonStyle('number'), flex: 2 }}
            onMouseEnter={e => handleButtonHover(e, 'number')}
            onMouseLeave={e => handleButtonLeave(e, 'number')}
            onMouseDown={handleButtonDown}
            onMouseUp={handleButtonUp}
          >
            0
          </button>
          <button
            onClick={inputDecimal}
            style={buttonStyle('number')}
            onMouseEnter={e => handleButtonHover(e, 'number')}
            onMouseLeave={e => handleButtonLeave(e, 'number')}
            onMouseDown={handleButtonDown}
            onMouseUp={handleButtonUp}
          >
            .
          </button>
          <button
            onClick={handleEquals}
            style={buttonStyle('operator')}
            onMouseEnter={e => handleButtonHover(e, 'operator')}
            onMouseLeave={e => handleButtonLeave(e, 'operator')}
            onMouseDown={handleButtonDown}
            onMouseUp={handleButtonUp}
          >
            =
          </button>
        </div>
      </div>
    </div>
  );
}
