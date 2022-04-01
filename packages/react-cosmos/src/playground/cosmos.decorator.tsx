import React from 'react';
import { CosmosGlobalStyle, GlobalStyle } from './style/globalStyle';

export default ({ children }: { children: React.ReactNode }) => (
  <>
    <GlobalStyle />
    <CosmosGlobalStyle />
    {children}
  </>
);
