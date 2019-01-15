// @flow

import React from 'react';
import { GlobalStyle } from './global/style';

export default ({ children }: { children: React$Node }) => (
  <>
    <GlobalStyle />
    {children}
  </>
);
