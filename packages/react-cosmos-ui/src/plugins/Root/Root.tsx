import React from 'react';
import { FixtureId, FlatFixtureTreeItem } from 'react-cosmos-core';
import { ArraySlot, Slot } from 'react-plugin';
import styled from 'styled-components';
import { useDrag } from '../../hooks/useDrag.js';
import { NavRowSlot } from '../../slots/NavRowSlot.js';
import { grey32, grey8, white10 } from '../../style/colors.js';
import {
  GetFixtureState,
  SetFixtureStateByName,
} from '../RendererCore/spec.js';
import { GlobalHeader } from './GlobalHeader.js';
import { HomeOverlay } from './HomeOverlay/HomeOverlay.js';
import { RendererHeader } from './RendererHeader.js';
import { SidePanel } from './SidePanel.js';

type Props = {
  fixtureItems: FlatFixtureTreeItem[];
  selectedFixtureId: FixtureId | null;
  rendererConnected: boolean;
  getFixtureState: GetFixtureState;
  setFixtureState: SetFixtureStateByName;
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
  onReloadRenderer: () => unknown;
  onCloseFixture: () => unknown;
  setNavWidth: (width: number) => unknown;
  setPanelWidth: (width: number) => unknown;
  welcomeDismissed: boolean;
  onDismissWelcome: () => unknown;
  onShowWelcome: () => unknown;
};

export function Root({
  fixtureItems,
  selectedFixtureId,
  rendererConnected,
  getFixtureState,
  setFixtureState,
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
  onReloadRenderer,
  onCloseFixture,
  setNavWidth,
  setPanelWidth,
  welcomeDismissed,
  onDismissWelcome,
  onShowWelcome,
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

  const showNav = navOpen || !selectedFixtureId;
  const dragging = navDrag.dragging || panelDrag.dragging;

  // z-indexes are set here on purpose to show the layer hierarchy at a glance
  return (
    <Container dragging={dragging}>
      {showNav && (
        <Draggable style={{ width: navWidth, zIndex: 2 }}>
          <Nav>
            <NavRowSlot
              slotProps={{ onCloseNav: onToggleNav }}
              plugOrder={navRowOrder}
            />
          </Nav>
          {navDrag.dragging && <DragOverlay />}
          <NavDragHandle ref={navDrag.dragElRef} />
        </Draggable>
      )}
      <MainContainer key="main" style={{ zIndex: 1 }}>
        {!selectedFixtureId && (
          <GlobalHeader
            rendererConnected={rendererConnected}
            globalActionOrder={globalActionOrder}
          />
        )}
        <RendererContainer key="rendererContainer">
          {selectedFixtureId && (
            <RendererHeader
              fixtureItems={fixtureItems}
              fixtureId={selectedFixtureId}
              navOpen={navOpen}
              panelOpen={panelOpen}
              fixtureActionOrder={fixtureActionOrder}
              rendererActionOrder={rendererActionOrder}
              onOpenNav={onToggleNav}
              onTogglePanel={onTogglePanel}
              onReloadRenderer={onReloadRenderer}
              onClose={onCloseFixture}
            />
          )}
          <RendererBody key="rendererBody">
            <Slot name="rendererPreview" />
            {dragging && <DragOverlay />}
            {selectedFixtureId && panelOpen && (
              <ControlPanelContainer style={{ width: panelWidth, zIndex: 3 }}>
                <SidePanel
                  fixtureId={selectedFixtureId}
                  getFixtureState={getFixtureState}
                  setFixtureState={setFixtureState}
                  sidePanelRowOrder={sidePanelRowOrder}
                />
                {panelDrag.dragging && <DragOverlay />}
                <PanelDragHandle ref={panelDrag.dragElRef} />
              </ControlPanelContainer>
            )}
          </RendererBody>
          {!selectedFixtureId && (
            <Slot name="homeOverlay">
              <HomeOverlay
                welcomeDismissed={welcomeDismissed}
                onDismissWelcome={onDismissWelcome}
                onShowWelcome={onShowWelcome}
              />
            </Slot>
          )}
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
  box-sizing: border-box;
  border-right: 1px solid ${white10};
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
`;

const DragHandle = styled.div`
  position: absolute;
  top: 0;
  width: 10px;
  height: 100%;
  background-clip: content-box;
  cursor: col-resize;
  user-select: none;
  touch-action: none;
`;

const NavDragHandle = styled(DragHandle)`
  right: -2px;
`;

const PanelDragHandle = styled(DragHandle)`
  left: -2px;
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
