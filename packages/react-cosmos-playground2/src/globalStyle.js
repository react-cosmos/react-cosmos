// @flow

import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html {
    --font-family: -apple-system, BlinkMacSystemFont, Ubuntu, 'Helvetica Neue', Helvetica, sans-serif;
    font-family: var(--font-family);
    font-size: 14px;
  }

  body, p, ul, li, h1, h2, h3, button, input, textarea, select {
    margin: 0;
    padding: 0;
  }

  input {
    font-family: var(--font-family);
  }

  input, button {
    font-size: 14px;
  }

  a {}
`;
