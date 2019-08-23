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
        defaultValue: { type: 'primitive', value: 'hello world' },
        currentValue: { type: 'primitive', value: 'hello world' }
      },
      number: {
        defaultValue: { type: 'primitive', value: 1337 },
        currentValue: { type: 'primitive', value: 1337 }
      },
      boolean: {
        defaultValue: { type: 'primitive', value: false },
        currentValue: { type: 'primitive', value: false }
      },
      null: {
        defaultValue: { type: 'primitive', value: null },
        currentValue: { type: 'primitive', value: null }
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
