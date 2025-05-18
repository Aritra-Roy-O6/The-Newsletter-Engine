import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import styled from '@emotion/styled';
import { useApp } from '../context/AppContext';
import { v4 as uuidv4 } from 'uuid';
import { BlockType } from '../types';

const SidebarContainer = styled.div`
  width: 300px;
  background-color: ${props => props.theme.colors.surface};
  border-right: 1px solid ${props => props.theme.colors.surfaceBorder};
  padding: 0;
  height: 100%;
  overflow-y: auto;
  margin-top: 64px;
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.surfaceText};
  padding: 1.5rem 1.5rem 0.75rem 1.5rem;
  letter-spacing: -0.025em;
`;

const TabsBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  background: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.surfaceBorder};
  padding: 0 1rem;
  gap: 0.5rem;
`;

const Tab = styled.button<{ expanded: boolean }>`
  height: 40px;
  min-width: ${props => (props.expanded ? '120px' : '0.5px')};
  width: ${props => (props.expanded ? 'auto' : '0.5px')};
  background: ${props => props.expanded ? props.theme.colors.primary : props.theme.colors.surface};
  color: ${props => props.expanded ? 'white' : 'transparent'};
  border: 1px solid ${props => props.expanded ? props.theme.colors.primary : props.theme.colors.surfaceBorder};
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  position: relative;
  overflow: hidden;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
  padding: 0 1rem;
  white-space: nowrap;
  margin: 0.5rem 0;
  box-sizing: border-box;
  z-index: 2;
  box-shadow: ${props => props.expanded ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none'};

  span {
    opacity: ${props => (props.expanded ? 1 : 0)};
    transition: opacity 0.2s;
    display: inline-block;
  }

  &:hover {
    min-width: 120px;
    color: ${props => props.expanded ? 'white' : props.theme.colors.primary};
    background: ${props => props.expanded ? props.theme.colors.primary : props.theme.colors.surface};
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:hover span {
    opacity: 1;
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
`;

const BlocksPanel = styled.div`
  padding: 1.5rem;
  width: 100%;
`;

const BlockItem = styled.div`
  background: ${props => props.theme.colors.surface};
  padding: 1rem;
  margin-bottom: 0.75rem;
  border: 1px solid ${props => props.theme.colors.surfaceBorder};
  border-radius: 8px;
  cursor: grab;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transform: translateY(-1px);
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.surfaceHover};
  }

  &:active {
    cursor: grabbing;
    background: ${props => props.theme.colors.surfaceActive};
  }
`;

const BlockIcon = styled.span`
  font-size: 1.25rem;
  color: ${props => props.theme.colors.primary};
`;

const BlockLabel = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.surfaceText};
  font-weight: 500;
`;

const blockCategories = [
  {
    key: 'basic',
    title: 'Basic',
    blocks: [
      { id: 'header' as BlockType, label: 'Header Block', icon: '📝' },
      { id: 'paragraph' as BlockType, label: 'Paragraph Block', icon: '📄' },
      { id: 'image' as BlockType, label: 'Image Block', icon: '🖼️' },
      { id: 'button' as BlockType, label: 'Button Block', icon: '🔘' },
      { id: 'divider' as BlockType, label: 'Divider', icon: '➖' },
    ],
  },
  {
    key: 'interactive',
    title: 'Interactive',
    blocks: [
      { id: 'social' as BlockType, label: 'Social Media', icon: '🔗' },
      { id: 'survey' as BlockType, label: 'Survey', icon: '📊' },
      { id: 'quiz' as BlockType, label: 'Quiz', icon: '❓' },
    ],
  },
  {
    key: 'advanced',
    title: 'Advance',
    blocks: [
      { id: 'video' as BlockType, label: 'Video', icon: '🎥' },
      { id: 'countdown' as BlockType, label: 'Countdown', icon: '⏰' },
      { id: 'product' as BlockType, label: 'Product', icon: '🛍️' },
      { id: 'menu' as BlockType, label: 'Menu', icon: '🍽️' },
    ],
  },
];

const DraggableBlock = ({ id, label, icon }: { id: BlockType; label: string; icon: string }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <BlockItem ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <BlockIcon>{icon}</BlockIcon>
      <BlockLabel>{label}</BlockLabel>
    </BlockItem>
  );
};

const getNextBlockPosition = (blocksLength: number) => {
  const offset = 40;
  return {
    top: 20 + blocksLength * offset,
    left: 20 + blocksLength * offset,
  };
};

const Sidebar = () => {
  const { state, dispatch } = useApp();
  const [selectedTab, setSelectedTab] = useState('basic');
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const handleBlockAdd = (type: BlockType) => {
    const newBlock = {
      id: uuidv4(),
      type,
      content: '',
      position: getNextBlockPosition(state.blocks.length)
    };
    dispatch({ type: 'ADD_BLOCK', payload: newBlock });
  };

  const currentCategory = blockCategories.find(cat => cat.key === selectedTab);

  return (
    <SidebarContainer>
      <SidebarHeader>Elements</SidebarHeader>
      <TabsBar>
        {blockCategories.map(cat => {
          const expanded = hoveredTab === cat.key || (!hoveredTab && selectedTab === cat.key);
          return (
            <Tab
              key={cat.key}
              expanded={expanded}
              onClick={() => setSelectedTab(cat.key)}
              onMouseEnter={() => setHoveredTab(cat.key)}
              onMouseLeave={() => setHoveredTab(null)}
              title={cat.title}
            >
              <span>{cat.title}</span>
            </Tab>
          );
        })}
      </TabsBar>
      <BlocksPanel>
        <div>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{currentCategory?.title}</h3>
          {currentCategory?.blocks.map((block) => (
            <DraggableBlock
              key={block.id}
              id={block.id}
              label={block.label}
              icon={block.icon}
            />
          ))}
        </div>
      </BlocksPanel>
    </SidebarContainer>
  );
};

export default Sidebar; 