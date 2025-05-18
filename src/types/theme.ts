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

declare module '@emotion/react' {
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
} 