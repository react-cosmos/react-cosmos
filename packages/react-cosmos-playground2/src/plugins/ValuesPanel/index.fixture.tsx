import React from 'react';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import { useValue } from 'react-cosmos/fixture';
import { ValuesPanel } from './ValuesPanel';

export default () => {
  const [fixtureState, setFixtureState] = useValue<FixtureState>(
    'fixtureState',
    {
      defaultValue: {
        values: {
          string: {
            defaultValue: { type: 'primitive', value: 'hello world' },
            currentValue: { type: 'primitive', value: 'hello world' },
          },
          number: {
            defaultValue: { type: 'primitive', value: 1337 },
            currentValue: { type: 'primitive', value: 1337 },
          },
          boolean: {
            defaultValue: { type: 'primitive', value: false },
            currentValue: { type: 'primitive', value: false },
          },
          null: {
            defaultValue: { type: 'primitive', value: null },
            currentValue: { type: 'primitive', value: null },
          },
          undefined: {
            defaultValue: { type: 'primitive', value: undefined },
            currentValue: { type: 'primitive', value: undefined },
          },
          object: {
            defaultValue: {
              type: 'object',
              values: {
                isAdmin: { type: 'primitive', value: true },
                name: { type: 'primitive', value: 'Pat D' },
                age: { type: 'primitive', value: 45 },
              },
            },
            currentValue: {
              type: 'object',
              values: {
                isAdmin: { type: 'primitive', value: true },
                name: { type: 'primitive', value: 'Pat D' },
                age: { type: 'primitive', value: 45 },
              },
            },
          },
        },
      },
    }
  );
  const [treeExpansion, setTreeExpansion] = useValue('treeExpansion', {
    defaultValue: {},
  });

  return (
    <ValuesPanel
      fixtureState={fixtureState}
      treeExpansion={treeExpansion}
      onFixtureStateChange={setFixtureState}
      onTreeExpansionChange={setTreeExpansion}
    />
  );
};
