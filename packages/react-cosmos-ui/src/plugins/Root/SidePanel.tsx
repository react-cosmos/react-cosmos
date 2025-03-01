import React from 'react';
import { FixtureId } from 'react-cosmos-core';
import styled from 'styled-components';
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
};

export const SidePanel = React.memo(function SidePanel({
  fixtureId,
  getFixtureState,
  setFixtureState,
  sidePanelRowOrder,
}: Props) {
  const slotProps = React.useMemo(
    () => ({ fixtureId, getFixtureState, setFixtureState }),
    [fixtureId, getFixtureState, setFixtureState]
  );
  return (
    <Container>
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
  border-left: 1px solid ${white10};
  background: ${grey32};
`;

// The background color is required for the proper scroll bar color theme
const Content = styled.div`
  width: 100%;
  max-height: 100%;
  background: ${grey32};
  overflow-x: hidden;
  overflow-y: auto;
`;
