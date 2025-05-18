import React, { useState, useRef, useCallback } from 'react';
import styled from '@emotion/styled';
import { useApp } from '../context/AppContext';
import { Block, BlockType } from '../types';
import { useDroppable } from '@dnd-kit/core';
import { v4 as uuidv4 } from 'uuid';
import HeaderBlock from './blocks/HeaderBlock';
import ParagraphBlock from './blocks/ParagraphBlock';
import ImageBlock from './blocks/ImageBlock';
import ButtonBlock from './blocks/ButtonBlock';
import DividerBlock from './blocks/DividerBlock';
import FooterBlock from './blocks/FooterBlock';
import SocialBlock from './blocks/SocialBlock';
import SurveyBlock from './blocks/SurveyBlock';
import QuizBlock from './blocks/QuizBlock';
import SpacerBlock from './blocks/SpacerBlock';
import VideoBlock from './blocks/VideoBlock';
import CountdownBlock from './blocks/CountdownBlock';
import ProductBlock from './blocks/ProductBlock';
import MenuBlock from './blocks/MenuBlock';
import Toolbar from './Toolbar';

const CanvasContainer = styled.div<{ isPreview: boolean; backgroundColor?: string }>`
  flex: 1;
  background-color: ${props => props.backgroundColor || props.theme.colors.surface};
  overflow: hidden;
  height: 100%;
  width: 100%;
  position: relative;
  margin-top: 64px;
`;

// Device widths for preview and edit modes
const DEVICE_WIDTHS = {
  desktop: 1200,
  tablet: 800,
  mobile: 400,
};

const CanvasArea = styled.div<{
  canvasColor: string;
  device: 'desktop' | 'tablet' | 'mobile';
  isPreview: boolean;
}>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  overflow-x: auto;
  overflow-y: auto;
  background: ${props => props.canvasColor};
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: flex-start;

  & > .canvas-inner {
    position: relative;
    width: 100%;
    max-width: ${props => DEVICE_WIDTHS[props.device]}px;
    min-width: 200px;
    min-height: 800px;
    background: transparent;
    transition: max-width 0.2s;
    box-shadow: ${props => props.isPreview ? '0 0 0 1px #e5e7eb, 0 8px 32px rgba(0,0,0,0.08)' : 'none'};
    border-radius: 16px;
    overflow: visible;
    margin: 0 auto;
  }

  @media (max-width: 1300px) {
    & > .canvas-inner {
      min-width: 0;
      width: 100%;
      transform: none;
    }
  }
