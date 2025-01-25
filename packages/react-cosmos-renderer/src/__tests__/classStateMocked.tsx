import { waitFor } from '@testing-library/react';
import React from 'react';
import {
  createValues,
  removeClassStateFixtureStateItem,
  updateClassStateFixtureStateItem,
  uuid,
} from 'react-cosmos-core';
import { ClassStateMock } from '../fixture/ClassStateMock.js';
import { CoolCounter, Counter } from '../testHelpers/components.js';
import {
  anyClassState,
  anyProps,
  getClassState,
} from '../testHelpers/fixtureState.js';
import { testRenderer } from '../testHelpers/testRenderer.js';
import { wrapDefaultExport } from '../testHelpers/wrapDefaultExport.js';
import { clearSetTimeoutAct, wrapSetTimeoutAct } from '../wrapSetTimeoutAct.js';

beforeEach(wrapSetTimeoutAct);
afterEach(clearSetTimeoutAct);

const rendererId = uuid();
const fixtures = wrapDefaultExport({
  first: (
    <ClassStateMock state={{ count: 5 }}>
      <Counter />
    </ClassStateMock>
  ),
});
const fixtureId = { path: 'first' };

testRenderer(
  'captures mocked state',
  { rendererId, fixtures },
  async ({ rootText, selectFixture, fixtureStateChange }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await waitFor(() => expect(rootText()).toBe('5 times'));
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: [anyProps()],
        classState: [
          anyClassState({
            values: createValues({ count: 5 }),
            componentName: 'Counter',
          }),
        ],
      },
    });
  }
);

testRenderer(
  'overwrites mocked state',
  { rendererId, fixtures },
  async ({ rootText, selectFixture, setFixtureState, getLastFixtureState }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    const fixtureState = await getLastFixtureState();
    const classStateFs = getClassState(fixtureState);
    const [{ elementId }] = classStateFs;
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
    await waitFor(() => expect(rootText()).toBe('100 times'));
    // A second update will provide code coverage for a different branch:
    // the transition between fixture state values
    setFixtureState({
      rendererId,
      fixtureId,
      fixtureState: {
        classState: updateClassStateFixtureStateItem({
          classStateFs,
          elementId,
          values: createValues({ count: 200 }),
        }),
      },
    });
    await waitFor(() => expect(rootText()).toBe('200 times'));
  }
);

testRenderer(
  'removes mocked state property',
  { rendererId, fixtures },
  async ({ rootText, selectFixture, setFixtureState, getLastFixtureState }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    const fixtureState = await getLastFixtureState();
    const classStateFs = getClassState(fixtureState);
    const [{ elementId }] = classStateFs;
    setFixtureState({
      rendererId,
      fixtureId,
      fixtureState: {
        classState: updateClassStateFixtureStateItem({
          classStateFs,
          elementId,
          values: {},
        }),
      },
    });
    await waitFor(() => expect(rootText()).toBe('Missing count'));
  }
);

testRenderer(
  'reverts to mocked state',
  { rendererId, fixtures },
  async ({
    rootText,
    selectFixture,
    setFixtureState,
    fixtureStateChange,
    getLastFixtureState,
  }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    const fixtureState = await getLastFixtureState();
    const classStateFs = getClassState(fixtureState);
    const [{ elementId }] = classStateFs;
    setFixtureState({
      rendererId,
      fixtureId,
      fixtureState: {
        classState: updateClassStateFixtureStateItem({
          classStateFs,
          elementId,
          values: createValues({ count: 10 }),
        }),
      },
    });
    await waitFor(() => expect(rootText()).toBe('10 times'));
    setFixtureState({
      rendererId,
      fixtureId,
      fixtureState: {
        classState: removeClassStateFixtureStateItem(classStateFs, elementId),
      },
    });
    await waitFor(() => expect(rootText()).toBe('5 times'));
    // After the state is removed from the fixture state, the original
    // state is added back through a fixtureStateChange message
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: [anyProps()],
        classState: [
          anyClassState({
            values: createValues({ count: 5 }),
            componentName: 'Counter',
          }),
        ],
      },
    });
  }
);

testRenderer(
  'applies fixture state to replaced component type',
  { rendererId, fixtures },
  async ({
    rootText,
    update,
    selectFixture,
    setFixtureState,
    getLastFixtureState,
  }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    const fixtureState = await getLastFixtureState();
    const classStateFs = getClassState(fixtureState);
    const [{ elementId }] = classStateFs;
    setFixtureState({
      rendererId,
      fixtureId,
      fixtureState: {
        classState: updateClassStateFixtureStateItem({
          classStateFs,
          elementId,
          values: createValues({ count: 50 }),
        }),
      },
    });
    await waitFor(() => expect(rootText()).toBe('50 times'));
    update({
      rendererId,
      fixtures: wrapDefaultExport({
        first: (
          <ClassStateMock state={{ count: 5 }}>
            <CoolCounter />
          </ClassStateMock>
        ),
      }),
    });
    await waitFor(() => expect(rootText()).toBe('50 timez'));
  }
);

testRenderer(
  'overwrites fixture state on fixture change',
  { rendererId, fixtures },
  async ({
    rootText,
    update,
    selectFixture,
    setFixtureState,
    fixtureStateChange,
    getLastFixtureState,
  }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    const fixtureState = await getLastFixtureState();
    const classStateFs = getClassState(fixtureState);
    const [{ elementId }] = classStateFs;
    setFixtureState({
      rendererId,
      fixtureId,
      fixtureState: {
        classState: updateClassStateFixtureStateItem({
          classStateFs,
          elementId,
          values: createValues({ count: 6 }),
        }),
      },
    });
    await waitFor(() => expect(rootText()).toBe('6 times'));
    // When the fixture changes the fixture state follows along
    update({
      rendererId,
      fixtures: wrapDefaultExport({
        first: (
          <ClassStateMock state={{ count: 50 }}>
            <Counter />
          </ClassStateMock>
        ),
      }),
    });
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: [anyProps()],
        classState: [
          anyClassState({
            values: createValues({ count: 50 }),
            componentName: 'Counter',
          }),
        ],
      },
    });
    expect(rootText()).toBe('50 times');
  }
);

testRenderer(
  'clears fixture state for removed fixture element',
  { rendererId, fixtures },
  async ({ rootText, update, selectFixture, fixtureStateChange }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: [anyProps()],
        classState: [
          anyClassState({
            values: createValues({ count: 5 }),
            componentName: 'Counter',
          }),
        ],
      },
    });
    update({
      rendererId,
      fixtures: wrapDefaultExport({
        // Counter element from fixture is gone, and so should the
        // fixture state related to it.
        first: 'No counts for you.',
      }),
    });
    await waitFor(() => expect(rootText()).toBe('No counts for you.'));
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: [],
        classState: [],
      },
    });
  }
);
