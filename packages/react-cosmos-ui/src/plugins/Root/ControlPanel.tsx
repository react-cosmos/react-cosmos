import React from 'react';
import { FixtureId } from 'react-cosmos-core';
import styled from 'styled-components';
import { IconButton32 } from '../../components/buttons/IconButton32.js';
import { ChevronRightIcon } from '../../components/icons/index.js';
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
  toolbarPosition: 'top' | 'bottom';
  rowOrder: string[];
  onClose: () => unknown;
};

export const ControlPanel = React.memo(function ControlPanel({
  fixtureId,
  getFixtureState,
  setFixtureState,
  toolbarPosition,
  rowOrder,
  onClose,
}: Props) {
  const slotProps = React.useMemo(
    () => ({ fixtureId, getFixtureState, setFixtureState }),
    [fixtureId, getFixtureState, setFixtureState]
  );

  const header = (
    <Header>
      <IconButton32
        icon={<ChevronRightIcon />}
        title="Hide control panel (P)"
        onClick={onClose}
      />
    </Header>
  );

  return (
    <Container>
      {toolbarPosition === 'top' && header}
      <Content>
        <ControlPanelRowSlot slotProps={slotProps} plugOrder={rowOrder} />
      </Content>
      {toolbarPosition === 'bottom' && header}
    </Container>
  );
});

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background: ${grey32};

  ::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 1px;
    background: ${white10};
  }
`;

const Header = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  height: 40px;
  background: ${grey32};
  padding: 0 4px;
`;

// The background color is required for the proper scroll bar color theme
const Content = styled.div`
  flex: 1;
  width: 100%;
  background: ${grey32};
  overflow-x: hidden;
  overflow-y: auto;
`;
