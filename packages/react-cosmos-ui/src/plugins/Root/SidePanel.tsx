import React from 'react';
import { FixtureId } from 'react-cosmos-core';
import styled from 'styled-components';
import { IconButton32 } from '../../components/buttons/IconButton32.js';
import { ChevronRightIcon } from '../../components/icons/index.js';
import { SidePanelRowSlot } from '../../slots/SidePanelRowSlot.js';
import { grey32, white10 } from '../../style/colors.js';
import {
  GetFixtureState,
  SetFixtureStateByName,
} from '../RendererCore/spec.js';

type Props = {
  fixtureId: FixtureId;
  getFixtureState: GetFixtureState;
  setFixtureState: SetFixtureStateByName;
  sidePanelRowOrder: string[];
  onClosePanel: () => unknown;
};

export const SidePanel = React.memo(function SidePanel({
  fixtureId,
  getFixtureState,
  setFixtureState,
  sidePanelRowOrder,
  onClosePanel,
}: Props) {
  const slotProps = React.useMemo(
    () => ({ fixtureId, getFixtureState, setFixtureState }),
    [fixtureId, getFixtureState, setFixtureState]
  );

  return (
    <Container>
      <Header>
        <IconButton32
          icon={<ChevronRightIcon />}
          title="Hide control panel (P)"
          onClick={onClosePanel}
        />
      </Header>
      <Content>
        <SidePanelRowSlot slotProps={slotProps} plugOrder={sidePanelRowOrder} />
      </Content>
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
    top: 1px;
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
  width: 100%;
  max-height: 100%;
  background: ${grey32};
  overflow-x: hidden;
  overflow-y: auto;
`;
