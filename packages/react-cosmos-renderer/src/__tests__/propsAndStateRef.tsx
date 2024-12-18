import { act, waitFor } from '@testing-library/react';
import until from 'async-until';
import React from 'react';
import {
  createValues,
  updatePropsFixtureStateItem,
  uuid,
} from 'react-cosmos-core';
import { SuffixCounter } from '../testHelpers/components.js';
import {
  anyClassState,
  anyProps,
  getProps,
} from '../testHelpers/fixtureState.js';
import { testRenderer } from '../testHelpers/testRenderer.js';
import { wrapDefaultExport } from '../testHelpers/wrapDefaultExport.js';

let counterRef: null | SuffixCounter = null;
beforeEach(() => {
  counterRef = null;
});

const rendererId = uuid();
const getFixtures = () =>
  wrapDefaultExport({
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

testRenderer(
  'keeps props when state changes',
  { rendererId, fixtures: getFixtures() },
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
        ...fixtureState,
        props: updatePropsFixtureStateItem({
          propsFs,
          elementId,
          values: createValues({ suffix: 'timez' }),
        }),
      },
    });
    await waitFor(() => expect(containerText()).toBe('0 timez'));

    await until(() => counterRef, { timeout: 1000 });
    await act(async () => {
      counterRef!.setState({ count: 7 });
    });

    await waitFor(() => expect(containerText()).toBe('7 timez'));
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
