// @flow

import React from 'react';
import styled from 'styled-components';
import { Slot } from 'react-plugin';
import { PluginProvider } from '../plugin';

import type { PlaygroundOptions } from '../index.js.flow';

type Props = {
  options: PlaygroundOptions
};

export function Playground({ options }: Props) {
  return (
    <PluginProvider config={options}>
      <Slot name="global" />
      <Container>
        <Slot name="left" />
        <Slot name="rendererPreview" />
        <Slot name="right" />
      </Container>
    </PluginProvider>
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
