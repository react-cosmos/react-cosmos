import retry from '@skidding/async-retry';
import React from 'react';
import { ReactTestRenderer, ReactTestRendererJSON } from 'react-test-renderer';
import { createValue } from '../../../core/fixtureState/createValues.js';
import { uuid } from '../../../utils/uuid.js';
import { useValue } from '../../useValue/index.js';
import { testFixtureLoader } from '../testHelpers/index.js';
import { wrapFixtures } from '../testHelpers/wrapFixture.js';

function createFixtures({ defaultValue }: { defaultValue: boolean }) {
  const MyComponent = () => {
    const [toggled, setToggled] = useValue('toggled', { defaultValue });
    return (
      <button onClick={() => setToggled(!toggled)}>{String(toggled)}</button>
    );
  };
  return wrapFixtures({
    first: <MyComponent />,
  });
}

const rendererId = uuid();
const fixtures = createFixtures({ defaultValue: false });
const fixtureId = { path: 'first' };

testFixtureLoader(
  'renders fixture',
  { rendererId, fixtures },
  async ({ renderer, selectFixture }) => {
    await selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await rendered(renderer, 'false');
  }
);

testFixtureLoader(
  'creates fixture state',
  { rendererId, fixtures },
  async ({ selectFixture, fixtureStateChange }) => {
    await selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: expect.any(Array),
        controls: {
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

testFixtureLoader(
  'updates fixture state via setter',
  { rendererId, fixtures },
  async ({ renderer, selectFixture, fixtureStateChange }) => {
    await selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await rendered(renderer, 'false');
    toggleButton(renderer);
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: expect.any(Array),
        controls: {
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

testFixtureLoader(
  'resets fixture state on default value change',
  { rendererId, fixtures },
  async ({ renderer, update, selectFixture, fixtureStateChange }) => {
    await selectFixture({ rendererId, fixtureId, fixtureState: {} });
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
        controls: {
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
  getSingleRendererElement(renderer).props.onClick();
}

function getSingleRendererElement(renderer: ReactTestRenderer) {
  return renderer.toJSON() as ReactTestRendererJSON;
}
