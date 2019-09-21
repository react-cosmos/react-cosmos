import React from 'react';
import { ArraySlot, Slot } from 'react-plugin';
import styled from 'styled-components';
import { grey32, grey8, white10 } from '../../shared/ui/colors';
import { useDrag } from '../../shared/ui/useDrag';

type Props = {
  storageCacheReady: boolean;
  fullScreen: boolean;
  navOpen: boolean;
  panelOpen: boolean;
  navWidth: number;
  panelWidth: number;
  setNavWidth: (width: number) => unknown;
  setPanelWidth: (width: number) => unknown;
};

export function Layout({
  storageCacheReady,
  fullScreen,
  navOpen,
  panelOpen,
  navWidth,
  panelWidth,
  setNavWidth,
  setPanelWidth
}: Props) {
  const navDrag = useDrag({
    value: navWidth,
    reverse: false,
    onChange: setNavWidth
  });
  const panelDrag = useDrag({
    value: panelWidth,
    reverse: true,
    onChange: setPanelWidth
  });

  if (!storageCacheReady) {
    return <Container />;
  }

  if (fullScreen) {
    return (
      <Container>
        <Center key="center" style={{ zIndex: 1 }}>
          <Preview key="preview" />
        </Center>
        <div style={{ zIndex: 2 }}>
          <ArraySlot name="global" />
        </div>
      </Container>
    );
  }

  const dragging = navDrag.dragging || panelDrag.dragging;
  // z-indexes are set here on purpose to show the layer hierarchy at a glance
  return (
    <Container dragging={dragging}>
      <NavContainer
        style={{ width: navOpen ? navWidth : undefined, zIndex: 2 }}
      >
        <Nav
          navOpen={navOpen}
          dragging={navDrag.dragging}
          dragElRef={navDrag.dragElRef}
        />
      </NavContainer>
      <Center key="center" style={{ zIndex: 1 }}>
        <Slot name="rendererHeader" />
        <Preview key="preview" />
        {dragging && <DragOverlay />}
      </Center>
      {panelOpen && (
        <PanelContainer style={{ width: panelWidth, zIndex: 3 }}>
          <Slot name="panel" />
          {panelDrag.dragging && <DragOverlay />}
          <PanelDragHandle ref={panelDrag.dragElRef} />
        </PanelContainer>
      )}
      <div style={{ zIndex: 4 }}>
        <ArraySlot name="global" />
      </div>
    </Container>
  );
}

type NavProps = {
  navOpen: boolean;
  dragging: boolean;
  dragElRef: (elRef: HTMLElement | null) => void;
};

function Nav({ navOpen, dragging, dragElRef }: NavProps) {
  if (navOpen) {
    return (
      <>
        <Slot name="nav" />
        {dragging && <DragOverlay />}
        <NavDragHandle ref={dragElRef} />
      </>
    );
  }

  return (
    <>
      <Slot name="miniNav" />
      <MiniNavShadow />
    </>
  );
}

function Preview() {
  return (
    <PreviewContainer>
      <Slot name="rendererPreview" />
      <Slot name="contentOverlay" />
    </PreviewContainer>
  );
}

const Container = styled.div.attrs({ 'data-testid': 'layout' })<{
  dragging?: boolean;
}>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background: ${grey32};
  cursor: ${props => (props.dragging ? 'col-resize' : 'default')};
`;

const Draggable = styled.div`
  flex-shrink: 0;
  position: relative;
`;

const NavContainer = styled(Draggable)``;

const PanelContainer = styled(Draggable)``;

const Center = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  background: ${grey8};
`;

const PreviewContainer = styled.div`
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
`;

const Border = styled.div`
  position: absolute;
  top: 0;
  width: 1px;
  height: 100%;
  background-color: ${white10};
`;

const DragHandle = styled(Border)`
  background-clip: content-box;
  cursor: col-resize;
  user-select: none;
`;

const NavDragHandle = styled(DragHandle)`
  right: -2px;
  padding: 0 2px 0 1px;
`;

const MiniNavShadow = styled(Border)`
  right: 0;
`;

const PanelDragHandle = styled(DragHandle)`
  left: -2px;
  padding: 0 1px 0 2px;
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
