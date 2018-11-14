// @flow

import React from 'react';
import styled from 'styled-components';
import { Slot } from 'react-plugin';
import { PlaygroundProvider } from '../PlaygroundProvider';

import type { PlaygroundOptions } from '../index.js.flow';

type Props = {
  options: PlaygroundOptions
};

export function Playground({ options }: Props) {
  // TODO: Replace "preview" slot with something else for non-web environments
  // TODO: s/root/global
  return (
    <PlaygroundProvider options={options}>
      <Slot name="root" />
      <Container>
        <Slot name="left" />
        <Slot name="preview" />
        <Slot name="right" />
      </Container>
    </PlaygroundProvider>
  );
}

const Container = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  font-family: sans-serif;
  font-size: 16px;
  display: flex;
`;
