import React from 'react';
import styled from 'styled-components';
import { deprecated_grey6 } from '../../shared/ui/colors';

export default ({ children }: { children: React.ReactNode }) => (
  <Wrapper>{children}</Wrapper>
);

const Wrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  background-color: ${deprecated_grey6};
  align-items: center;
  justify-content: center;
`;
