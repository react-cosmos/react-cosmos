import { createGlobalStyle } from 'styled-components';
import { grey8, white3 } from '../shared/colors';
import { fontFamily } from '../shared/vars';

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
