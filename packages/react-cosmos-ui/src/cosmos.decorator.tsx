import React from 'react';
import { CosmosGlobalStyle, GlobalStyle } from './style/globalStyle.js';

export default ({ children }: { children: React.ReactNode }) => (
  <>
    <GlobalStyle />
    <CosmosGlobalStyle />
    {children}
  </>
);
