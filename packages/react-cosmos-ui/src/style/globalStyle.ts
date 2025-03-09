import { createGlobalStyle } from 'styled-components';
import { grey8, white3 } from './colors.js';
import { fontFamily } from './vars.js';

export const GlobalStyle = createGlobalStyle`
  html {
    background: rgb(24, 24, 24);
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

export const CosmosGlobalStyle = createGlobalStyle`
  body {
    background-color: ${grey8};
    /* Black checkerboard effect on background */
    background-image: linear-gradient(
        45deg,
        ${white3} 25%,
        transparent 25%,
        transparent 75%,
        ${white3} 75%,
        ${white3} 100%
      ),
      linear-gradient(
        45deg,
        ${white3} 25%,
        transparent 25%,
        transparent 75%,
        ${white3} 75%,
        ${white3} 100%
      );
    background-size: 32px 32px;
    background-position: 0 0, 16px 16px;
  }
`;
