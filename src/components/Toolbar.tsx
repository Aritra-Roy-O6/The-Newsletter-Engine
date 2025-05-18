import React, { useRef, useState } from 'react';
import styled from '@emotion/styled';
import { useApp } from '../context/AppContext';

const ToolbarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background-color: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.surfaceBorder};
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  z-index: 1000;
  backdrop-filter: blur(8px);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const ToolbarButton = styled.button`
  padding: 0.625rem 1rem;
  margin: 0 0.375rem;
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.surfaceText};
  border: 1px solid ${props => props.theme.colors.surfaceBorder};
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 0.875rem;

  &:hover {
    background-color: ${props => props.theme.colors.surfaceHover};
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }

  &:active {
    background-color: ${props => props.theme.colors.surfaceActive};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: ${props => props.theme.colors.surface};
    border-color: ${props => props.theme.colors.surfaceBorder};
    color: ${props => props.theme.colors.surfaceTextSecondary};
  }

  span {
    font-size: 1.125rem;
  }
`;

const PreviewControls = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  gap: 1rem;
  background-color: ${props => props.theme.colors.surface};
  padding: 0.25rem;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.surfaceBorder};
`;

const DeviceButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 0.75rem;
  background-color: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.colors.surfaceText};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;

  &:hover {
    background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.surfaceHover};
    color: ${props => props.active ? 'white' : props.theme.colors.primary};
  }

  &:active {
    background-color: ${props => props.active ? props.theme.colors.hover : props.theme.colors.surfaceActive};
  }
`;

const PaletteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  margin-left: 1rem;
  display: flex;
  align-items: center;
`;

const HiddenColorInput = styled.input`
  display: none;
`;

const PalettePopover = styled.div`
  position: absolute;
  top: 0;
  right: 120%;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  padding: 1rem;
  z-index: 2000;
  min-width: 220px;
