import React from 'react';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import styled from 'styled-components';
import { CustomStatePanel } from './CustomStatePanel';

const Container = styled.div`
  background: var(--grey2);
`;

export default () => {
  const [fixtureState, setFixtureState] = React.useState<FixtureState>({
    customState: {
      string: {
        type: 'primitive',
        defaultValue: 'hello world',
        currentValue: 'hello world'
      },
      number: {
        type: 'primitive',
        defaultValue: 1337,
        currentValue: 1337
      },
      boolean: {
        type: 'primitive',
        defaultValue: false,
        currentValue: false
      },
      null: {
        type: 'primitive',
        defaultValue: null,
        currentValue: null
      }
    }
  });

  return (
    <Container>
      <CustomStatePanel
        fixtureState={fixtureState}
        onFixtureStateChange={setFixtureState}
      />
    </Container>
  );
};
