import React from 'react';
import styled from 'styled-components';
import { Logos } from './Logos.js';

const Container = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default (
  <Container>
    <Logos />
  </Container>
);
