import { waitFor } from '@testing-library/react';
import React from 'react';
import {
  createValues,
  removeClassStateFixtureStateItem,
  updateClassStateFixtureStateItem,
  uuid,
} from 'react-cosmos-core';
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
  first: <Counter />,
});
const fixtureId = { path: 'first' };

testRenderer(
  'captures initial state',
  { rendererId, fixtures },
  async ({ rootText, selectFixture, fixtureStateChange }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await waitFor(() => expect(rootText()).toBe('0 times'));
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

testRenderer(
  'overwrites initial state',
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
          values: createValues({ count: 5 }),
        }),
      },
    });
    await waitFor(() => expect(rootText()).toBe('5 times'));
  }
);

testRenderer(
  'removes initial state property',
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
  'reverts to initial state',
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
          values: createValues({ count: 5 }),
        }),
      },
    });
    await waitFor(() => expect(rootText()).toBe('5 times'));
    setFixtureState({
      rendererId,
      fixtureId,
      fixtureState: {
        classState: removeClassStateFixtureStateItem(classStateFs, elementId),
      },
    });
    await waitFor(() => expect(rootText()).toBe('0 times'));
  }
);
