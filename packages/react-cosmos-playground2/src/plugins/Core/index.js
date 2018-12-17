// @flow

import React from 'react';
import styled from 'styled-components';
import { registerPlugin, Slot } from 'react-plugin';

import type { CoreConfig } from '../../index.js.flow';
export type { CoreConfig } from '../../index.js.flow';

export function register() {
  const { plug } = registerPlugin<CoreConfig, void>({
    name: 'core',
    defaultConfig: {
      projectId: 'defaultProjectId',
      fixturesDir: '__fixtures__'
    }
  });

  plug({
    slotName: 'root',
    render: (
      <Container>
        <Slot name="left" />
        <Slot name="rendererPreview" />
        <Slot name="right" />
      </Container>
    )
  });
}

const Container = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
`;
