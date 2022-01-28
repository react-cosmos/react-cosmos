import React from 'react';
import { createValues } from '../../fixtureState';
import { uuid } from '../../util';
import { testFixtureLoader } from '../testHelpers';
import { Counter } from '../testHelpers/components';
import { anyClassState, anyProps } from '../testHelpers/fixtureState';
import { wrapFixtures } from '../testHelpers/wrapFixture';

const rendererId = uuid();
const fixtures = wrapFixtures({
  first: <Counter />,
});
const fixtureId = { path: 'first' };

// NOTE: This is a regression test that was created for a bug that initally
// slipped unnoticed in https://github.com/react-cosmos/react-cosmos/pull/893.
// Because element refs from unmounted FixtureCapture instances were
// incorrectly reused, component state was no longer picked up after
// FixtureCapture remounted. This was related to the refactor of
// FixtureCapture/attachChildRefs in
// https://github.com/react-cosmos/react-cosmos/commit/56494b6ea10785cc3db8dda7a7fbcad62c8e1c12
testFixtureLoader(
  'captures initial state after re-selecting fixture',
  { rendererId, fixtures },
  async ({ selectFixture, fixtureStateChange }) => {
    await selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: [anyProps()],
        classState: [
          anyClassState({
            values: createValues({ count: 0 }),
          }),
        ],
      },
    });
  }
);
