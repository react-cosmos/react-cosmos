import React from 'react';
import { FixtureId, FlatFixtureTreeItem } from 'react-cosmos-core';
import { ArraySlot, Slot } from 'react-plugin';
import styled from 'styled-components';
import { useDrag } from '../../hooks/useDrag.js';
import { grey32 } from '../../style/colors.js';
import { quick } from '../../style/vars.js';
import {
  GetFixtureState,
  SetFixtureStateByName,
} from '../RendererCore/spec.js';
import { ControlPanel } from './ControlPanel.js';
import { HomeOverlay } from './HomeOverlay/HomeOverlay.js';
import { NavPanel } from './NavPanel.js';
import { RendererHeader } from './RendererHeader.js';

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
  drawerPanels: boolean;
  globalActionOrder: string[];
  globalOrder: string[];
  navPanelRowOrder: string[];
  controlPanelRowOrder: string[];
  fixtureActionOrder: string[];
  rendererActionOrder: string[];
  onToggleNavPanel: () => unknown;
  onToggleControlPanel: () => unknown;
  onReloadRenderer: () => unknown;
  onCloseFixture: () => unknown;
  setNavPanelWidth: (width: number) => unknown;
  setControlPanelWidth: (width: number) => unknown;
  setDrawerPanels: (enabled: boolean) => unknown;
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
  drawerPanels,
  globalActionOrder,
  globalOrder,
  navPanelRowOrder,
  controlPanelRowOrder,
  fixtureActionOrder,
  rendererActionOrder,
  onToggleNavPanel,
  onToggleControlPanel,
  onReloadRenderer,
  onCloseFixture,
  setNavPanelWidth,
  setControlPanelWidth,
  setDrawerPanels,
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

  const dragging = navDrag.dragging || panelDrag.dragging;
  const showNavPanel = navPanelOpen || !selectedFixtureId;
  const showPanelOverlay =
    drawerPanels &&
    (navPanelOpen || controlPanelOpen) &&
    selectedFixtureId !== null;

  // z-indexes are set here on purpose to show the layer hierarchy at a glance
  return (
    <Container dragging={dragging}>
      {(showNavPanel || drawerPanels) && (
        <ResizablePanel
          inert={!showNavPanel}
          style={{
            position: drawerPanels ? 'absolute' : 'relative',
            left: 0,
            zIndex: 3,
            width: navPanelWidth,
            transform: drawerPanels
              ? `translateX(${showNavPanel ? 0 : -navPanelWidth}px)`
              : undefined,
          }}
        >
          <NavPanel
            rendererConnected={rendererConnected}
            drawerPanels={drawerPanels}
            setDrawerPanels={setDrawerPanels}
            navPanelRowOrder={navPanelRowOrder}
            globalActionOrder={globalActionOrder}
            onClose={onToggleNavPanel}
          />
          {navDrag.dragging && <DragOverlay />}
          <NavDragHandle ref={navDrag.dragElRef} />
        </ResizablePanel>
      )}
      <MainContainer
        key="main"
        style={{
          zIndex: 1,
          filter: drawerPanels
            ? `brightness(${showPanelOverlay ? 0.3 : 1})`
            : undefined,
        }}
      >
        {selectedFixtureId && (
          <RendererHeader
            fixtureItems={fixtureItems}
            fixtureId={selectedFixtureId}
            navPanelOpen={navPanelOpen}
            controlPanelOpen={controlPanelOpen}
            drawerPanels={drawerPanels}
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
              <HomeOverlay />
            </Slot>
          )}
        </RendererContainer>
        {dragging && <DragOverlay />}
        {showPanelOverlay && (
          <PanelBgOverlay
            onClick={() => {
              if (navPanelOpen) onToggleNavPanel();
              if (controlPanelOpen) onToggleControlPanel();
            }}
          />
        )}
      </MainContainer>
      {selectedFixtureId && (controlPanelOpen || drawerPanels) && (
        <ResizablePanel
          inert={!controlPanelOpen}
          style={{
            position: drawerPanels ? 'absolute' : 'relative',
            right: 0,
            zIndex: 2,
            width: controlPanelWidth,
            transform: drawerPanels
              ? `translateX(${controlPanelOpen ? 0 : controlPanelWidth}px)`
              : undefined,
          }}
        >
          <ControlPanel
            fixtureId={selectedFixtureId}
            getFixtureState={getFixtureState}
            setFixtureState={setFixtureState}
            rowOrder={controlPanelRowOrder}
            onClose={onToggleControlPanel}
          />
          {panelDrag.dragging && <DragOverlay />}
          <PanelDragHandle ref={panelDrag.dragElRef} />
        </ResizablePanel>
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
  overflow: hidden;
  display: flex;
  background: ${grey32};
  cursor: ${props => (props.dragging ? 'ew-resize' : 'default')};
`;

const ResizablePanel = styled.div`
  flex-shrink: 0;
  max-width: 100%;
  height: 100%;
  transition: transform ${quick}s;
`;

const MainContainer = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: filter ${quick}s;
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
  cursor: ew-resize;
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

const PanelBgOverlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;
