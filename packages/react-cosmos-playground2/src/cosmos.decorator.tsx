import * as React from 'react';
import { GlobalStyle } from './global/style';

export default ({ children }: { children: React.ReactNode }) => (
  <>
    <GlobalStyle />
    {children}
  </>
);
