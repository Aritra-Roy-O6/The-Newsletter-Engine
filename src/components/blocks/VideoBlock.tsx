import React from 'react';
import styled from '@emotion/styled';
import { BlockProps } from '../../types';
import { useApp } from '../../context/AppContext';
import ResizableBlock from '../ResizableBlock';

const VideoContainer = styled.div`
  width: 100%;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
`;

const VideoInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  margin-bottom: 0.5rem;
`;

const ResponsiveIframe = styled.iframe`
  width: 100%;
  aspect-ratio: 16/9;
  border: none;
  border-radius: 8px;
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

const VideoBlock: React.FC<BlockProps> = ({ id, content, onUpdate, config, onConfigUpdate }) => {
  const { state } = useApp();
  const isPreview = state.previewMode;

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('vimeo.com')) {
      const videoId = url.split('/').pop();
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  if (isPreview) {
    return (
      <PreviewContainer config={config || {}}>
        <VideoContainer>
          {content ? (
            <ResponsiveIframe src={getEmbedUrl(content)} allowFullScreen />
          ) : (
            <div style={{ color: '#888' }}>No video URL provided.</div>
          )}
        </VideoContainer>
      </PreviewContainer>
    );
  }

  return (
    <ResizableBlock config={config || {}} onConfigUpdate={(newConfig) => onConfigUpdate?.(id, newConfig)}>
      <VideoContainer>
        <VideoInput
          type="text"
          value={content}
          onChange={e => onUpdate(id, e.target.value)}
          placeholder="Paste YouTube, Vimeo, or direct video URL..."
        />
        {content && <ResponsiveIframe src={getEmbedUrl(content)} allowFullScreen />}
      </VideoContainer>
    </ResizableBlock>
  );
};

export default VideoBlock; 