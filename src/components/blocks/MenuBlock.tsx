import React from 'react';
import styled from '@emotion/styled';
import { BlockProps } from '../../types';
import { useApp } from '../../context/AppContext';

const MenuContainer = styled.div`
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
`;

const MenuList = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
`;

const MenuLink = styled.a`
  color: #3b82f6;
  font-weight: 600;
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.2s;
  &:hover {
    color: #2563eb;
    text-decoration: underline;
  }
`;

const MenuInput = styled.input`
  width: 40%;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  margin-right: 0.5rem;
`;

const AddButton = styled.button`
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  margin-left: 0.5rem;
  transition: background 0.2s;
  &:hover {
    background: #2563eb;
  }
`;

const RemoveButton = styled.button`
  padding: 0.25rem 0.75rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  margin-left: 0.5rem;
  transition: background 0.2s;
  &:hover {
    background: #b91c1c;
  }
`;

interface MenuLinkData {
  label: string;
  url: string;
}

const MenuBlock: React.FC<BlockProps> = ({ id, content, onUpdate }) => {
  const { state } = useApp();
  const isPreview = state.previewMode;
  const links: MenuLinkData[] = content ? JSON.parse(content) : [];

  const handleChange = (idx: number, field: keyof MenuLinkData, value: string) => {
    const newLinks = links.map((link, i) => i === idx ? { ...link, [field]: value } : link);
    onUpdate(id, JSON.stringify(newLinks));
  };

  const handleAdd = () => {
    onUpdate(id, JSON.stringify([...links, { label: '', url: '' }]));
  };

  const handleRemove = (idx: number) => {
    onUpdate(id, JSON.stringify(links.filter((_, i) => i !== idx)));
  };

  if (isPreview) {
    return (
      <MenuContainer>
        <MenuList>
          {links.map((link, i) => (
            <MenuLink key={i} href={link.url || '#'} target="_blank" rel="noopener noreferrer">
              {link.label || 'Menu'}
            </MenuLink>
          ))}
        </MenuList>
      </MenuContainer>
    );
  }

  return (
    <MenuContainer>
      {links.map((link, i) => (
        <div key={i} style={{ marginBottom: '0.5rem' }}>
          <MenuInput
            type="text"
            value={link.label}
            onChange={e => handleChange(i, 'label', e.target.value)}
            placeholder="Label"
          />
          <MenuInput
            type="text"
            value={link.url}
            onChange={e => handleChange(i, 'url', e.target.value)}
            placeholder="URL"
          />
          <RemoveButton onClick={() => handleRemove(i)}>-</RemoveButton>
        </div>
      ))}
      <AddButton onClick={handleAdd}>+ Add Link</AddButton>
    </MenuContainer>
  );
};

export default MenuBlock; 