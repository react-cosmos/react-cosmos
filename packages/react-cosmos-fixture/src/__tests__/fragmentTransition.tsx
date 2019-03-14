import * as React from 'react';
import { StateMock } from '@react-mock/state';
import { uuid } from 'react-cosmos-shared2/util';
import { Counter } from '../testHelpers/components';
import { createCompFxState, createFxValues } from '../testHelpers/fixtureState';
import { runFixtureConnectTests } from '../testHelpers';

const rendererId = uuid();
const fixtures = {
  first: (
    <>
      <StateMock state={{ count: 5 }}>
        <Counter />
      </StateMock>
    </>
  )
};
const decorators = {};
const fixtureId = { path: 'first', name: null };

runFixtureConnectTests(mount => {
  it('transitions Fragment from single to multi children', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ update, selectFixture, fixtureStateChange }) => {
        await selectFixture({
          rendererId,
          fixtureId,
          fixtureState: null
        });
        update({
          rendererId,
          fixtures: {
            // This is a very tricky case. When fragments have one child,
            // props.children will be that child. But when fragments have
            // two or more children, props.children will be an array. When
            // transitioning from one Fragment child to more (or viceversa)
            // the first child's path changes
            //   - from: props.children
            //   - to: props.children[0]
            // This leads to a messy situation if we don't do proper cleanup.
            first: (
              <>
                <StateMock state={{ count: 5 }}>
                  <Counter />
                </StateMock>
                <StateMock state={{ count: 10 }}>
                  <Counter />
                </StateMock>
              </>
            )
          },
          decorators
        });
        // Do not remove this line: It captures a regression regarding an error
        // that occurred when component state was read asynchronously
        await new Promise(res => setTimeout(res, 500));
        await fixtureStateChange({
          rendererId,
          fixtureId,
          fixtureState: {
            components: [
              createCompFxState({
                props: [],
                state: createFxValues({ count: 5 })
              }),
              createCompFxState({
                props: [],
                state: createFxValues({ count: 10 })
              })
            ]
          }
        });
      }
    );
  });
});
