import React from 'react';
import { FixtureId, FixtureState, StateUpdater } from 'react-cosmos-core';
import styled from 'styled-components';
import { SidePanelRowSlot } from '../../slots/SidePanelRowSlot.js';
import { grey32 } from '../../style/colors.js';

type Props = {
  fixtureId: FixtureId;
  fixtureState: FixtureState;
  onFixtureStateChange: (stateUpdater: StateUpdater<FixtureState>) => void;
  sidePanelRowOrder: string[];
};

export const SidePanel = React.memo(function SidePanel({
  fixtureId,
  fixtureState,
  onFixtureStateChange,
  sidePanelRowOrder,
}: Props) {
  const slotProps = React.useMemo(
    () => ({ fixtureId, fixtureState, onFixtureStateChange }),
    [fixtureId, fixtureState, onFixtureStateChange]
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
  padding: 0 0 0 1px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
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
