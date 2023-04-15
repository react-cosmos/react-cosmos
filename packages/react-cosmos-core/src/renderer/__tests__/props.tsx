import retry from '@skidding/async-retry';
import React from 'react';
import { createValues } from '../../fixtureState/createValues.js';
import {
  removeFixtureStateProps,
  updateFixtureStateProps,
} from '../../fixtureState/props.js';
import { uuid } from '../../utils/uuid.js';
import { HelloMessage } from '../testHelpers/components.js';
import { anyProps, getProps } from '../testHelpers/fixtureState.js';
import { testRenderer } from '../testHelpers/testRenderer.js';

const rendererId = uuid();
const fixtures = {
  first: <HelloMessage name="Blanca" />,
};
const fixtureId = { path: 'first' };

testRenderer(
  'captures props',
  { rendererId, fixtures },
  async ({ renderer, selectFixture, fixtureStateChange }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await retry(() => expect(renderer.toJSON()).toBe('Hello Blanca'));
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
  async ({ renderer, selectFixture, setFixtureState, getLastFixtureState }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    const fixtureState = await getLastFixtureState();
    const [{ elementId }] = getProps(fixtureState);
    setFixtureState({
      rendererId,
      fixtureId,
      fixtureState: {
        props: updateFixtureStateProps({
          fixtureState,
          elementId,
          values: createValues({ name: 'B' }),
        }),
      },
    });
    await retry(() => expect(renderer.toJSON()).toBe('Hello B'));
  }
);

testRenderer(
  'removes prop',
  { rendererId, fixtures },
  async ({ renderer, selectFixture, setFixtureState, getLastFixtureState }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    const fixtureState = await getLastFixtureState();
    const [{ elementId }] = getProps(fixtureState);
    setFixtureState({
      rendererId,
      fixtureId,
      fixtureState: {
        props: updateFixtureStateProps({
          fixtureState,
          elementId,
          values: {},
        }),
      },
    });
    await retry(() => expect(renderer.toJSON()).toBe('Hello Stranger'));
  }
);

testRenderer(
  'clears props',
  { rendererId, fixtures },
  async ({
    renderer,
    selectFixture,
    setFixtureState,
    fixtureStateChange,
    getLastFixtureState,
  }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    const fixtureState = await getLastFixtureState();
    const [{ elementId }] = getProps(fixtureState);
    setFixtureState({
      rendererId,
      fixtureId,
      fixtureState: {
        props: updateFixtureStateProps({
          fixtureState,
          elementId,
          values: createValues({ name: 'B' }),
        }),
      },
    });
    await retry(() => expect(renderer.toJSON()).toBe('Hello B'));
    setFixtureState({
      rendererId,
      fixtureId,
      fixtureState: {
        props: removeFixtureStateProps(fixtureState, elementId),
      },
    });
    await retry(() => expect(renderer.toJSON()).toBe('Hello Blanca'));
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
    renderer,
    update,
    selectFixture,
    setFixtureState,
    fixtureStateChange,
    getLastFixtureState,
  }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    const fixtureState = await getLastFixtureState();
    const [{ elementId }] = getProps(fixtureState);
    setFixtureState({
      rendererId,
      fixtureId,
      fixtureState: {
        props: updateFixtureStateProps({
          fixtureState,
          elementId,
          values: createValues({ name: 'B' }),
        }),
      },
    });
    await retry(() => expect(renderer.toJSON()).toBe('Hello B'));
    update({
      rendererId,
      fixtures: {
        first: <HelloMessage name="Benjamin" />,
      },
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
    await retry(() => expect(renderer.toJSON()).toBe('Hello Benjamin'));
  }
);

testRenderer(
  'clears fixture state for removed fixture element',
  { rendererId, fixtures },
  async ({ renderer, update, selectFixture, fixtureStateChange }) => {
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
      fixtures: {
        // HelloMessage element from fixture is gone, and so should the
        // fixture state related to it.
        first: 'Hello all',
      },
    });
    expect(renderer.toJSON()).toBe('Hello all');
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: [],
      },
    });
  }
);
