import React from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { ThemeProvider } from '@emotion/react';
import Sidebar from '../src/components/Sidebar';
import Canvas from './components/Canvas';
import PreviewCanvas from './components/PreviewCanvas';
import Toolbar from './components/Toolbar';
import { AppProvider, useApp } from './context/AppContext';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';


const AppContent = () => {
  const { state, dispatch } = useApp();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && over.id === 'canvas') {
      dispatch({
        type: 'ADD_BLOCK',
        payload: {
          id: `${active.id}-${Date.now()}`,
          type: active.id as any,
          content: '',
        },
      });
    }
  };

  const exportToHTML = () => {
    console.log('Export HTML triggered');
    const blocks = state.blocks;
    const deviceWidths = { desktop: 1200, tablet: 800, mobile: 400 };
    const device = state.devicePreview || 'desktop';
    const canvasInnerStyle = `margin: 40px auto; max-width: ${deviceWidths[device]}px; min-width: 200px; min-height: 800px; background: transparent; box-shadow: 0 0 0 1px #e5e7eb, 0 8px 32px rgba(0,0,0,0.08); border-radius: 16px; padding: 0;`;

    const html = blocks.map(block => {
      const config = block.config || {};
      const previewContainerStyle = `width: ${config.width || '100%'}; height: ${config.height || 'auto'}; min-width: ${config.minWidth || '100px'}; min-height: ${config.minHeight || '50px'}; max-width: ${config.maxWidth || '100%'}; max-height: ${config.maxHeight || 'none'}; overflow: auto; display: flex; flex-direction: column; margin: 0 auto;`;
      let innerHTML = '';
      switch (block.type) {
        case 'header':
          innerHTML = `<h1 style="text-align: center; font-size: 2rem; margin-bottom: 1rem; padding: 1rem; background-color: ${block.style?.backgroundColor || 'transparent'}; border: 1px solid ${block.style?.border || '#e5e7eb'}; border-radius: 4px;">${block.content}</h1>`;
          break;
        case 'paragraph':
          innerHTML = `<p style="margin-bottom: 1rem; line-height: 1.6; padding: 1rem; background-color: ${block.style?.backgroundColor || 'transparent'}; border: 1px solid ${block.style?.border || '#e5e7eb'}; border-radius: 4px; color: ${block.style?.color || '#1f2937'}; font-family: ${block.style?.fontFamily || 'inherit'}; font-size: ${block.style?.fontSize || '1rem'}; font-weight: ${block.style?.fontWeight || 'normal'}; font-style: ${block.style?.fontStyle || 'normal'}; text-decoration: ${block.style?.textDecoration || 'none'}; text-align: ${block.style?.textAlign || 'left'}; word-break: break-word; overflow-wrap: anywhere;">${block.content}</p>`;
          break;
        case 'image':
          innerHTML = `<img src="${block.content}" alt="Newsletter image" style="max-width: 100%; height: auto; margin: 1rem 0; padding: 1rem; background-color: ${block.style?.backgroundColor || 'transparent'}; border: 1px solid ${block.style?.border || '#e5e7eb'}; border-radius: 4px;" />`;
          break;
        case 'button':
          innerHTML = `<a href="#" style="display: inline-block; padding: 0.75rem 1.5rem; background-color: ${block.style?.backgroundColor || '#3b82f6'}; color: ${block.style?.color || 'white'}; text-decoration: none; border-radius: 4px; margin: 1rem 0; border: 1px solid ${block.style?.border || '#e5e7eb'}; font-family: ${block.style?.fontFamily || 'inherit'}; font-size: ${block.style?.fontSize || '1rem'}; font-weight: ${block.style?.fontWeight || 'normal'}; font-style: ${block.style?.fontStyle || 'normal'}; text-align: ${block.style?.textAlign || 'center'};">${block.content}</a>`;
          break;
        case 'divider':
          innerHTML = '<hr style="border: none; border-top: 2px solid #e5e7eb; margin: 1rem 0;" />';
          break;
        case 'footer':
          innerHTML = `<footer style="text-align: center; padding: 1rem; background-color: ${block.style?.backgroundColor || '#f8f9fa'}; border-top: 1px solid ${block.style?.border || '#e5e7eb'}; margin-top: 2rem; border-radius: 4px;">${block.content}</footer>`;
          break;
        case 'social':
          const socialLinks = JSON.parse(block.content);
          innerHTML = `
            <div style="text-align: center; margin: 1rem 0; padding: 1rem; background-color: ${block.style?.backgroundColor || 'transparent'}; border: 1px solid ${block.style?.border || '#e5e7eb'}; border-radius: 4px;">
              ${Object.entries(socialLinks)
                .map(([platform, url]) => `<a href="${url}" style="margin: 0 0.5rem; color: #3b82f6;">${platform}</a>`)
                .join('')}
            </div>
          `;
          break;
        case 'survey':
          const surveyData = JSON.parse(block.content);
          innerHTML = `
            <div style="background-color: ${block.style?.backgroundColor || '#f8f9fa'}; padding: 1rem; border-radius: 8px; margin: 1rem 0; border: 1px solid ${block.style?.border || '#e5e7eb'};">
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
          break;
        case 'quiz':
          const quizData = JSON.parse(block.content);
          innerHTML = `
            <div style="background-color: ${block.style?.backgroundColor || '#f8f9fa'}; padding: 1rem; border-radius: 8px; margin: 1rem 0; border: 1px solid ${block.style?.border || '#e5e7eb'};">
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
          break;
        case 'spacer':
          innerHTML = `<div style="height: ${block.content}px;"></div>`;
          break;
        default:
          innerHTML = '';
      }
      return `<div style="${previewContainerStyle}">${innerHTML}</div>`;
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
          <title>The Newsletter Engine</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #1f2937;
              margin: 0;
              padding: 0;
            }
            img {
              max-width: 100%;
              height: auto;
            }
            @media (max-width: 600px) {
              .canvas-inner {
                max-width: 100vw !important;
                min-width: 0 !important;
              }
            }
          </style>
        </head>
        <body style="${backgroundStyle}">
          <div class="canvas-inner" style="${canvasInnerStyle}">
            ${html}
          </div>
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
    <ThemeProvider theme={state.theme}>
      <div className="app">
        <Toolbar />
        <DndContext onDragEnd={handleDragEnd}>
          <div className="flex h-screen">
            {!state.previewMode && <Sidebar />}
            {state.previewMode ? <PreviewCanvas /> : <Canvas />}
          </div>
        </DndContext>
      </div>
    </ThemeProvider>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/builder" element={<AppContent />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
