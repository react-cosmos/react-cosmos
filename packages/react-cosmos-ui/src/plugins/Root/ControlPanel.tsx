import React from 'react';
import { FixtureId } from 'react-cosmos-core';
import styled from 'styled-components';
import { IconButton32 } from '../../components/buttons/IconButton32.js';
import { ChevronRightIcon, ChevronDownIcon, PanelPositionIcon } from '../../components/icons/index.js';
import { ControlPanelRowSlot } from '../../slots/ControlPanelRowSlot.js';
import { grey32, white10 } from '../../style/colors.js';
import {
  GetFixtureState,
  SetFixtureStateByName,
} from '../RendererCore/spec.js';

type Props = {
  fixtureId: FixtureId;
  getFixtureState: GetFixtureState;
  setFixtureState: SetFixtureStateByName;
  rowOrder: string[];
  position: 'right' | 'bottom';
  onClose: () => unknown;
  onTogglePosition: () => unknown;
};

export const ControlPanel = React.memo(function ControlPanel({
  fixtureId,
  getFixtureState,
  setFixtureState,
  rowOrder,
  position,
  onClose,
  onTogglePosition,
}: Props) {
  const slotProps = React.useMemo(
    () => ({ fixtureId, getFixtureState, setFixtureState }),
    [fixtureId, getFixtureState, setFixtureState]
  );

  return (
    <Container position={position}>
      <Header position={position}>
        <IconButton32
          icon={position === 'right' ? <ChevronRightIcon /> : <ChevronDownIcon />}
          title="Hide control panel (P)"
          onClick={onClose}
        />
        <HeaderSpacer />
        <IconButton32
          icon={<PanelPositionIcon />}
          title={`Move panel to ${position === 'right' ? 'bottom' : 'right'}`}
          onClick={onTogglePosition}
        />
      </Header>
      <Content position={position}>
        <ControlPanelRowSlot slotProps={slotProps} plugOrder={rowOrder} />
      </Content>
    </Container>
  );
});

type PositionProps = {
  position: 'right' | 'bottom';
};

const Container = styled.div<PositionProps>`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background: ${grey32};

  ::after {
    content: '';
    position: absolute;
    ${props => props.position === 'right' ? `
      top: 0;
      left: 0;
      bottom: 0;
      width: 1px;
    ` : `
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
    `}
    background: ${white10};
  }
`;

const Header = styled.div<PositionProps>`
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  height: 40px;
  background: ${grey32};
  padding: 0 4px;
`;

const HeaderSpacer = styled.div`
  flex: 1;
`;

// The background color is required for the proper scroll bar color theme
const Content = styled.div<PositionProps>`
  width: 100%;
  flex: 1;
  background: ${grey32};
  overflow-x: hidden;
  overflow-y: auto;
  display: ${props => props.position === 'bottom' ? 'flex' : 'block'};
  flex-direction: ${props => props.position === 'bottom' ? 'row' : 'column'};
`;
