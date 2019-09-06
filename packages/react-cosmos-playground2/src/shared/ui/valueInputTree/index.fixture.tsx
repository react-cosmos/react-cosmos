import React from 'react';
import { FixtureStateValues } from 'react-cosmos-shared2/fixtureState';
import { useValue } from 'react-cosmos/fixture';
import { ValueInputTree } from '.';
import { TreeExpansion } from '../TreeView';

export default () => {
  const [values, setValues] = useValue<FixtureStateValues>('values', {
    defaultValue: {
      object: {
        type: 'object',
        values: {
          element: {
            type: 'unserializable',
            stringifiedValue: '<div />'
          }
        }
      },
      string: {
        type: 'primitive',
        value: 'hello world'
      },
      number: {
        type: 'primitive',
        value: 1337
      }
    }
  });
  const [treeExpansion, setTreeExpansion] = useValue<TreeExpansion>(
    'treeExpansion',
    { defaultValue: { object: true } }
  );
  return (
    <ValueInputTree
      id="root"
      values={values}
      treeExpansion={treeExpansion}
      onValueChange={setValues}
      onTreeExpansionChange={setTreeExpansion}
    />
  );
};
