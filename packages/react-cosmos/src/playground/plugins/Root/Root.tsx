import React from 'react';
import {
  FixtureId,
  FixtureState,
  FlatFixtureTreeItem,
  StateUpdater,
} from 'react-cosmos-core';
import { ArraySlot, Slot } from 'react-plugin';
import styled from 'styled-components';
import { useDrag } from '../../hooks/useDrag';
import { NavRowSlot } from '../../slots/NavRowSlot';
import { grey32, grey8, white10 } from '../../style/colors';
import { GlobalHeader } from './GlobalHeader';
import { RendererHeader } from './RendererHeader';
import { SidePanel } from './SidePanel';

type Props = {
  storageCacheReady: boolean;
  fixtureItems: FlatFixtureTreeItem[];
  selectedFixtureId: FixtureId | null;
  rendererConnected: boolean;
  validFixtureSelected: boolean;
  fixtureState: FixtureState;
  navOpen: boolean;
  panelOpen: boolean;
  navWidth: number;
  panelWidth: number;
  sidePanelRowOrder: string[];
  globalActionOrder: string[];
  globalOrder: string[];
  navRowOrder: string[];
  fixtureActionOrder: string[];
  rendererActionOrder: string[];
  onToggleNav: () => unknown;
  onTogglePanel: () => unknown;
  onFixtureSelect: (fixtureId: FixtureId) => unknown;
  onFixtureClose: () => unknown;
  onFixtureStateChange: (stateUpdater: StateUpdater<FixtureState>) => void;
  setNavWidth: (width: number) => unknown;
  setPanelWidth: (width: number) => unknown;
};

export function Root({
  storageCacheReady,
  fixtureItems,
  selectedFixtureId,
  rendererConnected,
  validFixtureSelected,
  fixtureState,
  navOpen,
  panelOpen,
  navWidth,
  panelWidth,
  sidePanelRowOrder,
  globalActionOrder,
  globalOrder,
  navRowOrder,
  fixtureActionOrder,
  rendererActionOrder,
  onToggleNav,
  onTogglePanel,
  onFixtureSelect,
  onFixtureClose,
  onFixtureStateChange,
  setNavWidth,
  setPanelWidth,
}: Props) {
  const navDrag = useDrag({
    value: navWidth,
    onChange: setNavWidth,
  });
  const panelDrag = useDrag({
    value: panelWidth,
    reverse: true,
    onChange: setPanelWidth,
  });

  if (!storageCacheReady) {
    return <Container />;
  }

  const showNav = rendererConnected && (navOpen || !validFixtureSelected);
  const dragging = navDrag.dragging || panelDrag.dragging;

  // z-indexes are set here on purpose to show the layer hierarchy at a glance
  return (
    <Container dragging={dragging}>
      {showNav && (
        <Draggable style={{ width: navWidth, zIndex: 2 }}>
          <Nav>
            {rendererConnected && (
              <NavRowSlot
                slotProps={{ onCloseNav: onToggleNav }}
                plugOrder={navRowOrder}
              />
            )}
          </Nav>
          {navDrag.dragging && <DragOverlay />}
          <NavDragHandle ref={navDrag.dragElRef} />
        </Draggable>
      )}
      <MainContainer key="main" style={{ zIndex: 1 }}>
        {!validFixtureSelected && (
          <GlobalHeader
            selectedFixtureId={selectedFixtureId}
            rendererConnected={rendererConnected}
            validFixtureSelected={validFixtureSelected}
            globalActionOrder={globalActionOrder}
          />
        )}
        <RendererContainer key="rendererContainer">
          {selectedFixtureId && validFixtureSelected && (
            <RendererHeader
              fixtureItems={fixtureItems}
              fixtureId={selectedFixtureId}
              navOpen={navOpen}
              panelOpen={panelOpen}
              fixtureActionOrder={fixtureActionOrder}
              rendererActionOrder={rendererActionOrder}
              onOpenNav={onToggleNav}
              onTogglePanel={onTogglePanel}
              onFixtureSelect={onFixtureSelect}
              onClose={onFixtureClose}
            />
          )}
          <RendererBody key="rendererBody">
            <Slot name="rendererPreview" />
            {dragging && <DragOverlay />}
            {panelOpen && selectedFixtureId && (
              <ControlPanelContainer style={{ width: panelWidth, zIndex: 3 }}>
                <SidePanel
                  fixtureId={selectedFixtureId}
                  fixtureState={fixtureState}
                  sidePanelRowOrder={sidePanelRowOrder}
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

const Container = styled.div.attrs({ 'data-testid': 'root' })<ContainerProps>`
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

const Nav = styled.div`
  width: 100%;
  height: 100%;
  background: ${grey32};
  display: flex;
  flex-direction: column;
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
  justify-content: flex-end;
  background: ${grey8};
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

// The purpose of DragOverlay is to cover the renderer iframe while dragging,
// because otherwise the iframe steaps the mousemove events and stops the drag.
const DragOverlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;
