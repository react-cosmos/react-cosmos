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
      fixturesDir: '__fixtures__',
      fixtureFileSuffix: 'fixture'
    }
  });

  plug({
    slotName: 'root',
    render: (
      <Container>
        <Slot name="left" />
        <Center>
          <Slot name="rendererHeader" />
          <PreviewContainer>
            <Slot name="rendererPreview" />
            <Slot name="contentOverlay" />
          </PreviewContainer>
        </Center>
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
  background: var(--grey1);
  color: var(--grey4);
`;

const Center = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  background: var(--grey6);
  color: var(--grey2);
  overflow: hidden;
`;

const PreviewContainer = styled.div`
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
`;
