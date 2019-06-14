import React from 'react';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import { Viewport } from 'react-cosmos-fixture';
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
            stringifiedValue: `<div>\n  <div />\n  <div />\n</div>`
          },
          unserializable2: {
            type: 'unserializable',
            stringifiedValue: `/whatyouseeiswhatyougetsometimes/i`
          }
        }
      },
      {
        componentName: '',
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
              },
              boolean: {
                type: 'primitive',
                value: false
              }
            }
          },
          string: {
            type: 'primitive',
            value: 'hello world hello world hello world hello world'
          },
          numberWithAVeryVeryVeeeryLongName: {
            type: 'primitive',
            value: 1337
          },
          boolean: {
            type: 'primitive',
            value: false
          }
        }
      }
    ]
  });
  const [fixtureExpansion, setFixtureExpansion] = React.useState({});

  return (
    <Viewport width={320} height={400}>
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
    </Viewport>
  );
};
