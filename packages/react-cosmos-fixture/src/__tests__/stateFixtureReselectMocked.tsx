import * as React from 'react';
import { uuid } from 'react-cosmos-shared2/util';
import { StateMock } from '@react-mock/state';
import { Counter } from '../testHelpers/components';
import { createCompFxState, createFxValues } from '../testHelpers/fixtureState';
import { runFixtureConnectTests } from '../testHelpers';

const rendererId = uuid();
const fixtures = {
  first: (
    <StateMock state={{ count: 5 }}>
      <Counter />
    </StateMock>
  )
};
const decorators = {};
const fixtureId = { path: 'first', name: null };

runFixtureConnectTests(mount => {
  // NOTE: This is a regression test that was created for a bug that initally
  // slipped unnoticed in https://github.com/react-cosmos/react-cosmos/pull/893.
  // Because element refs from unmounted FixtureCapture instances were
  // incorrectly reused, component state was no longer picked up after
  // FixtureCapture remounted. This was related to the refactor of
  // FixtureCapture/attachChildRefs in
  // https://github.com/react-cosmos/react-cosmos/commit/56494b6ea10785cc3db8dda7a7fbcad62c8e1c12
  it('captures initial state after re-selecting fixture', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ selectFixture, fixtureStateChange }) => {
        await selectFixture({
          rendererId,
          fixtureId,
          fixtureState: {}
        });
        await selectFixture({
          rendererId,
          fixtureId,
          fixtureState: {}
        });
        await fixtureStateChange({
          rendererId,
          fixtureId,
          fixtureState: {
            components: [
              createCompFxState({
                componentName: 'Counter',
                props: [],
                state: createFxValues({ count: 5 })
              })
            ]
          }
        });
      }
    );
  });
});
