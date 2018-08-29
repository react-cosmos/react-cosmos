// @flow

import React from 'react';
import styled from 'styled-components';

export function Section({ children, label }: any) {
  return (
    <Container>
      <Label>{label}</Label>
      <Content>{children}</Content>
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 8px;
`;

const Label = styled.div`
  padding: 8px;
  background: #330808;
  color: #f1f1f1;
  font-size: 14px;
  text-transform: uppercase;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  background: rgba(243, 158, 178, 0.3);
`;
