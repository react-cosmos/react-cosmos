import React from 'react';
import styled from 'styled-components';
import { Highlights } from './Highlights.js';

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  min-height: 100%;
  background: #fff;
  padding: 64px 0;
`;

export default (
  <Container>
    <Highlights />
  </Container>
);
