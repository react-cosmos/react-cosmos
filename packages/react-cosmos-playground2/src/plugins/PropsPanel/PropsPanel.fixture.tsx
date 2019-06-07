import React from 'react';
import { PropsPanel } from './PropsPanel';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';

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
          }
        }
      },
      {
        componentName: 'BarComponent',
        elementId: { decoratorId: 'root', elPath: 'props.children[1]' },
        renderKey: 0,
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
    ]
  });

  return (
    <PropsPanel fixtureState={fixtureState} setFixtureState={setFixtureState} />
  );
};
