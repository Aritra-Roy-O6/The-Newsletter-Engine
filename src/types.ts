export interface Block {
  id: string;
  type: BlockType;
  content: string;
  config?: BlockConfig;
  style?: BlockStyle;
  position?: {
    top: number;
    left: number;
  };
}

export interface BlockProps {
  id: string;
  content: string;
  onUpdate: (id: string, content: string) => void;
  config?: BlockConfig;
  onConfigUpdate?: (id: string, config: BlockConfig) => void;
  style?: BlockStyle;
  onStyleUpdate?: (id: string, style: BlockStyle) => void;
}

export interface BlockConfig {
  width?: string;
  height?: string;
  minWidth?: string;
  minHeight?: string;
  maxWidth?: string;
  maxHeight?: string;
}

export interface BlockStyle {
  color?: string;
  backgroundColor?: string;
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline';
  textAlign?: 'left' | 'center' | 'right';
  padding?: string;
  margin?: string;
  borderRadius?: string;
  border?: string;
}

export type BlockType = 
  | 'header'
  | 'paragraph'
  | 'image'
  | 'button'
  | 'divider'
  | 'footer'
  | 'social'
  | 'survey'
  | 'quiz'
  | 'spacer'
  | 'columns'
  | 'video'
  | 'countdown'
  | 'product'
  | 'menu';

export interface Theme {
  mode: 'light' | 'dark';
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    border: string;
    hover: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    surface: string;
    surfaceHover: string;
    surfaceActive: string;
    surfaceBorder: string;
    surfaceText: string;
    surfaceTextSecondary: string;
  };
}

export interface HistoryState {
  blocks: Block[];
  timestamp: number;
}

export interface AppState {
  blocks: Block[];
  history: HistoryState[];
  currentHistoryIndex: number;
  theme: Theme;
  previewMode: boolean;
  devicePreview: 'desktop' | 'tablet' | 'mobile';
  canvasColor?: string;
  canvasGradient?: { color1: string; color2: string; direction: string } | null;
} 