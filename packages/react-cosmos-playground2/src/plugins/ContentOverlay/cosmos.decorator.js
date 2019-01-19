// @flow

import React from 'react';
import styled from 'styled-components';

export default ({ children }: { children: React$Node }) => (
  <Wrapper>{children}</Wrapper>
);

const Wrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  background-color: var(--grey6);
  align-items: center;
  justify-content: center;
`;
