import React from 'react';
import styled from '@emotion/styled';
import { useApp } from '../context/AppContext';
import { Block } from '../types';
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

const DEVICE_WIDTHS = {
  desktop: 1200,
  tablet: 800,
  mobile: 400,
};

const PreviewArea = styled.div<{
  canvasColor: string;
  device: 'desktop' | 'tablet' | 'mobile';
}>`
  width: 100%;
  min-height: 100vh;
  background: ${props => props.canvasColor};
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  box-sizing: border-box;
  padding-top: 84px;

  & > .preview-inner {
    width: 100%;
    max-width: ${props => DEVICE_WIDTHS[props.device]}px;
    min-width: 200px;
    min-height: 800px;
    background: transparent;
    box-shadow: 0 0 0 1px #e5e7eb, 0 8px 32px rgba(0,0,0,0.08);
    border-radius: 16px;
    margin: 0 auto;
    padding: 0;
    overflow: visible;
  }
`;

const PreviewCanvas: React.FC = () => {
  const { state } = useApp();
  const { blocks, canvasColor, canvasGradient, devicePreview } = state;

  const renderBlock = (block: Block) => {
    const noop = () => {};
    const commonProps = {
      id: block.id,
      content: block.content,
      onUpdate: noop,
      config: block.config,
      style: block.style,
      // No update or config update in preview
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
    <PreviewArea
      canvasColor={canvasGradient ? `linear-gradient(${canvasGradient.direction}, ${canvasGradient.color1}, ${canvasGradient.color2})` : (canvasColor || '#fff')}
      device={devicePreview}
    >
      <div className="preview-inner">
        {blocks.map(block => (
          <div key={block.id} style={{ position: 'relative' }}>
            {renderBlock(block)}
          </div>
        ))}
      </div>
    </PreviewArea>
  );
};

export default PreviewCanvas; 