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
  panelsLocked: boolean;
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
  setPanelsLocked: (locked: boolean) => unknown;
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
          inert={!panelsLocked && !showNavPanel}
          style={{
            position: panelsLocked ? 'relative' : 'absolute',
            left: 0,
            zIndex: 3,
            width: navPanelWidth,
            transform: `translateX(${!panelsLocked && !showNavPanel ? -navPanelWidth : 0}px)`,
          }}
        >
          <NavPanel
            rendererConnected={rendererConnected}
            panelsLocked={panelsLocked}
            setPanelsLocked={setPanelsLocked}
            navPanelRowOrder={navPanelRowOrder}
            globalActionOrder={globalActionOrder}
            onClose={onToggleNavPanel}
          />
          {navDrag.dragging && <DragOverlay />}
          <NavDragHandle ref={navDrag.dragElRef} />
        </ResizablePane>
      )}
      <MainContainer key="main" style={{ zIndex: 1 }}>
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
          inert={!panelsLocked && !controlPanelOpen}
          style={{
            position: panelsLocked ? 'relative' : 'absolute',
            right: 0,
            zIndex: 2,
            width: controlPanelWidth,
            transform: `translateX(${!panelsLocked && !controlPanelOpen ? controlPanelWidth : 0}px)`,
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
  overflow: hidden;
  display: flex;
  background: ${grey32};
  cursor: ${props => (props.dragging ? 'col-resize' : 'default')};
`;

const ResizablePane = styled.div`
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
