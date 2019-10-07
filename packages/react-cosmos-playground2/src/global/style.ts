import { createGlobalStyle } from 'styled-components';
import { fontFamily } from '../shared/ui/vars';

export const GlobalStyle = createGlobalStyle`
  html {
    font-family: ${fontFamily};
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
  }

  body, p, ul, ol, li, h1, h2, h3, button, input, textarea, select {
    margin: 0;
    padding: 0;
  }

  input, textarea {
    font-family: ${fontFamily};
  }

  input, textarea, button {
    font-size: 14px;
  }

  a {}
`;