`;

const BlockWrapper = styled.div<{ isDragging?: boolean; isPreview?: boolean; position?: { top: number; left: number } }>`
  position: absolute;
  top: ${props => props.position?.top || 0}px;
  left: ${props => props.position?.left || 0}px;
  transition: ${props => props.isDragging ? 'none' : 'all 0.2s ease'};
  background: ${props => props.isPreview ? 'transparent' : props.theme.colors.surface};
  box-shadow: ${props => props.isPreview ? 'none' : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'};
  opacity: ${props => (props.isDragging ? 0.8 : 1)};
  z-index: ${props => (props.isDragging ? 100 : 1)};
  cursor: move;
  user-select: none;
  touch-action: none;
  border: ${props => props.isDragging ? '2px dashed ' + props.theme.colors.primary : 'none'};
  transform: translate3d(0, 0, 0);
  will-change: transform;
  min-width: 100px;
  min-height: 50px;

  &:hover {
    box-shadow: ${props => props.isPreview ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'};
  }

  &:hover .block-controls {
    opacity: ${props => props.isPreview ? '0' : '1'};
  }
`;

const BlockControls = styled.div`
  position: absolute;
  top: -40px;
  right: 0;
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: all 0.2s ease;
  z-index: 10;
  background: ${props => props.theme.colors.surface};
  padding: 0.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid ${props => props.theme.colors.surfaceBorder};
`;

const ControlButton = styled.button`
  padding: 0.5rem;
  background-color: white;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  cursor: pointer;
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;

  &:hover {
    background-color: ${props => props.theme.colors.primary};
    color: white;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const DragHandle = styled.div<{ position: string }>`
  position: absolute;
  background: transparent;
  z-index: 10;
  cursor: move;
  pointer-events: auto;
  transition: background 0.2s, border-color 0.2s;
  ${props => {
    switch (props.position) {
      case 'top':
        return 'top: 0; left: 0; right: 0; height: 10px; border-top: 2px solid transparent;';
      case 'bottom':
        return 'bottom: 0; left: 0; right: 0; height: 10px; border-bottom: 2px solid transparent;';
      case 'left':
        return 'top: 0; left: 0; bottom: 0; width: 10px; border-left: 2px solid transparent;';
      case 'right':
        return 'top: 0; right: 0; bottom: 0; width: 10px; border-right: 2px solid transparent;';
      default:
        return '';
    }
  }}
  &:hover {
    background: rgba(99, 102, 241, 0.08);
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Canvas: React.FC = () => {
  const { state, dispatch } = useApp();
  const { blocks, previewMode, canvasColor, devicePreview, canvasGradient } = state;
  const [draggingBlockId, setDraggingBlockId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const { setNodeRef } = useDroppable({
    id: 'canvas',
  });

  // Start dragging
  const handleMouseDown = (e: React.MouseEvent, blockId: string) => {
    if (previewMode) return;
    const block = blocks.find(b => b.id === blockId);
    if (!block || !canvasRef.current) return;
    // Use the parent BlockWrapper for correct offset
    const blockElement = (e.currentTarget as HTMLElement).parentElement as HTMLElement;
    if (!blockElement) return;
    const blockRect = blockElement.getBoundingClientRect();
    const canvasRect = canvasRef.current.getBoundingClientRect();
    setDraggingBlockId(blockId);
    setDragOffset({
      x: e.clientX - blockRect.left,
      y: e.clientY - blockRect.top
    });
    document.body.style.cursor = 'grabbing';
  };

  // Dragging
  React.useEffect(() => {
    if (!draggingBlockId) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const block = blocks.find(b => b.id === draggingBlockId);
      if (!block) return;
      // Calculate scale based on device preview
      const containerWidth = previewMode ? window.innerWidth - 40 : window.innerWidth - 300;
      const scale = Math.min(1, containerWidth / DEVICE_WIDTHS[devicePreview]);
      // No clamping, just basic drag
      const newLeft = (e.clientX - canvasRect.left - dragOffset.x) / scale;
      const newTop = (e.clientY - canvasRect.top - dragOffset.y) / scale;
      dispatch({
        type: 'UPDATE_BLOCK_POSITION',
        payload: {
          id: draggingBlockId,
          position: {
            left: newLeft,
            top: newTop
          }
        }
      });
    };
    const handleMouseUp = () => {
      setDraggingBlockId(null);
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingBlockId, dragOffset, blocks, dispatch, previewMode, devicePreview]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('text/plain') as BlockType;
    if (!type || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newBlock = {
      id: uuidv4(),
      type,
      content: '',
      position: {
        top: y - 20, // Subtract padding
        left: x - 20 // Subtract padding
      }
    };

    dispatch({ type: 'ADD_BLOCK', payload: newBlock });
  }, [dispatch]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleBlockUpdate = (id: string, content: string) => {
    dispatch({ type: 'UPDATE_BLOCK', payload: { id, content } });
  };

  const handleBlockRemove = (id: string) => {
    dispatch({ type: 'REMOVE_BLOCK', payload: id });
  };

  const handleBlockConfigUpdate = (id: string, config: any) => {
    dispatch({ type: 'UPDATE_BLOCK_CONFIG', payload: { id, config } });
  };

  const handleBlockStyleUpdate = (id: string, style: any) => {
    dispatch({ type: 'UPDATE_BLOCK_STYLE', payload: { id, style } });
  };

  const renderBlock = (block: Block) => {
    const commonProps = {
      id: block.id,
      content: block.content,
      onUpdate: handleBlockUpdate,
      config: block.config,
      onConfigUpdate: handleBlockConfigUpdate,
      style: block.style,
      onStyleUpdate: handleBlockStyleUpdate,
    };

    switch (block.type) {
      case 'header':
        return <HeaderBlock {...commonProps} />;
      case 'paragraph':
        return <ParagraphBlock {...commonProps} />;
      case 'button':
        return <ButtonBlock {...commonProps} />;
      case 'image':
        return <ImageBlock {...commonProps} />;
      case 'divider':
        return <DividerBlock {...commonProps} />;
      case 'footer':
        return <FooterBlock {...commonProps} />;
      case 'social':
        return <SocialBlock {...commonProps} />;
      case 'survey':
        return <SurveyBlock {...commonProps} />;
      case 'quiz':
        return <QuizBlock {...commonProps} />;
      case 'video':
        return <VideoBlock {...commonProps} />;
      case 'countdown':
        return <CountdownBlock {...commonProps} />;
      case 'product':
        return <ProductBlock {...commonProps} />;
      case 'menu':
        return <MenuBlock {...commonProps} />;
      case 'spacer':
        return <SpacerBlock {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <CanvasContainer isPreview={previewMode} ref={canvasRef}>
      <CanvasArea
        ref={setNodeRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        canvasColor={canvasGradient ? `linear-gradient(${canvasGradient.direction}, ${canvasGradient.color1}, ${canvasGradient.color2})` : (canvasColor || '#fff')}
        device={devicePreview}
        isPreview={previewMode}
      >
        <div className="canvas-inner">
          {blocks.map((block) => (
            <BlockWrapper
              key={block.id}
              isDragging={draggingBlockId === block.id}
              isPreview={previewMode}
              position={block.position}
              data-block-id={block.id}
            >
              {!previewMode && (
                <>
                  <DragHandle position="top" onMouseDown={e => handleMouseDown(e, block.id)} />
                  <DragHandle position="bottom" onMouseDown={e => handleMouseDown(e, block.id)} />
                  <DragHandle position="left" onMouseDown={e => handleMouseDown(e, block.id)} />
                  <DragHandle position="right" onMouseDown={e => handleMouseDown(e, block.id)} />
                  <BlockControls className="block-controls">
                    <ControlButton onClick={() => handleBlockRemove(block.id)}>×</ControlButton>
                  </BlockControls>
                </>
              )}
              {renderBlock(block)}
            </BlockWrapper>
          ))}
        </div>
      </CanvasArea>
      <Toolbar />
    </CanvasContainer>
  );
};

export default Canvas;