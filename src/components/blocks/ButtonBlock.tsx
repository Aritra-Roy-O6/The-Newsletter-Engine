import React from 'react';
import styled from '@emotion/styled';
import { BlockProps, BlockStyle } from '../../types';
import ResizableBlock from '../ResizableBlock';
import TextFormattingToolbar from '../TextFormattingToolbar';
import { useApp } from '../../context/AppContext';

const ButtonContainer = styled.div<{ blockStyle: BlockStyle }>`
  padding: 1rem;
  background-color: ${props => props.blockStyle?.backgroundColor || props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  text-align: ${props => props.blockStyle?.textAlign || 'center'};
`;

const StyledButton = styled.button<{ blockStyle: BlockStyle }>`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.blockStyle?.backgroundColor || props.theme.colors.primary};
  color: ${props => props.blockStyle?.color || 'white'};
  border: none;
  border-radius: 4px;
  font-family: ${props => props.blockStyle?.fontFamily || 'inherit'};
  font-size: ${props => props.blockStyle?.fontSize || '1rem'};
  font-weight: ${props => props.blockStyle?.fontWeight || 'bold'};
  font-style: ${props => props.blockStyle?.fontStyle || 'normal'};
  text-decoration: ${props => props.blockStyle?.textDecoration || 'none'};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.theme.colors.hover};
  }
`;

const ButtonInput = styled.input<{ blockStyle: BlockStyle }>`
  width: 100%;
  padding: 0.5rem;
  background: transparent;
  border: none;
  outline: none;
  font-family: ${props => props.blockStyle?.fontFamily || 'inherit'};
  font-size: ${props => props.blockStyle?.fontSize || '1rem'};
  font-weight: ${props => props.blockStyle?.fontWeight || 'bold'};
  font-style: ${props => props.blockStyle?.fontStyle || 'normal'};
  text-decoration: ${props => props.blockStyle?.textDecoration || 'none'};
  color: ${props => props.blockStyle?.color || 'inherit'};
  text-align: ${props => props.blockStyle?.textAlign || 'inherit'};
`;

const PreviewContainer = styled.div<{ config: any }>`
  width: ${props => props.config.width || '100%'};
  height: ${props => props.config.height || 'auto'};
  min-width: ${props => props.config.minWidth || '100px'};
  min-height: ${props => props.config.minHeight || '50px'};
  max-width: ${props => props.config.maxWidth || '100%'};
  max-height: ${props => props.config.maxHeight || 'none'};
`;

const ButtonBlock: React.FC<BlockProps> = ({ id, content, onUpdate, config, onConfigUpdate, style, onStyleUpdate }) => {
  const { state } = useApp();
  const isPreviewMode = state.previewMode;

  const handleStyleUpdate = (newStyle: BlockStyle) => {
    onStyleUpdate?.(id, newStyle);
  };

  if (isPreviewMode) {
    return (
      <PreviewContainer config={config || {}}>
        <ButtonContainer blockStyle={style || {}}>
          <StyledButton blockStyle={style || {}}>
            {content}
          </StyledButton>
        </ButtonContainer>
      </PreviewContainer>
    );
  }

  return (
    <ResizableBlock config={config || {}} onConfigUpdate={(newConfig) => onConfigUpdate?.(id, newConfig)}>
      <ButtonContainer blockStyle={style || {}}>
        <TextFormattingToolbar style={style || {}} onStyleUpdate={handleStyleUpdate} />
        <ButtonInput
          blockStyle={style || {}}
          value={content}
          onChange={(e) => onUpdate(id, e.target.value)}
          placeholder="Enter button text..."
        />
      </ButtonContainer>
    </ResizableBlock>
  );
};

export default ButtonBlock; 