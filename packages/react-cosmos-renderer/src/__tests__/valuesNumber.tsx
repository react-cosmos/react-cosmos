import { fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { createValue, uuid } from 'react-cosmos-core';
import { useFixtureInput } from '../fixture/useFixtureInput/useFixtureInput.js';
import { testRenderer } from '../testHelpers/testRenderer.js';
import { wrapDefaultExport } from '../testHelpers/wrapDefaultExport.js';

function createFixtures({ defaultValue }: { defaultValue: number }) {
  const MyComponent = () => {
    const [count, setCount] = useFixtureInput('count', defaultValue);
    return (
      <button onClick={() => setCount(prevCount => prevCount + 1)}>
        {count} clicks
      </button>
    );
  };
  return wrapDefaultExport({
    first: <MyComponent />,
  });
}

const rendererId = uuid();
const fixtures = createFixtures({ defaultValue: 0 });
const fixtureId = { path: 'first' };

testRenderer(
  'renders fixture',
  { rendererId, fixtures },
  async ({ rootText, selectFixture }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await waitFor(() => expect(rootText()).toBe('0 clicks'));
  }
);

testRenderer(
  'creates fixture state',
  { rendererId, fixtures },
  async ({ selectFixture, fixtureStateChange }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: expect.any(Array),
        inputs: {
          count: {
            type: 'standard',
            defaultValue: createValue(0),
            currentValue: createValue(0),
          },
        },
      },
    });
  }
);

testRenderer(
  'updates fixture state via setter',
  { rendererId, fixtures },
  async ({ renderer, rootText, selectFixture, fixtureStateChange }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await waitFor(() => expect(rootText()).toBe('0 clicks'));
    fireEvent.click(renderer.getByRole('button'));
    fireEvent.click(renderer.getByRole('button'));
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: expect.any(Array),
        inputs: {
          count: {
            type: 'standard',
            defaultValue: createValue(0),
            currentValue: createValue(2),
          },
        },
      },
    });
  }
);

testRenderer(
  'resets fixture state on default value change',
  { rendererId, fixtures },
  async ({ rootText, update, selectFixture, fixtureStateChange }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await waitFor(() => expect(rootText()).toBe('0 clicks'));
    update({
      rendererId,
      fixtures: createFixtures({ defaultValue: 5 }),
    });
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: expect.any(Array),
        inputs: {
          count: {
            type: 'standard',
            defaultValue: createValue(5),
            currentValue: createValue(5),
          },
        },
      },
    });
  }
);
