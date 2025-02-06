import { waitFor } from '@testing-library/react';
import React from 'react';
import {
  createValues,
  updateClassStateFixtureStateItem,
  uuid,
} from 'react-cosmos-core';
import { ClassStateMock } from '../fixture/ClassStateMock.js';
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
      <ClassStateMock state={{ count: 5 }}>
        <Counter />
      </ClassStateMock>
      <ClassStateMock state={{ count: 10 }}>
        <Counter />
      </ClassStateMock>
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
  async ({ rootText, selectFixture, setFixtureState, getLastFixtureState }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    const fixtureState = await getLastFixtureState();
    const classStateFs = getClassState(fixtureState, 2);
    const [, { elementId }] = classStateFs;
    setFixtureState({
      rendererId,
      fixtureId,
      fixtureState: {
        classState: updateClassStateFixtureStateItem({
          classStateFs,
          elementId,
          values: createValues({ count: 100 }),
        }),
      },
    });
    await waitFor(() =>
      expect(rootText()).toEqual(['5 times', '100 times'].join(''))
    );
  }
);
