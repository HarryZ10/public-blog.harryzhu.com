import { createGlobalStyle } from 'styled-components';

interface ThemeColors {
  background: string;
  text: string;
  primary: string;
  secondary: string;
  navbarBackground: string;
  skyblueHighlight: string;
  pageTitleAlt?: string;
  postBackground: string;
  postText: string;
  danger: string;
  cardBorder: string;
  modalBackground: string;
  modalTextInput: string;
  submission: string;
  backgroundLight?: string;
  loginBackground?: string;
}

export interface Theme {
  dark: {
    colors: ThemeColors;
    fonts: {
      primary: string;
    }
  };
}

// Extend DefaultTheme with your custom theme structure
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}

// Create the global style component
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    background-color: ${(props) => props.theme.dark.colors.background};
    color: ${(props) => props.theme.dark.colors.text};
    font-family: 'Open Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  input:focus, select:focus, textarea:focus, button:focus {
      outline: none !important;
      outline-width: 0 !important;
      box-shadow: none !important;
      -moz-box-shadow: none !important;
      -webkit-box-shadow: none !important;
  }
`;

export default GlobalStyle;
