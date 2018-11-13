// @flow

import styled from 'styled-components';
import React from 'react';
import { Slot } from 'react-plugin';
import { ControlPanel } from './ControlPanel';

import type { Node } from 'react';

type Props = {
  children: Node
};

export function Preview({ children }: Props) {
  return (
    <Container>
      <Left>
        <ControlPanel />
      </Left>
      <Right>
        <Slot name="preview">{children}</Slot>
      </Right>
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
`;

const Left = styled.div`
  flex-shrink: 0;
  width: 256px;
  display: flex;
  flex-direction: column;
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;
