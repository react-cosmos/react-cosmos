import { StateMock } from '@react-mock/state';
import retry from '@skidding/async-retry';
import React from 'react';
import { updateFixtureStateClassState } from '../../../fixtureState/classState.js';
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
  first: (
    <>
      <StateMock state={{ count: 5 }}>
        <Counter />
      </StateMock>
      <StateMock state={{ count: 10 }}>
        <Counter />
      </StateMock>
    </>
  ),
});
const fixtureId = { path: 'first' };

testFixtureLoader(
  'captures mocked state from multiple instances',
  { rendererId, fixtures },
  async ({ selectFixture, fixtureStateChange }) => {
    await selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: [anyProps(), anyProps()],
        classState: [
          anyClassState({
            values: createValues({ count: 5 }),
            componentName: 'Counter',
          }),
          anyClassState({
            values: createValues({ count: 10 }),
            componentName: 'Counter',
          }),
        ],
      },
    });
  }
);

testFixtureLoader(
  'overwrites mocked state in second instances',
  { rendererId, fixtures },
  async ({ renderer, selectFixture, setFixtureState, getLastFixtureState }) => {
    await selectFixture({ rendererId, fixtureId, fixtureState: {} });
    const fixtureState = await getLastFixtureState();
    const [, { elementId }] = getClassState(fixtureState, 2);
    await setFixtureState({
      rendererId,
      fixtureId,
      fixtureState: {
        classState: updateFixtureStateClassState({
          fixtureState,
          elementId,
          values: createValues({ count: 100 }),
        }),
      },
    });
    await retry(() =>
      expect(renderer.toJSON()).toEqual(['5 times', '100 times'])
    );
  }
);
