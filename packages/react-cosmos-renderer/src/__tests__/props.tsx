import { waitFor } from '@testing-library/react';
import React from 'react';
import {
  createValues,
  removePropsFixtureStateItem,
  updatePropsFixtureStateItem,
  uuid,
} from 'react-cosmos-core';
import { HelloMessage } from '../testHelpers/components.js';
import { anyProps, getProps } from '../testHelpers/fixtureState.js';
import { testRenderer } from '../testHelpers/testRenderer.js';
import { wrapDefaultExport } from '../testHelpers/wrapDefaultExport.js';

const rendererId = uuid();
const fixtures = wrapDefaultExport({
  first: <HelloMessage name="Blanca" />,
});
const fixtureId = { path: 'first' };

testRenderer(
  'captures props',
  { rendererId, fixtures },
  async ({ containerText, selectFixture, fixtureStateChange }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await waitFor(() => expect(containerText()).toBe('Hello Blanca'));
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: [
          anyProps({
            componentName: 'HelloMessage',
            values: createValues({ name: 'Blanca' }),
          }),
        ],
      },
    });
  }
);

testRenderer(
  'overwrites prop',
  { rendererId, fixtures },
  async ({
    containerText,
    selectFixture,
    setFixtureState,
    getLastFixtureState,
  }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    const fixtureState = await getLastFixtureState();
    const propsFs = getProps(fixtureState);
    const [{ elementId }] = propsFs;
    setFixtureState({
      rendererId,
      fixtureId,
      fixtureState: {
        props: updatePropsFixtureStateItem({
          propsFs,
          elementId,
          values: createValues({ name: 'B' }),
        }),
      },
    });
    await waitFor(() => expect(containerText()).toBe('Hello B'));
  }
);

testRenderer(
  'removes prop',
  { rendererId, fixtures },
  async ({
    containerText,
    selectFixture,
    setFixtureState,
    getLastFixtureState,
  }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    const fixtureState = await getLastFixtureState();
    const propsFs = getProps(fixtureState);
    const [{ elementId }] = propsFs;
    setFixtureState({
      rendererId,
      fixtureId,
      fixtureState: {
        props: updatePropsFixtureStateItem({
          propsFs,
          elementId,
          values: {},
        }),
      },
    });
    await waitFor(() => expect(containerText()).toBe('Hello Stranger'));
  }
);

testRenderer(
  'clears props',
  { rendererId, fixtures },
  async ({
    containerText,
    selectFixture,
    setFixtureState,
    fixtureStateChange,
    getLastFixtureState,
  }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    const fixtureState = await getLastFixtureState();
    const propsFs = getProps(fixtureState);
    const [{ elementId }] = propsFs;
    setFixtureState({
      rendererId,
      fixtureId,
      fixtureState: {
        props: updatePropsFixtureStateItem({
          propsFs,
          elementId,
          values: createValues({ name: 'B' }),
        }),
      },
    });
    await waitFor(() => expect(containerText()).toBe('Hello B'));
    setFixtureState({
      rendererId,
      fixtureId,
      fixtureState: {
        props: removePropsFixtureStateItem(propsFs, elementId),
      },
    });
    await waitFor(() => expect(containerText()).toBe('Hello Blanca'));
    // After the props are removed from the fixture state, the original
    // props are added back through a fixtureStateChange message
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: [
          anyProps({
            componentName: 'HelloMessage',
            values: createValues({ name: 'Blanca' }),
          }),
        ],
      },
    });
  }
);

testRenderer(
  'overwrites fixture state on fixture change',
  { rendererId, fixtures },
  async ({
    containerText,
    update,
    selectFixture,
    setFixtureState,
    fixtureStateChange,
    getLastFixtureState,
  }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    const fixtureState = await getLastFixtureState();
    const propsFs = getProps(fixtureState);
    const [{ elementId }] = propsFs;
    setFixtureState({
      rendererId,
      fixtureId,
      fixtureState: {
        props: updatePropsFixtureStateItem({
          propsFs,
          elementId,
          values: createValues({ name: 'B' }),
        }),
      },
    });
    await waitFor(() => expect(containerText()).toBe('Hello B'));
    update({
      rendererId,
      fixtures: wrapDefaultExport({
        first: <HelloMessage name="Benjamin" />,
      }),
    });
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: [
          anyProps({
            componentName: 'HelloMessage',
            values: createValues({ name: 'Benjamin' }),
          }),
        ],
      },
    });
    await waitFor(() => expect(containerText()).toBe('Hello Benjamin'));
  }
);

testRenderer(
  'clears fixture state for removed fixture element',
  { rendererId, fixtures },
  async ({ containerText, update, selectFixture, fixtureStateChange }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: [
          anyProps({
            componentName: 'HelloMessage',
            values: createValues({ name: 'Blanca' }),
          }),
        ],
      },
    });
    update({
      rendererId,
      fixtures: wrapDefaultExport({
        // HelloMessage element from fixture is gone, and so should the
        // fixture state related to it.
        first: 'Hello all',
      }),
    });
    await waitFor(() => expect(containerText()).toBe('Hello all'));
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: [],
      },
    });
  }
);
