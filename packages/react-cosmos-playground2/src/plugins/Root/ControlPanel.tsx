import React from 'react';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import { StateUpdater } from 'react-cosmos-shared2/util';
import styled from 'styled-components';
import { ControlPanelRowSlot } from '../../shared/slots/ControlPanelRowSlot';
import { grey32 } from '../../shared/ui/colors';

type Props = {
  fixtureId: FixtureId;
  fixtureState: FixtureState;
  onFixtureStateChange: (stateUpdater: StateUpdater<FixtureState>) => void;
  controlPanelRowOrder: string[];
};

export const ControlPanel = React.memo(function ControlPanel({
  fixtureId,
  fixtureState,
  onFixtureStateChange,
  controlPanelRowOrder,
}: Props) {
  const slotProps = React.useMemo(
    () => ({ fixtureId, fixtureState, onFixtureStateChange }),
    [fixtureId, fixtureState, onFixtureStateChange]
  );
  return (
    <Container>
      <Content>
        <ControlPanelRowSlot
          slotProps={slotProps}
          plugOrder={controlPanelRowOrder}
        />
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
`;

const Content = styled.div`
  width: 100%;
  max-height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
`;
