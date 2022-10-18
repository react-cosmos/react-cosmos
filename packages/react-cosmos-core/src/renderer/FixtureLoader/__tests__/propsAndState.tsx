import retry from '@skidding/async-retry';
import React from 'react';
import { updateFixtureStateClassState } from '../../../fixtureState/classState.js';
import { createValues } from '../../../fixtureState/createValues.js';
import { updateFixtureStateProps } from '../../../fixtureState/props.js';
import { uuid } from '../../../utils/uuid.js';
import { SuffixCounter } from '../testHelpers/components.js';
import {
  anyClassState,
  anyProps,
  getProps,
} from '../testHelpers/fixtureState.js';
import { testFixtureLoader } from '../testHelpers/index.js';
import { wrapFixtures } from '../testHelpers/wrapFixture.js';

const rendererId = uuid();
const fixtures = wrapFixtures({
  first: (
    // The extra levels of nesting capture a complex case regarding deep
    // comparison of children nodes
    <>
      <>
        <SuffixCounter suffix="times" />
      </>
    </>
  ),
});
const fixtureId = { path: 'first' };

testFixtureLoader(
  'keeps state when resetting props',
  { rendererId, fixtures },
  async ({ renderer, selectFixture, setFixtureState, getLastFixtureState }) => {
    await selectFixture({ rendererId, fixtureId, fixtureState: {} });
    let fixtureState = await getLastFixtureState();
    const [{ elementId }] = getProps(fixtureState);
    fixtureState = {
      ...fixtureState,
      classState: updateFixtureStateClassState({
        fixtureState,
        elementId,
        values: createValues({ count: 5 }),
      }),
    };
    await setFixtureState({ rendererId, fixtureId, fixtureState });
    await retry(() => expect(renderer.toJSON()).toBe('5 times'));
    await setFixtureState({
      rendererId,
      fixtureId,
      fixtureState: {
        ...fixtureState,
        props: updateFixtureStateProps({
          fixtureState,
          elementId,
          values: createValues({ suffix: 'timez' }),
        }),
      },
    });
    await retry(() => expect(renderer.toJSON()).toBe('5 timez'));
  }
);

testFixtureLoader(
  'keeps state when transitioning props',
  { rendererId, fixtures },
  async ({ renderer, selectFixture, setFixtureState, getLastFixtureState }) => {
    await selectFixture({ rendererId, fixtureId, fixtureState: {} });
    let fixtureState = await getLastFixtureState();
    const [{ elementId }] = getProps(fixtureState);
    fixtureState = {
      ...fixtureState,
      classState: updateFixtureStateClassState({
        fixtureState,
        elementId,
        values: createValues({ count: 5 }),
      }),
    };
    await setFixtureState({ rendererId, fixtureId, fixtureState });
    await retry(() => expect(renderer.toJSON()).toBe('5 times'));
    await setFixtureState({
      rendererId,
      fixtureId,
      fixtureState: {
        ...fixtureState,
        props: updateFixtureStateProps({
          fixtureState,
          elementId,
          values: createValues({ suffix: 'timez' }),
        }),
      },
    });
    await retry(() => expect(renderer.toJSON()).toBe('5 timez'));
  }
);

testFixtureLoader(
  'keeps props when changing state',
  { rendererId, fixtures },
  async ({ renderer, selectFixture, setFixtureState, getLastFixtureState }) => {
    await selectFixture({ rendererId, fixtureId, fixtureState: {} });
    let fixtureState = await getLastFixtureState();
    const [{ elementId }] = getProps(fixtureState);
    fixtureState = {
      ...fixtureState,
      props: updateFixtureStateProps({
        fixtureState,
        elementId,
        values: createValues({ suffix: 'timez' }),
      }),
    };
    await setFixtureState({ rendererId, fixtureId, fixtureState });
    await retry(() => expect(renderer.toJSON()).toBe('0 timez'));
    await setFixtureState({
      rendererId,
      fixtureId,
      fixtureState: {
        ...fixtureState,
        classState: updateFixtureStateClassState({
          fixtureState,
          elementId,
          values: createValues({ count: 5 }),
        }),
      },
    });
    await retry(() => expect(renderer.toJSON()).toBe('5 timez'));
  }
);

testFixtureLoader(
  'updates props on fixture change',
  { rendererId, fixtures },
  async ({ renderer, update, selectFixture, fixtureStateChange }) => {
    await selectFixture({ rendererId, fixtureId, fixtureState: {} });
    update({
      rendererId,
      fixtures: wrapFixtures({
        first: <SuffixCounter suffix="timez" />,
      }),
    });
    await retry(() => expect(renderer.toJSON()).toBe('0 timez'));
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: [
          anyProps({
            values: createValues({ suffix: 'timez' }),
          }),
        ],
        classState: [
          anyClassState({
            values: createValues({ count: 0 }),
          }),
        ],
      },
    });
  }
);
