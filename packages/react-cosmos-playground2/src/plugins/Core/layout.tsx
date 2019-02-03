import * as React from 'react';
import { Slot } from 'react-plugin';
import styled from 'styled-components';

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

export const layout = (
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
);
