import { waitFor } from '@testing-library/react';
import React from 'react';
import {
  createValues,
  updatePropsFixtureStateItem,
  uuid,
} from 'react-cosmos-core';
import { getProps } from '../testHelpers/fixtureState.js';
import { testRenderer } from '../testHelpers/testRenderer.js';
import { wrapDefaultExport } from '../testHelpers/wrapDefaultExport.js';

const rendererId = uuid();
const fixtures = createFixtures();
const fixtureId = { path: 'first' };

function createFixtures() {
  function HelloMessage({ name }: { name: string }) {
    return `Hello ${name}`;
  }
  return wrapDefaultExport({
    first: <HelloMessage name="Theo" />,
  });
}

testRenderer(
  'persists props after type changes reference but keeps name (hmr simulation)',
  { rendererId, fixtures },
  async ({
    rootText,
    update,
    selectFixture,
    getLastFixtureState,
    setFixtureState,
  }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await waitFor(() => expect(rootText()).toBe('Hello Theo'));
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
          values: createValues({ name: 'Theo Von' }),
        }),
      },
    });
    await waitFor(() => expect(rootText()).toBe('Hello Theo Von'));
    update({ rendererId, fixtures: createFixtures() });
    await waitFor(() => expect(rootText()).toBe('Hello Theo Von'));
  }
);
