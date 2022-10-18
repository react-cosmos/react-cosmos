import retry from '@skidding/async-retry';
import until from 'async-until';
import React from 'react';
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

let counterRef: null | SuffixCounter = null;
beforeEach(() => {
  counterRef = null;
});

const rendererId = uuid();
const getFixtures = () =>
  wrapFixtures({
    first: (
      <SuffixCounter
        ref={elRef => {
          if (elRef) {
            counterRef = elRef;
          }
        }}
        suffix="times"
      />
    ),
  });
const fixtureId = { path: 'first' };

testFixtureLoader(
  'keeps props when state changes',
  { rendererId, fixtures: getFixtures() },
  async ({
    renderer,
    selectFixture,
    setFixtureState,
    fixtureStateChange,
    getLastFixtureState,
  }) => {
    await selectFixture({ rendererId, fixtureId, fixtureState: {} });
    const fixtureState = await getLastFixtureState();
    const [{ elementId }] = getProps(fixtureState);
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
    await retry(() => expect(renderer.toJSON()).toBe('0 timez'));

    await until(() => counterRef, { timeout: 1000 });
    counterRef!.setState({ count: 7 });

    await retry(() => expect(renderer.toJSON()).toBe('7 timez'));
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
            values: createValues({ count: 7 }),
          }),
        ],
      },
    });
  }
);
