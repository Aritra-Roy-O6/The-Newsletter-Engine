import React from 'react';
import styled from '@emotion/styled';
import { BlockProps } from '../../types';

const DividerContainer = styled.div`
  padding: 1rem;
`;

const DividerLine = styled.hr`
  border: none;
  border-top: 2px solid #e5e7eb;
  margin: 0;
`;

const DividerBlock: React.FC<BlockProps> = () => {
  return (
    <DividerContainer>
      <DividerLine />
    </DividerContainer>
  );
};

export default DividerBlock; 