import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { AppState, Block, Theme, HistoryState, BlockConfig, BlockStyle } from '../types';

const initialState: AppState = {
  blocks: [],
  history: [],
  currentHistoryIndex: -1,
  theme: {
    mode: 'light',
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      background: '#ffffff',
      text: '#1f2937',
      border: '#e5e7eb',
      hover: '#4f46e5',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
      surface: '#f9fafb',
      surfaceHover: '#f3f4f6',
      surfaceActive: '#e5e7eb',
      surfaceBorder: '#e5e7eb',
      surfaceText: '#374151',
      surfaceTextSecondary: '#6b7280',
    },
  },
  previewMode: false,
  devicePreview: 'desktop',
  canvasColor: '#fff',
  canvasGradient: null,
};

type Action =
  | { type: 'ADD_BLOCK'; payload: Block }
  | { type: 'UPDATE_BLOCK'; payload: { id: string; content: string } }
  | { type: 'UPDATE_BLOCK_CONFIG'; payload: { id: string; config: BlockConfig } }
  | { type: 'UPDATE_BLOCK_STYLE'; payload: { id: string; style: BlockStyle } }
  | { type: 'REMOVE_BLOCK'; payload: string }
  | { type: 'REORDER_BLOCKS'; payload: Block[] }
  | { type: 'TOGGLE_THEME' }
  | { type: 'TOGGLE_PREVIEW' }
  | { type: 'SET_DEVICE_PREVIEW'; payload: 'desktop' | 'tablet' | 'mobile' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'UPDATE_THEME_COLOR'; payload: { key: keyof Theme['colors']; value: string } }
  | { type: 'UPDATE_BLOCK_POSITION'; payload: { id: string; position: { top: number; left: number } } }
  | { type: 'SET_CANVAS_COLOR'; payload: string }
  | { type: 'SET_CANVAS_GRADIENT'; payload: { color1: string; color2: string; direction: string } | null };

const appReducer = (state: AppState, action: Action): AppState => {
  const addToHistory = (newBlocks: Block[]) => {
    const newHistory = state.history.slice(0, state.currentHistoryIndex + 1);
    newHistory.push({
      blocks: newBlocks,
      timestamp: Date.now(),
    });
    return newHistory;
  };

  switch (action.type) {
    case 'ADD_BLOCK':
      const newBlock = {
        ...action.payload,
        position: action.payload.position || { top: 20, left: 20 }
      };
      const newBlocks = [...state.blocks, newBlock];
      return {
        ...state,
        blocks: newBlocks,
        history: addToHistory(newBlocks),
        currentHistoryIndex: state.currentHistoryIndex + 1,
      };

    case 'UPDATE_BLOCK':
      const updatedBlocks = state.blocks.map(block =>
        block.id === action.payload.id
          ? { ...block, content: action.payload.content }
          : block
      );
      return {
        ...state,
        blocks: updatedBlocks,
        history: addToHistory(updatedBlocks),
        currentHistoryIndex: state.currentHistoryIndex + 1,
      };

    case 'UPDATE_BLOCK_CONFIG':
      const configUpdatedBlocks = state.blocks.map(block =>
        block.id === action.payload.id
          ? { ...block, config: { ...block.config, ...action.payload.config } }
          : block
      );
      return {
        ...state,
        blocks: configUpdatedBlocks,
        history: addToHistory(configUpdatedBlocks),
        currentHistoryIndex: state.currentHistoryIndex + 1,
      };

    case 'UPDATE_BLOCK_STYLE':
      const styleUpdatedBlocks = state.blocks.map(block =>
        block.id === action.payload.id
          ? { 
              ...block, 
              style: { 
                ...block.style, 
                ...action.payload.style 
              } 
            }
          : block
      );
      return {
        ...state,
        blocks: styleUpdatedBlocks,
        history: addToHistory(styleUpdatedBlocks),
        currentHistoryIndex: state.currentHistoryIndex + 1,
      };

    case 'REMOVE_BLOCK':
      const filteredBlocks = state.blocks.filter(block => block.id !== action.payload);
      return {
        ...state,
        blocks: filteredBlocks,
        history: addToHistory(filteredBlocks),
        currentHistoryIndex: state.currentHistoryIndex + 1,
      };

    case 'REORDER_BLOCKS':
      return {
        ...state,
        blocks: action.payload,
        history: addToHistory(action.payload),
        currentHistoryIndex: state.currentHistoryIndex + 1,
      };

    case 'TOGGLE_THEME':
      const newMode = state.theme.mode === 'light' ? 'dark' : 'light';
      return {
        ...state,
        theme: {
          ...state.theme,
          mode: newMode,
          colors: newMode === 'light'
            ? initialState.theme.colors
            : {
                primary: '#818cf8',
                secondary: '#a78bfa',
                background: '#111827',
                text: '#f9fafb',
                border: '#374151',
                hover: '#6366f1',
                success: '#34d399',
                warning: '#fbbf24',
                error: '#f87171',
                info: '#60a5fa',
                surface: '#1f2937',
                surfaceHover: '#374151',
                surfaceActive: '#4b5563',
                surfaceBorder: '#374151',
                surfaceText: '#f3f4f6',
                surfaceTextSecondary: '#9ca3af',
              },
        },
      };

    case 'TOGGLE_PREVIEW':
      return {
        ...state,
        previewMode: !state.previewMode,
      };

    case 'SET_DEVICE_PREVIEW':
      return {
        ...state,
        devicePreview: action.payload,
      };

    case 'UNDO':
      if (state.currentHistoryIndex > 0) {
        return {
          ...state,
          blocks: state.history[state.currentHistoryIndex - 1].blocks,
          currentHistoryIndex: state.currentHistoryIndex - 1,
        };
      }
      return state;

    case 'REDO':
      if (state.currentHistoryIndex < state.history.length - 1) {
        return {
          ...state,
          blocks: state.history[state.currentHistoryIndex + 1].blocks,
          currentHistoryIndex: state.currentHistoryIndex + 1,
        };
      }
      return state;

    case 'UPDATE_THEME_COLOR':
      return {
        ...state,
        theme: {
          ...state.theme,
          colors: {
            ...state.theme.colors,
            [action.payload.key]: action.payload.value
          }
        }
      };

    case 'UPDATE_BLOCK_POSITION':
      const positionUpdatedBlocks = state.blocks.map(block =>
        block.id === action.payload.id
          ? { ...block, position: action.payload.position }
          : block
      );
      return {
        ...state,
        blocks: positionUpdatedBlocks,
        history: addToHistory(positionUpdatedBlocks),
        currentHistoryIndex: state.currentHistoryIndex + 1,
      };

    case 'SET_CANVAS_COLOR':
      return { ...state, canvasColor: action.payload };

    case 'SET_CANVAS_GRADIENT':
      return { ...state, canvasGradient: action.payload };

    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 