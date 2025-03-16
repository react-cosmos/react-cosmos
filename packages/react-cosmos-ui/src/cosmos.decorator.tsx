import React from 'react';
import { GlobalStyle } from './style/globalStyle.js';

export default ({ children }: { children: React.ReactNode }) => (
  <>
    <GlobalStyle />
    {children}
  </>
);
