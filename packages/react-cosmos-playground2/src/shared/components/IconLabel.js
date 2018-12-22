// @flow

import React from 'react';
import styled from 'styled-components';
import { Label } from './Label';

type Props = {
  icon: React$Node,
  label: React$Node
};

export function IconLabel({ icon, label }: Props) {
  return (
    <Container>
      <Icon>{icon}</Icon>
      <Label>{label}</Label>
    </Container>
  );
}

const Container = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Icon = styled.span`
  --size: 16px;
  width: var(--size);
  height: var(--size);
  padding: 2px 6px 0 0;
  color: var(--grey3);
`;
