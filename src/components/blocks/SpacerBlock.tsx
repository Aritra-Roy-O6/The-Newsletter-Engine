import React from 'react';
import styled from '@emotion/styled';
import { BlockProps } from '../../types';

const SpacerContainer = styled.div`
  padding: 1rem;
  background-color: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
`;

const SpacerInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SpacerBlock: React.FC<BlockProps> = ({ id, content, onUpdate }) => {
  const height = content || '20';

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      onUpdate(id, value);
    }
  };

  return (
    <SpacerContainer>
      <SpacerInput
        type="text"
        value={height}
        onChange={handleHeightChange}
        placeholder="Enter height in pixels..."
      />
      <div style={{ height: `${height}px` }} />
    </SpacerContainer>
  );
};

export default SpacerBlock; 