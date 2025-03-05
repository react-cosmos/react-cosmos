import React from 'react';
import { FixtureId, FlatFixtureTreeItem } from 'react-cosmos-core';
import { ArraySlot, Slot } from 'react-plugin';
import styled from 'styled-components';
import { IconButton32 } from '../../components/buttons/IconButton32.js';
import { LockIcon, UnlockIcon } from '../../components/icons/index.js';
import { useDrag } from '../../hooks/useDrag.js';
import { NavRowSlot } from '../../slots/NavRowSlot.js';
import { grey32, white10 } from '../../style/colors.js';
import { quick } from '../../style/vars.js';
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
  navPanelOpen: boolean;
  controlPanelOpen: boolean;
  navPanelWidth: number;
  controlPanelWidth: number;
  panelsLocked: boolean;
  sidePanelRowOrder: string[];
  globalActionOrder: string[];
  globalOrder: string[];
  navRowOrder: string[];
  fixtureActionOrder: string[];
  rendererActionOrder: string[];
  onToggleNavPanel: () => unknown;
  onToggleControlPanel: () => unknown;
  onReloadRenderer: () => unknown;
  onCloseFixture: () => unknown;
  setNavPanelWidth: (width: number) => unknown;
  setControlPanelWidth: (width: number) => unknown;
  setPanelsLocked: (lock: boolean) => unknown;
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
  navPanelOpen,
  controlPanelOpen,
  navPanelWidth,
  controlPanelWidth,
  panelsLocked,
  sidePanelRowOrder,
  globalActionOrder,
  globalOrder,
  navRowOrder,
  fixtureActionOrder,
  rendererActionOrder,
  onToggleNavPanel,
  onToggleControlPanel,
  onReloadRenderer,
  onCloseFixture,
  setNavPanelWidth,
  setControlPanelWidth,
  setPanelsLocked,
  welcomeDismissed,
  onDismissWelcome,
  onShowWelcome,
}: Props) {
  const navDrag = useDrag({
    value: navPanelWidth,
    onChange: setNavPanelWidth,
  });
  const panelDrag = useDrag({
    value: controlPanelWidth,
    reverse: true,
    onChange: setControlPanelWidth,
  });

  const showNavPanel = navPanelOpen || !selectedFixtureId;
  const dragging = navDrag.dragging || panelDrag.dragging;

  // z-indexes are set here on purpose to show the layer hierarchy at a glance
  return (
    <Container dragging={dragging}>
      {(showNavPanel || !panelsLocked) && (
        <ResizablePane
          floating={!panelsLocked}
          inert={!panelsLocked && !showNavPanel}
          style={{
            width: navPanelWidth,
            left: !panelsLocked && !showNavPanel ? -navPanelWidth : 0,
            zIndex: 3,
          }}
        >
          <Nav>
            <NavSlots>
              <NavRowSlot
                slotProps={{ onCloseNav: onToggleNavPanel }}
                plugOrder={navRowOrder}
              />
            </NavSlots>
            <NavFooter>
              <IconButton32
                icon={panelsLocked ? <LockIcon /> : <UnlockIcon />}
                title={panelsLocked ? 'Unlock panels' : 'Lock panels'}
                selected={panelsLocked}
                onClick={() => setPanelsLocked(!panelsLocked)}
              />
            </NavFooter>
          </Nav>
          {navDrag.dragging && <DragOverlay />}
          <NavDragHandle ref={navDrag.dragElRef} />
        </ResizablePane>
      )}
      <MainContainer key="main" style={{ zIndex: 1 }}>
        {!selectedFixtureId && (
          <GlobalHeader
            rendererConnected={rendererConnected}
            globalActionOrder={globalActionOrder}
          />
        )}
        {selectedFixtureId && (
          <RendererHeader
            fixtureItems={fixtureItems}
            fixtureId={selectedFixtureId}
            navPanelOpen={navPanelOpen}
            controlPanelOpen={controlPanelOpen}
            panelsLocked={panelsLocked}
            fixtureActionOrder={fixtureActionOrder}
            rendererActionOrder={rendererActionOrder}
            onToggleNavPanel={onToggleNavPanel}
            onToggleControlPanel={onToggleControlPanel}
            onReloadRenderer={onReloadRenderer}
            onClose={onCloseFixture}
          />
        )}
        <RendererContainer key="rendererContainer">
          <Slot name="rendererPreview" />
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
        {dragging && <DragOverlay />}
      </MainContainer>
      {selectedFixtureId && (controlPanelOpen || !panelsLocked) && (
        <ResizablePane
          floating={!panelsLocked}
          inert={!panelsLocked && !controlPanelOpen}
          style={{
            width: controlPanelWidth,
            right: !panelsLocked && !controlPanelOpen ? -controlPanelWidth : 0,
            zIndex: 2,
          }}
        >
          <SidePanel
            fixtureId={selectedFixtureId}
            getFixtureState={getFixtureState}
            setFixtureState={setFixtureState}
            sidePanelRowOrder={sidePanelRowOrder}
            onClosePanel={onToggleControlPanel}
          />
          {panelDrag.dragging && <DragOverlay />}
          <PanelDragHandle ref={panelDrag.dragElRef} />
        </ResizablePane>
      )}
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

const ResizablePane = styled.div<{ floating: boolean }>`
  flex-shrink: 0;
  max-width: 100%;
  height: 100%;
  position: ${props => (props.floating ? 'absolute' : 'relative')};
  transition:
    left ${quick}s,
    right ${quick}s;
`;

const Nav = styled.div`
  width: 100%;
  height: 100%;
  background: ${grey32};
  display: flex;
  flex-direction: column;

  ::after {
    content: '';
    position: absolute;
    top: 1px;
    right: 0;
    bottom: 0;
    width: 1px;
    background: ${white10};
  }
`;

const NavSlots = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const NavFooter = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 40px;
  padding: 0 4px;
  background: ${grey32};
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
// because otherwise the iframe steals the mousemove events and stops the drag.
const DragOverlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;
