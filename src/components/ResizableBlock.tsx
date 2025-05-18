import React, { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { BlockConfig } from '../types';

const ResizableContainer = styled.div<{ config: BlockConfig }>`
  position: relative;
  width: ${props => props.config.width || '100%'};
  height: ${props => props.config.height || 'auto'};
  min-width: ${props => props.config.minWidth || '100px'};
  min-height: ${props => props.config.minHeight || '50px'};
  max-width: ${props => props.config.maxWidth || '100%'};
  max-height: ${props => props.config.maxHeight || 'none'};

  &:hover .resize-handle {
    opacity: 0.5;
  }
`;

const ResizeHandle = styled.div<{ position: string }>`
  position: absolute;
  background-color: ${props => props.theme.colors.primary};
  opacity: 0;
  transition: opacity 0.2s;

  ${props => {
    switch (props.position) {
      case 'right':
        return `
          right: -4px;
          top: 0;
          width: 8px;
          height: 100%;
          cursor: ew-resize;
        `;
      case 'bottom':
        return `
          bottom: -4px;
          left: 0;
          height: 8px;
          width: 100%;
          cursor: ns-resize;
        `;
      case 'corner':
        return `
          right: -4px;
          bottom: -4px;
          width: 12px;
          height: 12px;
          cursor: nwse-resize;
        `;
      default:
        return '';
    }
  }}
`;

interface ResizableBlockProps {
  children: React.ReactNode;
  config: BlockConfig;
  onConfigUpdate: (config: BlockConfig) => void;
}

const ResizableBlock: React.FC<ResizableBlockProps> = ({
  children,
  config,
  onConfigUpdate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });

  const handleMouseDown = (e: React.MouseEvent, position: string) => {
    e.preventDefault();
    setIsResizing(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setStartSize({ width: rect.width, height: rect.height });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const deltaX = e.clientX - startPos.x;
      const deltaY = e.clientY - startPos.y;

      const newConfig = { ...config };
      
      if (deltaX !== 0) {
        newConfig.width = `${Math.max(parseInt(config.minWidth || '100'), startSize.width + deltaX)}px`;
      }
      
      if (deltaY !== 0) {
        newConfig.height = `${Math.max(parseInt(config.minHeight || '50'), startSize.height + deltaY)}px`;
      }

      onConfigUpdate(newConfig);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, startPos, startSize, config, onConfigUpdate]);

  return (
    <ResizableContainer ref={containerRef} config={config}>
      {children}
      <ResizeHandle className="resize-handle" position="right" onMouseDown={(e) => handleMouseDown(e, 'right')} />
      <ResizeHandle className="resize-handle" position="bottom" onMouseDown={(e) => handleMouseDown(e, 'bottom')} />
      <ResizeHandle className="resize-handle" position="corner" onMouseDown={(e) => handleMouseDown(e, 'corner')} />
    </ResizableContainer>
  );
};

export default ResizableBlock; 