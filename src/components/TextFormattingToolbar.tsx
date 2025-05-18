import React from 'react';
import styled from '@emotion/styled';
import { BlockStyle } from '../types';

const ToolbarContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  max-width: 100%;
  word-break: break-word;
`;

const ToolbarButton = styled.button<{ active?: boolean }>`
  padding: 0.25rem 0.5rem;
  background-color: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;

  &:hover {
    background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.hover};
    color: white;
  }
`;

const Select = styled.select`
  padding: 0.25rem 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
`;

const ColorInput = styled.input`
  width: 30px;
  height: 30px;
  padding: 0;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  cursor: pointer;
`;

interface TextFormattingToolbarProps {
  style: BlockStyle;
  onStyleUpdate: (style: BlockStyle) => void;
}

const TextFormattingToolbar: React.FC<TextFormattingToolbarProps> = ({
  style,
  onStyleUpdate,
}) => {
  const handleStyleChange = (property: keyof BlockStyle, value: string) => {
    const newStyle = { ...style, [property]: value };
    onStyleUpdate(newStyle);
  };

  const toggleStyle = (property: keyof BlockStyle, value: string) => {
    const currentValue = style[property];
    const newStyle = {
      ...style,
      [property]: currentValue === value ? 'normal' : value,
    };
    onStyleUpdate(newStyle);
  };

  return (
    <ToolbarContainer>
      <Select
        value={style.fontFamily || 'Arial'}
        onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
      >
        <option value="Arial">Arial</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Helvetica">Helvetica</option>
        <option value="Georgia">Georgia</option>
        <option value="Courier New">Courier New</option>
      </Select>

      <Select
        value={style.fontSize || '16px'}
        onChange={(e) => handleStyleChange('fontSize', e.target.value)}
      >
        <option value="12px">12px</option>
        <option value="14px">14px</option>
        <option value="16px">16px</option>
        <option value="18px">18px</option>
        <option value="20px">20px</option>
        <option value="24px">24px</option>
        <option value="28px">28px</option>
        <option value="32px">32px</option>
      </Select>

      <ToolbarButton
        active={style.fontWeight === 'bold'}
        onClick={() => toggleStyle('fontWeight', 'bold')}
      >
        B
      </ToolbarButton>

      <ToolbarButton
        active={style.fontStyle === 'italic'}
        onClick={() => toggleStyle('fontStyle', 'italic')}
      >
        I
      </ToolbarButton>

      <ToolbarButton
        active={style.textDecoration === 'underline'}
        onClick={() => toggleStyle('textDecoration', 'underline')}
      >
        U
      </ToolbarButton>

      <Select
        value={style.textAlign || 'left'}
        onChange={(e) => handleStyleChange('textAlign', e.target.value)}
      >
        <option value="left">Left</option>
        <option value="center">Center</option>
        <option value="right">Right</option>
      </Select>

      <ColorInput
        type="color"
        value={style.color || '#000000'}
        onChange={(e) => handleStyleChange('color', e.target.value)}
        title="Text Color"
      />

      <ColorInput
        type="color"
        value={style.backgroundColor || '#ffffff'}
        onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
        title="Background Color"
      />
    </ToolbarContainer>
  );
};

export default TextFormattingToolbar; 