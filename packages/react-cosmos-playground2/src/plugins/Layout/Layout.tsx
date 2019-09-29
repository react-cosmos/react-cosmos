import React from 'react';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import { StateUpdater } from 'react-cosmos-shared2/util';
import { ArraySlot, Slot } from 'react-plugin';
import styled from 'styled-components';
import { grey32, white10 } from '../../shared/ui/colors';
import { useDrag } from '../../shared/ui/useDrag';
import { ControlPanel } from './ControlPanel';
import { RendererHeader } from './RendererHeader';
import { TopBar } from './TopBar';

type Props = {
  storageCacheReady: boolean;
  selectedFixtureId: FixtureId | null;
  fullScreen: boolean;
  rendererConnected: boolean;
  validFixtureSelected: boolean;
  fixtureState: FixtureState;
  navOpen: boolean;
  panelOpen: boolean;
  navWidth: number;
  panelWidth: number;
  globalOrder: string[];
  topBarRightActionOrder: string[];
  rendererActionOrder: string[];
  controlPanelRowOrder: string[];
  onToggleNav: () => unknown;
  onFixtureSelect: (fixtureId: FixtureId, fullScreen: boolean) => unknown;
  onFixtureClose: () => unknown;
  onFixtureStateChange: (stateUpdater: StateUpdater<FixtureState>) => void;
  setNavWidth: (width: number) => unknown;
  setPanelWidth: (width: number) => unknown;
};

export function Layout({
  storageCacheReady,
  selectedFixtureId,
  fullScreen,
  rendererConnected,
  validFixtureSelected,
  fixtureState,
  navOpen,
  panelOpen,
  navWidth,
  panelWidth,
  globalOrder,
  topBarRightActionOrder,
  rendererActionOrder,
  controlPanelRowOrder,
  onToggleNav,
  onFixtureSelect,
  onFixtureClose,
  onFixtureStateChange,
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
        <MainContainer key="main" style={{ zIndex: 1 }}>
          <RendererContainer key="rendererContainer">
            <RendererBody key="rendererBody">
              <Slot name="rendererPreview" />
            </RendererBody>
            <Slot name="contentOverlay" />
          </RendererContainer>
        </MainContainer>
        <div style={{ zIndex: 2 }}>
          <ArraySlot name="global" plugOrder={globalOrder} />
        </div>
      </Container>
    );
  }

  const showNav = navOpen || !validFixtureSelected;
  const dragging = navDrag.dragging || panelDrag.dragging;

  // z-indexes are set here on purpose to show the layer hierarchy at a glance
  return (
    <Container dragging={dragging}>
      {showNav && (
        <Draggable style={{ width: navWidth, zIndex: 2 }}>
          <Slot name="nav" />
          {navDrag.dragging && <DragOverlay />}
          <NavDragHandle ref={navDrag.dragElRef} />
        </Draggable>
      )}
      <MainContainer key="main" style={{ zIndex: 1 }}>
        {!selectedFixtureId && (
          <TopBar
            selectedFixtureId={selectedFixtureId}
            rendererConnected={rendererConnected}
            validFixtureSelected={validFixtureSelected}
            navOpen={navOpen}
            topBarRightActionOrder={topBarRightActionOrder}
            onToggleNav={onToggleNav}
          />
        )}
        <RendererContainer key="rendererContainer">
          {selectedFixtureId && (
            <RendererHeader
              fixtureId={selectedFixtureId}
              rendererActionOrder={rendererActionOrder}
              onReload={() => onFixtureSelect(selectedFixtureId, false)}
              onClose={onFixtureClose}
            />
          )}
          <RendererBody key="rendererBody">
            <Slot name="rendererPreview" />
            {dragging && <DragOverlay />}
            {panelOpen && selectedFixtureId && (
              <ControlPanelContainer style={{ width: panelWidth, zIndex: 3 }}>
                <ControlPanel
                  fixtureId={selectedFixtureId}
                  fixtureState={fixtureState}
                  controlPanelRowOrder={controlPanelRowOrder}
                  onFixtureStateChange={onFixtureStateChange}
                />
                {panelDrag.dragging && <DragOverlay />}
                <PanelDragHandle ref={panelDrag.dragElRef} />
              </ControlPanelContainer>
            )}
          </RendererBody>
          <Slot name="contentOverlay" />
        </RendererContainer>
      </MainContainer>
      <div style={{ zIndex: 4 }}>
        <ArraySlot name="global" plugOrder={globalOrder} />
      </div>
    </Container>
  );
}

type ContainerProps = {
  dragging?: boolean;
};

const Container = styled.div.attrs({ 'data-testid': 'layout' })<ContainerProps>`
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

const MainContainer = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const RendererContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

const RendererBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  overflow: hidden;
`;

const ControlPanelContainer = styled(Draggable)`
  max-width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
`;

const DragHandle = styled.div`
  position: absolute;
  top: 0;
  width: 1px;
  height: 100%;
  background-color: ${white10};
  background-clip: content-box;
  cursor: col-resize;
  user-select: none;
`;

const NavDragHandle = styled(DragHandle)`
  right: -2px;
  padding: 0 2px;
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
