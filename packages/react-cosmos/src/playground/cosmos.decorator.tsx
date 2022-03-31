import React from 'react';
import { CosmosGlobalStyle, GlobalStyle } from './global/style';

export default ({ children }: { children: React.ReactNode }) => (
  <>
    <GlobalStyle />
    <CosmosGlobalStyle />
    {children}
  </>
);
