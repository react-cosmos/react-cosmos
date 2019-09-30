import retry from '@skidding/async-retry';
import React from 'react';
import {
  createValues,
  updateFixtureStateClassState,
  updateFixtureStateProps
} from 'react-cosmos-shared2/fixtureState';
import { uuid } from 'react-cosmos-shared2/util';
import { testFixtureLoader } from '../testHelpers';
import { SuffixCounter } from '../testHelpers/components';
import { anyClassState, anyProps, getProps } from '../testHelpers/fixtureState';

const rendererId = uuid();
const fixtures = {
  first: (
    // The extra levels of nesting capture a complex case regarding deep
    // comparison of children nodes
    <>
      <>
        <SuffixCounter suffix="times" />
      </>
    </>
  )
};
const fixtureId = { path: 'first', name: null };

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
        values: createValues({ count: 5 })
      })
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
          values: createValues({ suffix: 'timez' })
        })
      }
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
        values: createValues({ count: 5 })
      })
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
          values: createValues({ suffix: 'timez' })
        })
      }
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
        values: createValues({ suffix: 'timez' })
      })
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
          values: createValues({ count: 5 })
        })
      }
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
      fixtures: {
        first: <SuffixCounter suffix="timez" />
      }
    });
    await retry(() => expect(renderer.toJSON()).toBe('0 timez'));
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: [
          anyProps({
            values: createValues({ suffix: 'timez' })
          })
        ],
        classState: [
          anyClassState({
            values: createValues({ count: 0 })
          })
        ]
      }
    });
  }
);
