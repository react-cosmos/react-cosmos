import React from 'react';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import { stringifyElementId } from '../shared';
import { PropsPanel } from '.';

export default () => {
  const [fixtureState, setFixtureState] = React.useState<FixtureState>({
    props: [
      {
        componentName: 'FooComponent',
        elementId: { decoratorId: 'root', elPath: 'props.children[0]' },
        renderKey: 0,
        values: {
          string: {
            type: 'primitive',
            value: 'hello world'
          },
          number: {
            type: 'primitive',
            value: 1337
          },
          boolean: {
            type: 'primitive',
            value: false
          },
          null: {
            type: 'primitive',
            value: null
          },
          unserializable: {
            type: 'unserializable',
            stringifiedValue: '<div />'
          }
        }
      },
      {
        componentName: 'BarComponent',
        elementId: { decoratorId: 'root', elPath: 'props.children[1]' },
        renderKey: 0,
        values: {
          object: {
            type: 'object',
            values: {
              string: {
                type: 'primitive',
                value: 'hello world'
              },
              number: {
                type: 'primitive',
                value: 1337
              }
            }
          }
        }
      }
    ]
  });
  const [fixtureExpansion, setFixtureExpansion] = React.useState({});

  return (
    <PropsPanel
      fixtureState={fixtureState}
      fixtureExpansion={fixtureExpansion}
      onFixtureStateChange={setFixtureState}
      onElementExpansionChange={(elementId, treeExpansion) => {
        setFixtureExpansion({
          ...fixtureExpansion,
          [stringifyElementId(elementId)]: treeExpansion
        });
      }}
    />
  );
};
