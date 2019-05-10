import React from 'react';
import { Slot, ArraySlot } from 'react-plugin';
import styled from 'styled-components';
import { useDrag } from '../../shared/ui';
import { NAV_WIDTH_DEFAULT, restrictNavWidth } from './shared';

type Props = {
  storageCacheReady: boolean;
  fullScreen: boolean;
  navWidth: number;
  setNavWidth: (width: number) => unknown;
};

// TODO: Create slot inside previewContainer for notifications
export function Layout({
  storageCacheReady,
  fullScreen,
  navWidth,
  setNavWidth
}: Props) {
  const handleNavWidthChange = React.useCallback(
    (newWidth: number) => setNavWidth(restrictNavWidth(newWidth)),
    [setNavWidth]
  );
  const { dragElRef, dragging } = useDrag({
    value: navWidth,
    onChange: handleNavWidthChange
  });

  if (!storageCacheReady) {
    return <Container />;
  }

  if (fullScreen) {
    return (
      <Container>
        <Center key="center" style={{ zIndex: 1 }}>
          <PreviewContainer key="previewContainer">
            <Slot name="rendererPreview" />
            <Slot name="contentOverlay" />
          </PreviewContainer>
        </Center>
        <div style={{ zIndex: 2 }}>
          <ArraySlot name="global" />
        </div>
      </Container>
    );
  }

  // z indexes are set here on purpose to show the layer hierarchy at a glance
  return (
    <Container draggingNav={dragging}>
      <Left style={{ zIndex: 2, width: navWidth }}>
        <Slot name="left" />
        {dragging && <DragOverlay />}
        <DragHandle ref={dragElRef} />
      </Left>
      <Center key="center" style={{ zIndex: 1 }}>
        <Slot name="rendererHeader" />
        <PreviewContainer key="previewContainer">
          <Slot name="rendererPreview" />
          <Slot name="contentOverlay" />
        </PreviewContainer>
        {dragging && <DragOverlay />}
      </Center>
      <div style={{ zIndex: 3 }}>
        <Slot name="right" />
      </div>
      <div style={{ zIndex: 4 }}>
        <ArraySlot name="global" />
      </div>
    </Container>
  );
}

const Container = styled.div<{ draggingNav?: boolean }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  cursor: ${props => (props.draggingNav ? 'col-resize' : 'default')};
`;

const Left = styled.div`
  flex-shrink: 0;
  position: relative;
  width: ${NAV_WIDTH_DEFAULT}px;
  border-right: 1px solid var(--darkest);
`;

const Center = styled.div`
  position: relative;
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

const DragHandle = styled.div`
  position: absolute;
  top: 0;
  right: -3px;
  width: 5px;
  height: 100%;
  cursor: col-resize;
  user-select: none;
`;

// The purpose of DragOverlay is to cover other elements while dragging, such
// as the renderer preview iframe, which sucks up `mousemove` events, or the
// links in the fixture tree view which change the mouse cursor.
const DragOverlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;
