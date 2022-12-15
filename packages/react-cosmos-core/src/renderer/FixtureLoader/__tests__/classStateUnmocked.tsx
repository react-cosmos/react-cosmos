import retry from '@skidding/async-retry';
import React from 'react';
import {
  removeFixtureStateClassState,
  updateFixtureStateClassState,
} from '../../../fixtureState/classState.js';
import { createValues } from '../../../fixtureState/createValues.js';
import { uuid } from '../../../utils/uuid.js';
import { Counter } from '../testHelpers/components.js';
import {
  anyClassState,
  anyProps,
  getClassState,
} from '../testHelpers/fixtureState.js';
import { testFixtureLoader } from '../testHelpers/index.js';
import { wrapFixtures } from '../testHelpers/wrapFixture.js';

const rendererId = uuid();
const fixtures = wrapFixtures({
  first: <Counter />,
});
const fixtureId = { path: 'first' };

testFixtureLoader(
  'captures initial state',
  { rendererId, fixtures },
  async ({ renderer, selectFixture, fixtureStateChange }) => {
    await selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await retry(() => expect(renderer.toJSON()).toBe('0 times'));
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: [anyProps()],
        classState: [
          anyClassState({
            values: createValues({ count: 0 }),
            componentName: 'Counter',
          }),
        ],
      },
    });
  }
);

testFixtureLoader(
  'overwrites initial state',
  { rendererId, fixtures },
  async ({ renderer, selectFixture, setFixtureState, getLastFixtureState }) => {
    await selectFixture({ rendererId, fixtureId, fixtureState: {} });
    const fixtureState = await getLastFixtureState();
    const [{ elementId }] = getClassState(fixtureState);
    await setFixtureState({
      rendererId,
      fixtureId,
      fixtureState: {
        classState: updateFixtureStateClassState({
          fixtureState,
          elementId,
          values: createValues({ count: 5 }),
        }),
      },
    });
    await retry(() => expect(renderer.toJSON()).toBe('5 times'));
  }
);

testFixtureLoader(
  'removes initial state property',
  { rendererId, fixtures },
  async ({ renderer, selectFixture, setFixtureState, getLastFixtureState }) => {
    await selectFixture({ rendererId, fixtureId, fixtureState: {} });
    const fixtureState = await getLastFixtureState();
    const [{ elementId }] = getClassState(fixtureState);
    await setFixtureState({
      rendererId,
      fixtureId,
      fixtureState: {
        classState: updateFixtureStateClassState({
          fixtureState,
          elementId,
          values: {},
        }),
      },
    });
    await retry(() => expect(renderer.toJSON()).toBe('Missing count'));
  }
);

testFixtureLoader(
  'reverts to initial state',
  { rendererId, fixtures },
  async ({ renderer, selectFixture, setFixtureState, getLastFixtureState }) => {
    await selectFixture({ rendererId, fixtureId, fixtureState: {} });
    const fixtureState = await getLastFixtureState();
    const [{ elementId }] = getClassState(fixtureState);
    await setFixtureState({
      rendererId,
      fixtureId,
      fixtureState: {
        classState: updateFixtureStateClassState({
          fixtureState,
          elementId,
          values: createValues({ count: 5 }),
        }),
      },
    });
    await retry(() => expect(renderer.toJSON()).toBe('5 times'));
    await setFixtureState({
      rendererId,
      fixtureId,
      fixtureState: {
        classState: removeFixtureStateClassState(fixtureState, elementId),
      },
    });
    await retry(() => expect(renderer.toJSON()).toBe('0 times'));
  }
);
