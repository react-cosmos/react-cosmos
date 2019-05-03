import * as React from 'react';
import { Slot } from 'react-plugin';
import styled from 'styled-components';

type Props = {
  storageCacheReady: boolean;
};

export function Layout({ storageCacheReady }: Props) {
  if (!storageCacheReady) {
    return <Container />;
  }

  // z indexes are set here on purpose to show the layer hierarchy at a glance
  return (
    <Container>
      <div style={{ zIndex: 2 }}>
        <Slot name="left" />
      </div>
      <Center style={{ zIndex: 1 }}>
        <Slot name="rendererHeader" />
        <PreviewContainer>
          <Slot name="rendererPreview" />
          <Slot name="contentOverlay" />
        </PreviewContainer>
      </Center>
      <div style={{ zIndex: 3 }}>
        <Slot name="right" />
      </div>
      <div style={{ zIndex: 4 }}>
        <Slot name="global" />
      </div>
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
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
