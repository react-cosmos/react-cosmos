import retry from '@skidding/async-retry';
import React, { act } from 'react';
import { createValue, uuid } from 'react-cosmos-core';
import { ReactTestRenderer, ReactTestRendererJSON } from 'react-test-renderer';
import { useFixtureInput } from '../fixture/useFixtureInput/useFixtureInput.js';
import { testRenderer } from '../testHelpers/testRenderer.js';
import { wrapDefaultExport } from '../testHelpers/wrapDefaultExport.js';

function createFixtures({ defaultValue }: { defaultValue: boolean }) {
  const MyComponent = () => {
    const [toggled, setToggled] = useFixtureInput('toggled', defaultValue);
    return (
      <button onClick={() => setToggled(!toggled)}>{String(toggled)}</button>
    );
  };
  return wrapDefaultExport({
    first: <MyComponent />,
  });
}

const rendererId = uuid();
const fixtures = createFixtures({ defaultValue: false });
const fixtureId = { path: 'first' };

testRenderer(
  'renders fixture',
  { rendererId, fixtures },
  async ({ renderer, selectFixture }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await rendered(renderer, 'false');
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

testRenderer(
  'updates fixture state via setter',
  { rendererId, fixtures },
  async ({ renderer, selectFixture, fixtureStateChange }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await rendered(renderer, 'false');
    toggleButton(renderer);
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: expect.any(Array),
        inputs: {
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
  'resets fixture state on default value change',
  { rendererId, fixtures },
  async ({ renderer, update, selectFixture, fixtureStateChange }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await rendered(renderer, 'false');
    update({
      rendererId,
      fixtures: createFixtures({ defaultValue: true }),
    });
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: expect.any(Array),
        inputs: {
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

function getButtonText(renderer: ReactTestRenderer) {
  return getSingleRendererElement(renderer).children!.join('');
}

async function rendered(renderer: ReactTestRenderer, text: string) {
  await retry(() => expect(getButtonText(renderer)).toEqual(text));
}

function toggleButton(renderer: ReactTestRenderer) {
  act(() => {
    getSingleRendererElement(renderer).props.onClick();
  });
}

function getSingleRendererElement(renderer: ReactTestRenderer) {
  return renderer.toJSON() as ReactTestRendererJSON;
}
