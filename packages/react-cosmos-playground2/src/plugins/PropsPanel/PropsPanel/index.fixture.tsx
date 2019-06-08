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
  const [treeExpansion, setTreeExpansion] = React.useState({});

  return (
    <PropsPanel
      fixtureState={fixtureState}
      treeExpansion={treeExpansion}
      onFixtureStateChange={setFixtureState}
      onTreeExpansionChange={(elementId, newTreeExpansion) =>
        setTreeExpansion({
          ...treeExpansion,
          [stringifyElementId(elementId)]: newTreeExpansion
        })
      }
    />
  );
};
