// @flow

import React from 'react';
import { GlobalStyle } from './globalStyle';

export default ({ children }: { children: React$Node }) => (
  <>
    <GlobalStyle />
    {children}
  </>
);
