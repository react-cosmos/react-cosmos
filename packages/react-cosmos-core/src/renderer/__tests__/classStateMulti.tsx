import { StateMock } from '@react-mock/state';
import retry from '@skidding/async-retry';
import React from 'react';
import { updateFixtureStateClassState } from '../../fixtureState/classState.js';
import { createValues } from '../../fixtureState/createValues.js';
import { uuid } from '../../utils/uuid.js';
import { Counter } from '../testHelpers/components.js';
import {
  anyClassState,
  anyProps,
  getClassState,
} from '../testHelpers/fixtureState.js';
import { testRenderer } from '../testHelpers/testRenderer.js';
import { wrapDefaultExport } from '../testHelpers/wrapDefaultExport.js';

const rendererId = uuid();
const fixtures = wrapDefaultExport({
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

testRenderer(
  'captures mocked state from multiple instances',
  { rendererId, fixtures },
  async ({ selectFixture, fixtureStateChange }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
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

testRenderer(
  'overwrites mocked state in second instances',
  { rendererId, fixtures },
  async ({ renderer, selectFixture, setFixtureState, getLastFixtureState }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    const fixtureState = await getLastFixtureState();
    const [, { elementId }] = getClassState(fixtureState, 2);
    setFixtureState({
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
