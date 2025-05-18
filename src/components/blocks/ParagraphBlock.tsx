import React, { useState } from 'react';
import styled from '@emotion/styled';
import { BlockProps, BlockStyle } from '../../types';
import ResizableBlock from '../ResizableBlock';
import TextFormattingToolbar from '../TextFormattingToolbar';
import { useApp } from '../../context/AppContext';

const ParagraphContainer = styled.div<{ blockStyle: BlockStyle; height?: string }>`
  width: 100%;
  padding: 1rem;
  background-color: ${props => props.blockStyle?.backgroundColor || props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  color: ${props => props.blockStyle?.color || props.theme.colors.text};
  font-family: ${props => props.blockStyle?.fontFamily || 'inherit'};
  font-size: ${props => props.blockStyle?.fontSize || '1rem'};
  font-weight: ${props => props.blockStyle?.fontWeight || 'normal'};
  font-style: ${props => props.blockStyle?.fontStyle || 'normal'};
  text-decoration: ${props => props.blockStyle?.textDecoration || 'none'};
  text-align: ${props => props.blockStyle?.textAlign || 'left'};
  line-height: 1.5;
  height: ${props => props.height || 'auto'};
  word-break: break-word;
  overflow-wrap: anywhere;
`;

const ParagraphTextarea = styled.textarea<{ blockStyle: BlockStyle; height?: string }>`
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-family: ${props => props.blockStyle?.fontFamily || 'inherit'};
  font-size: ${props => props.blockStyle?.fontSize || '1rem'};
  font-weight: ${props => props.blockStyle?.fontWeight || 'normal'};
  font-style: ${props => props.blockStyle?.fontStyle || 'normal'};
  text-decoration: ${props => props.blockStyle?.textDecoration || 'none'};
  color: ${props => props.blockStyle?.color || 'inherit'};
  text-align: ${props => props.blockStyle?.textAlign || 'inherit'};
  resize: none;
`;

const PreviewContainer = styled.div<{ config: any }>`
  width: ${props => props.config.width || '100%'};
  height: ${props => props.config.height || 'auto'};
  min-width: ${props => props.config.minWidth || '100px'};
  min-height: ${props => props.config.minHeight || '50px'};
  max-width: ${props => props.config.maxWidth || '100%'};
  max-height: ${props => props.config.maxHeight || 'none'};
  overflow: auto;
  display: flex;
  flex-direction: column;
`;

const ParagraphBlock: React.FC<BlockProps> = ({ id, content, onUpdate, config, onConfigUpdate, style, onStyleUpdate }) => {
  const { state } = useApp();
  const isPreviewMode = state.previewMode;
  const [hovered, setHovered] = useState(false);

  const handleStyleUpdate = (newStyle: BlockStyle) => {
    onStyleUpdate?.(id, newStyle);
  };

  if (isPreviewMode) {
    return (
      <PreviewContainer config={config || {}}>
        <ParagraphContainer blockStyle={style || {}} height={config?.height}>
          {content}
        </ParagraphContainer>
      </PreviewContainer>
    );
  }

  return (
    <ResizableBlock config={config || {}} onConfigUpdate={(newConfig) => onConfigUpdate?.(id, newConfig)}>
      <ParagraphContainer
        blockStyle={style || {}}
        height={config?.height}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ position: 'relative' }}
      >
        {hovered && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2 }}>
            <TextFormattingToolbar style={style || {}} onStyleUpdate={handleStyleUpdate} />
          </div>
        )}
        <ParagraphTextarea
          blockStyle={style || {}}
          value={content}
          onChange={(e) => onUpdate(id, e.target.value)}
          placeholder="Enter paragraph text..."
          height={config?.height}
          style={{ marginTop: hovered ? '3.2rem' : 0, transition: 'margin-top 0.2s' }}
        />
      </ParagraphContainer>
    </ResizableBlock>
  );
};

export default ParagraphBlock; 