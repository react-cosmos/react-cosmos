import { fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { createValue, uuid } from 'react-cosmos-core';
import { useFixtureInput } from '../fixture/useFixtureInput/useFixtureInput.js';
import { getInputs } from '../testHelpers/fixtureState.js';
import { testRenderer } from '../testHelpers/testRenderer.js';
import { wrapDefaultExport } from '../testHelpers/wrapDefaultExport.js';

type CreateFixtureArgs = {
  countName?: string;
  toggledName?: string;
  defaultCount?: number;
  defaultToggled?: boolean;
};

function createFixtures({
  countName = 'count',
  toggledName = 'toggled',
  defaultCount = 0,
  defaultToggled = false,
}: CreateFixtureArgs = {}) {
  const MyComponent = () => {
    const [count, setCount] = useFixtureInput(countName, defaultCount);
    const [toggled, setToggled] = useFixtureInput(toggledName, defaultToggled);
    return (
      <>
        <button onClick={() => setCount(prevCount => prevCount + 1)}>
          {count}
        </button>
        <button onClick={() => setToggled(!toggled)}>{String(toggled)}</button>
      </>
    );
  };
  return wrapDefaultExport({
    first: <MyComponent />,
  });
}

const rendererId = uuid();
const fixtures = createFixtures();
const fixtureId = { path: 'first' };

testRenderer(
  'preserves fixture state change (via setter) on default value change',
  { rendererId, fixtures },
  async ({ renderer, update, selectFixture, fixtureStateChange }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await waitFor(() => {
      expect(renderer.getAllByRole('button')[0]).toHaveTextContent('0');
      expect(renderer.getAllByRole('button')[1]).toHaveTextContent('false');
    });
    fireEvent.click(renderer.getAllByRole('button')[0]);
    fireEvent.click(renderer.getAllByRole('button')[1]);
    await waitFor(() => {
      expect(renderer.getAllByRole('button')[0]).toHaveTextContent('1');
      expect(renderer.getAllByRole('button')[1]).toHaveTextContent('true');
    });
    update({
      rendererId,
      fixtures: createFixtures({ defaultCount: 2, defaultToggled: false }),
    });
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: expect.any(Array),
        inputs: {
          // `count` was reset, `toggled` was preserved
          count: {
            type: 'standard',
            defaultValue: createValue(2),
            currentValue: createValue(2),
          },
          toggled: {
            type: 'standard',
            defaultValue: createValue(false),
            currentValue: createValue(true),
          },
        },
      },
    });
  }
);

testRenderer(
  'preserves fixture state change (via setFixtureState) on default value change',
  { rendererId, fixtures },
  async ({
    renderer,
    update,
    selectFixture,
    setFixtureState,
    getLastFixtureState,
    fixtureStateChange,
  }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await waitFor(() => {
      expect(renderer.getAllByRole('button')[0]).toHaveTextContent('0');
      expect(renderer.getAllByRole('button')[1]).toHaveTextContent('false');
    });
    const fixtureState = await getLastFixtureState();
    setFixtureState({
      rendererId,
      fixtureId,
      fixtureState: {
        ...setFixtureState,
        inputs: {
          ...getInputs(fixtureState),
          count: {
            type: 'standard',
            defaultValue: createValue(0),
            currentValue: createValue(1),
          },
        },
      },
    });
    await waitFor(() => {
      expect(renderer.getAllByRole('button')[0]).toHaveTextContent('1');
      expect(renderer.getAllByRole('button')[1]).toHaveTextContent('false');
    });
    update({
      rendererId,
      fixtures: createFixtures({ defaultCount: 0, defaultToggled: true }),
    });
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: expect.any(Array),
        inputs: {
          // `count` was preserved, `toggled` was reset
          count: {
            type: 'standard',
            defaultValue: createValue(0),
            currentValue: createValue(1),
          },
          toggled: {
            type: 'standard',
            defaultValue: createValue(true),
            currentValue: createValue(true),
          },
        },
      },
    });
  }
);

testRenderer(
  'cleans up fixture state on input rename',
  { rendererId, fixtures },
  async ({ renderer, update, selectFixture, fixtureStateChange }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await waitFor(() => {
      expect(renderer.getAllByRole('button')[0]).toHaveTextContent('0');
      expect(renderer.getAllByRole('button')[1]).toHaveTextContent('false');
    });
    fireEvent.click(renderer.getAllByRole('button')[0]);
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: expect.any(Array),
        inputs: {
          count: {
            type: 'standard',
            defaultValue: createValue(0),
            currentValue: createValue(1),
          },
          toggled: {
            type: 'standard',
            defaultValue: createValue(false),
            currentValue: createValue(false),
          },
        },
      },
    });
    update({
      rendererId,
      fixtures: createFixtures({
        toggledName: 'confirmed',
        defaultToggled: true,
      }),
    });
    await waitFor(() => {
      expect(renderer.getAllByRole('button')[0]).toHaveTextContent('1');
      expect(renderer.getAllByRole('button')[1]).toHaveTextContent('true');
    });
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: expect.any(Array),
        inputs: {
          count: {
            type: 'standard',
            defaultValue: createValue(0),
            currentValue: createValue(1),
          },
          confirmed: {
            type: 'standard',
            defaultValue: createValue(true),
            currentValue: createValue(true),
          },
          // KNOWN LIMITATION: `toggled` is still present in the fixture
          // state until the user resets the fixture state.
          toggled: {
            type: 'standard',
            defaultValue: createValue(false),
            currentValue: createValue(false),
          },
        },
      },
    });
  }
);
