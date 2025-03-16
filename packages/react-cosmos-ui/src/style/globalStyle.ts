import { createGlobalStyle } from 'styled-components';
import { grey24 } from './colors.js';
import { fontFamily } from './vars.js';

export const GlobalStyle = createGlobalStyle`
  html {
    background: ${grey24};
    font-family: ${fontFamily};
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
    -webkit-text-size-adjust: none;
  }

  body, p, ul, ol, li, h1, h2, h3, button, input, textarea, select {
    margin: 0;
    padding: 0;
  }

  input, textarea, button {
    font-family: ${fontFamily};
  }

  input, textarea, button {
    font-size: 14px;
  }

  a {}
`;
