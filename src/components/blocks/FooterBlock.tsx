import React from 'react';
import styled from '@emotion/styled';
import { BlockProps, BlockStyle } from '../../types';
import ResizableBlock from '../ResizableBlock';
import TextFormattingToolbar from '../TextFormattingToolbar';
import { useApp } from '../../context/AppContext';

const FooterContainer = styled.div<{ blockStyle: BlockStyle }>`
  padding: 1rem;
  background-color: ${props => props.blockStyle?.backgroundColor || props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  color: ${props => props.blockStyle?.color || props.theme.colors.text};
  font-family: ${props => props.blockStyle?.fontFamily || 'inherit'};
  font-size: ${props => props.blockStyle?.fontSize || '0.875rem'};
  font-weight: ${props => props.blockStyle?.fontWeight || 'normal'};
  font-style: ${props => props.blockStyle?.fontStyle || 'normal'};
  text-decoration: ${props => props.blockStyle?.textDecoration || 'none'};
  text-align: ${props => props.blockStyle?.textAlign || 'center'};
`;

const FooterTextarea = styled.textarea<{ blockStyle: BlockStyle }>`
  width: 100%;
  min-height: 60px;
  background: transparent;
  border: none;
  outline: none;
  font-family: ${props => props.blockStyle?.fontFamily || 'inherit'};
  font-size: ${props => props.blockStyle?.fontSize || '0.875rem'};
  font-weight: ${props => props.blockStyle?.fontWeight || 'normal'};
  font-style: ${props => props.blockStyle?.fontStyle || 'normal'};
  text-decoration: ${props => props.blockStyle?.textDecoration || 'none'};
  color: ${props => props.blockStyle?.color || 'inherit'};
  text-align: ${props => props.blockStyle?.textAlign || 'inherit'};
  resize: vertical;
`;

const PreviewContainer = styled.div<{ config: any }>`
  width: ${props => props.config.width || '100%'};
  height: ${props => props.config.height || 'auto'};
  min-width: ${props => props.config.minWidth || '100px'};
  min-height: ${props => props.config.minHeight || '50px'};
  max-width: ${props => props.config.maxWidth || '100%'};
  max-height: ${props => props.config.maxHeight || 'none'};
`;

const FooterBlock: React.FC<BlockProps> = ({ id, content, onUpdate, config, onConfigUpdate, style, onStyleUpdate }) => {
  const { state } = useApp();
  const isPreviewMode = state.previewMode;

  const handleStyleUpdate = (newStyle: BlockStyle) => {
    onStyleUpdate?.(id, newStyle);
  };

  if (isPreviewMode) {
    return (
      <PreviewContainer config={config || {}}>
        <FooterContainer blockStyle={style || {}}>
          {content}
        </FooterContainer>
      </PreviewContainer>
    );
  }

  return (
    <ResizableBlock config={config || {}} onConfigUpdate={(newConfig) => onConfigUpdate?.(id, newConfig)}>
      <FooterContainer blockStyle={style || {}}>
        <TextFormattingToolbar style={style || {}} onStyleUpdate={handleStyleUpdate} />
        <FooterTextarea
          blockStyle={style || {}}
          value={content}
          onChange={(e) => onUpdate(id, e.target.value)}
          placeholder="Enter footer text..."
        />
      </FooterContainer>
    </ResizableBlock>
  );
};

export default FooterBlock; 