`;

const PaletteButtonWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Toolbar: React.FC = () => {
  const { state, dispatch } = useApp();
  const colorInputRef = useRef<HTMLInputElement>(null);
  const [showPalette, setShowPalette] = useState(false);
  const [gradientType, setGradientType] = useState(state.canvasGradient ? 'gradient' : 'solid');
  const [gradient, setGradient] = useState(state.canvasGradient || {
    color1: state.canvasColor || '#fff',
    color2: '#3b82f6',
    direction: 'to right',
  });

  React.useEffect(() => {
    if (gradientType === 'gradient') {
      dispatch({ type: 'SET_CANVAS_GRADIENT', payload: gradient });
    } else {
      dispatch({ type: 'SET_CANVAS_GRADIENT', payload: null });
    }
    // eslint-disable-next-line
  }, [gradientType]);

  const handleUndo = () => {
    dispatch({ type: 'UNDO' });
  };

  const handleRedo = () => {
    dispatch({ type: 'REDO' });
  };

  const handleThemeToggle = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  const handlePreviewToggle = () => {
    dispatch({ type: 'TOGGLE_PREVIEW' });
  };

  const handleDeviceChange = (device: 'desktop' | 'tablet' | 'mobile') => {
    dispatch({ type: 'SET_DEVICE_PREVIEW', payload: device });
  };

  const handleGradientChange = (key: string, value: string) => {
    const newGradient = { ...gradient, [key]: value };
    setGradient(newGradient);
    if (gradientType === 'gradient') {
      dispatch({ type: 'SET_CANVAS_GRADIENT', payload: newGradient });
    }
  };

  const handleSolidColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_CANVAS_COLOR', payload: e.target.value });
  };

  const exportToHTML = () => {
    const blocks = state.blocks;
    const html = blocks.map(block => {
      switch (block.type) {
        case 'header':
          return `<h1 style="text-align: center; font-size: 2rem; margin-bottom: 1rem;">${block.content}</h1>`;
        case 'paragraph':
          return `<p style="margin-bottom: 1rem; line-height: 1.6;">${block.content}</p>`;
        case 'image':
          return `<img src="${block.content}" alt="Newsletter image" style="max-width: 100%; height: auto; margin: 1rem 0;" />`;
        case 'button':
          return `<a href="#" style="display: inline-block; padding: 0.75rem 1.5rem; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 4px; margin: 1rem 0;">${block.content}</a>`;
        case 'divider':
          return '<hr style="border: none; border-top: 2px solid #e5e7eb; margin: 1rem 0;" />';
        case 'footer':
          return `<footer style="text-align: center; padding: 1rem; background-color: #f8f9fa; border-top: 1px solid #e5e7eb; margin-top: 2rem;">${block.content}</footer>`;
        case 'social':
          const socialLinks = JSON.parse(block.content);
          return `
            <div style="text-align: center; margin: 1rem 0;">
              ${Object.entries(socialLinks)
                .map(([platform, url]) => `<a href="${url}" style="margin: 0 0.5rem; color: #3b82f6;">${platform}</a>`)
                .join('')}
            </div>
          `;
        case 'survey':
          const surveyData = JSON.parse(block.content);
          return `
            <div style="background-color: #f8f9fa; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
              <h2 style="text-align: center; margin-bottom: 1rem;">${surveyData.title}</h2>
              ${surveyData.questions.map((q: any) => `
                <div style="margin-bottom: 1rem;">
                  <p style="font-weight: bold;">${q.question}</p>
                  ${q.options.map((opt: string) => `
                    <div style="margin: 0.5rem 0;">
                      <input type="radio" name="q_${q.question}" id="opt_${opt}" />
                      <label for="opt_${opt}">${opt}</label>
                    </div>
                  `).join('')}
                </div>
              `).join('')}
            </div>
          `;
        case 'quiz':
          const quizData = JSON.parse(block.content);
          return `
            <div style="background-color: #f8f9fa; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
              <h2 style="text-align: center; margin-bottom: 1rem;">${quizData.title}</h2>
              ${quizData.questions.map((q: any) => `
                <div style="margin-bottom: 1rem;">
                  <p style="font-weight: bold;">${q.question}</p>
                  ${q.options.map((opt: string, i: number) => `
                    <div style="margin: 0.5rem 0;">
                      <input type="radio" name="q_${q.question}" id="opt_${opt}" />
                      <label for="opt_${opt}">${opt}</label>
                    </div>
                  `).join('')}
                </div>
              `).join('')}
            </div>
          `;
        case 'spacer':
          return `<div style="height: ${block.content}px;"></div>`;
        default:
          return '';
      }
    }).join('\n');

    let backgroundStyle = '';
    if (state.canvasGradient) {
      backgroundStyle = `background: linear-gradient(${state.canvasGradient.direction}, ${state.canvasGradient.color1}, ${state.canvasGradient.color2});`;
    } else if (state.canvasColor) {
      backgroundStyle = `background: ${state.canvasColor};`;
    }

    const fullHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Newsletter</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #1f2937;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            img {
              max-width: 100%;
              height: auto;
            }
            @media (max-width: 600px) {
              body {
                padding: 10px;
              }
            }
          </style>
        </head>
        <body style="${backgroundStyle}">
          ${html}
        </body>
      </html>
    `;

    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ToolbarContainer>
      <ToolbarButton onClick={handleUndo} disabled={state.currentHistoryIndex <= 0}>
        <span>↩</span> Undo
      </ToolbarButton>
      <ToolbarButton onClick={handleRedo} disabled={state.currentHistoryIndex >= state.history.length - 1}>
        <span>↪</span> Redo
      </ToolbarButton>
      <ToolbarButton onClick={handleThemeToggle}>
        <span>{state.theme.mode === 'light' ? '🌙' : '☀️'}</span>
        {state.theme.mode === 'light' ? 'Dark Mode' : 'Light Mode'}
      </ToolbarButton>

      <PreviewControls>
        <ToolbarButton onClick={handlePreviewToggle}>
          <span>👁️</span>
          {state.previewMode ? 'Edit Mode' : 'Preview Mode'}
        </ToolbarButton>
        {state.previewMode && (
          <>
            <DeviceButton
              active={state.devicePreview === 'desktop'}
              onClick={() => handleDeviceChange('desktop')}
            >
              🖥️
            </DeviceButton>
            <DeviceButton
              active={state.devicePreview === 'tablet'}
              onClick={() => handleDeviceChange('tablet')}
            >
              📱
            </DeviceButton>
            <DeviceButton
              active={state.devicePreview === 'mobile'}
              onClick={() => handleDeviceChange('mobile')}
            >
              📱
            </DeviceButton>
          </>
        )}
        <ToolbarButton type="button" onClick={exportToHTML} style={{ marginLeft: '1rem', backgroundColor: '#3b82f6', color: 'white' }}>
          <span>⬆️</span> Export HTML
        </ToolbarButton>
      </PreviewControls>
      <PaletteButtonWrapper>
        <PaletteButton
          type="button"
          title="Canvas Background Color"
          onClick={() => setShowPalette(v => !v)}
        >
          🎨
        </PaletteButton>
        {showPalette && (
          <PalettePopover>
            <div style={{ marginBottom: 8 }}>
              <label>
                <input
                  type="radio"
                  checked={gradientType === 'solid'}
                  onChange={() => { setGradientType('solid'); dispatch({ type: 'SET_CANVAS_GRADIENT', payload: null }); }}
                /> Solid
              </label>
              <label style={{ marginLeft: 16 }}>
                <input
                  type="radio"
                  checked={gradientType === 'gradient'}
                  onChange={() => { setGradientType('gradient'); dispatch({ type: 'SET_CANVAS_GRADIENT', payload: gradient }); }}
                /> Gradient
              </label>
            </div>
            {gradientType === 'solid' ? (
              <HiddenColorInput
                ref={colorInputRef}
                type="color"
                value={state.canvasColor || '#fff'}
                onChange={handleSolidColorChange}
                style={{ display: 'block' }}
              />
            ) : (
              <>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input type="color" value={gradient.color1} onChange={e => handleGradientChange('color1', e.target.value)} />
                  <input type="color" value={gradient.color2} onChange={e => handleGradientChange('color2', e.target.value)} />
                </div>
                <select value={gradient.direction} onChange={e => handleGradientChange('direction', e.target.value)}>
                  <option value="to right">Left → Right</option>
                  <option value="to left">Right → Left</option>
                  <option value="to bottom">Top → Bottom</option>
                  <option value="to top">Bottom → Top</option>
                  <option value="135deg">Diagonal ↘</option>
                  <option value="45deg">Diagonal ↗</option>
                </select>
              </>
            )}
          </PalettePopover>
        )}
      </PaletteButtonWrapper>
    </ToolbarContainer>
  );
};

export default Toolbar; 