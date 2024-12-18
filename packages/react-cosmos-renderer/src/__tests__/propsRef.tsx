import { waitFor } from '@testing-library/react';
import { uniq } from 'lodash-es';
import React from 'react';
import {
  createValues,
  resetPropsFixtureStateItem,
  updatePropsFixtureStateItem,
  uuid,
} from 'react-cosmos-core';
import { HelloMessageCls } from '../testHelpers/components.js';
import { getProps } from '../testHelpers/fixtureState.js';
import { testRenderer } from '../testHelpers/testRenderer.js';
import { wrapDefaultExport } from '../testHelpers/wrapDefaultExport.js';

const rendererId = uuid();
const fixtureId = { path: 'first' };

let refs: React.Component[] = [];
beforeEach(() => {
  refs = [];
});

// Intentionally create new ref function on every update to get the ref
// to be called more than once even if the component instance is reused
const getFixtures = () =>
  wrapDefaultExport({
    first: (
      <HelloMessageCls
        ref={elRef => {
          if (elRef) {
            refs.push(elRef);
          }
        }}
        name="Blanca"
      />
    ),
  });

testRenderer(
  'transitions props (reuses component instance)',
  { rendererId, fixtures: getFixtures() },
  async ({
    rootText,
    update,
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
    await waitFor(() => expect(rootText()).toEqual('Hello B'));
    update({ rendererId, fixtures: getFixtures() });
    await waitFor(() => {
      expect(rootText()).toEqual('Hello Blanca');
      expect(uniq(refs).length).toBe(1);
    });
  }
);

testRenderer(
  'resets props (creates new component instance)',
  { rendererId, fixtures: getFixtures() },
  async ({
    rootText,
    update,
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
        props: resetPropsFixtureStateItem({
          propsFs,
          elementId,
          values: createValues({ name: 'B' }),
        }),
      },
    });
    await waitFor(() => expect(rootText()).toEqual('Hello B'));
    update({ rendererId, fixtures: getFixtures() });
    await waitFor(() => {
      expect(rootText()).toEqual('Hello Blanca');
      expect(uniq(refs).length).toBe(2);
    });
  }
);
