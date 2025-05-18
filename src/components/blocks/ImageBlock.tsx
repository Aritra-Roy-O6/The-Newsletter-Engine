import React, { useState } from 'react';
import styled from '@emotion/styled';
import { BlockProps } from '../../types';
import ResizableBlock from '../ResizableBlock';
import { useApp } from '../../context/AppContext';

const ImageContainer = styled.div`
  padding: 1rem;
  text-align: center;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const ImageInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const FileInput = styled.input`
  margin-bottom: 0.5rem;
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

const ImageBlock: React.FC<BlockProps> = ({ id, content, onUpdate, config, onConfigUpdate }) => {
  const [imageUrl, setImageUrl] = useState(content);
  const { state } = useApp();
  const isPreviewMode = state.previewMode;
  const [editMode, setEditMode] = useState(!content);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    onUpdate(id, url);
    setEditMode(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImageUrl(result);
        onUpdate(id, result);
        setEditMode(false);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isPreviewMode) {
    return (
      <PreviewContainer config={config || {}}>
        <ImageContainer>
          {imageUrl && <ImagePreview src={imageUrl} alt="Preview" />}
        </ImageContainer>
      </PreviewContainer>
    );
  }

  return (
    <ResizableBlock config={config || {}} onConfigUpdate={(newConfig) => onConfigUpdate?.(id, newConfig)}>
      <ImageContainer style={{ position: 'relative' }}>
        {imageUrl && !editMode && (
          <ImagePreview src={imageUrl} alt="Preview" style={{ cursor: 'pointer' }} onClick={() => setEditMode(true)} />
        )}
        {(!imageUrl || editMode) && (
          <>
            <ImageInput
              type="text"
              value={imageUrl}
              onChange={handleImageChange}
              placeholder="Enter image URL..."
            />
            <FileInput
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </>
        )}
      </ImageContainer>
    </ResizableBlock>
  );
};

export default ImageBlock; 