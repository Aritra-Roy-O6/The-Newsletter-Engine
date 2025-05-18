import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { BlockProps } from '../../types';
import { useApp } from '../../context/AppContext';

const CountdownContainer = styled.div`
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
`;

const CountdownInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  margin-bottom: 0.5rem;
`;

const Timer = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #3b82f6;
`;

function getTimeLeft(target: string) {
  const diff = new Date(target).getTime() - Date.now();
  if (isNaN(diff) || diff < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

const CountdownBlock: React.FC<BlockProps> = ({ id, content, onUpdate }) => {
  const { state } = useApp();
  const isPreview = state.previewMode;
  const [target, setTarget] = useState(content || '');
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(target));

  useEffect(() => {
    if (!target) return;
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(target));
    }, 1000);
    return () => clearInterval(interval);
  }, [target]);

  useEffect(() => {
    setTimeLeft(getTimeLeft(target));
  }, [target]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTarget(e.target.value);
    onUpdate(id, e.target.value);
  };

  return (
    <CountdownContainer>
      {!isPreview && (
        <CountdownInput
          type="datetime-local"
          value={target}
          onChange={handleChange}
        />
      )}
      {target && (
        <Timer>
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </Timer>
      )}
      {!target && isPreview && <div style={{ color: '#888' }}>No countdown set.</div>}
    </CountdownContainer>
  );
};

export default CountdownBlock; 