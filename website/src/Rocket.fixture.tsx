import React from 'react';
import styled from 'styled-components';
import { Rocket } from './Rocket';

const Container = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default (
  <Container>
    <Rocket />
  </Container>
);
