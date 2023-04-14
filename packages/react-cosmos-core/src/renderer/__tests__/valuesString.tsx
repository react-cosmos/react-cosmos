import retry from '@skidding/async-retry';
import React from 'react';
import {
  act,
  ReactTestRenderer,
  ReactTestRendererJSON,
} from 'react-test-renderer';
import { useValue } from '../../fixture/useValue/index.js';
import { createValue } from '../../fixtureState/createValues.js';
import { uuid } from '../../utils/uuid.js';
import { testFixtureLoader } from '../testHelpers/testFixtureLoader.js';
import { wrapFixtures } from '../testHelpers/wrapFixture.js';

function createFixtures({ defaultValue }: { defaultValue: string }) {
  const MyComponent = () => {
    const [value, setValue] = useValue('name', { defaultValue });
    return (
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    );
  };
  return wrapFixtures({
    first: <MyComponent />,
  });
}

const rendererId = uuid();
const fixtures = createFixtures({ defaultValue: 'Fu Barr' });
const fixtureId = { path: 'first' };

testFixtureLoader(
  'renders fixture',
  { rendererId, fixtures },
  async ({ renderer, selectFixture }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await rendered(renderer, 'Fu Barr');
  }
);

testFixtureLoader(
  'creates fixture state',
  { rendererId, fixtures },
  async ({ selectFixture, fixtureStateChange }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: expect.any(Array),
        controls: {
          name: {
            type: 'standard',
            defaultValue: createValue('Fu Barr'),
            currentValue: createValue('Fu Barr'),
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
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await rendered(renderer, 'Fu Barr');
    changeInput(renderer, 'Fu Barr Bhaz');
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: expect.any(Array),
        controls: {
          name: {
            type: 'standard',
            defaultValue: createValue('Fu Barr'),
            currentValue: createValue('Fu Barr Bhaz'),
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
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await rendered(renderer, 'Fu Barr');
    update({
      rendererId,
      fixtures: createFixtures({ defaultValue: 'Fu Barr Bhaz' }),
    });
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: expect.any(Array),
        controls: {
          name: {
            type: 'standard',
            defaultValue: createValue('Fu Barr Bhaz'),
            currentValue: createValue('Fu Barr Bhaz'),
          },
        },
      },
    });
  }
);

function getInputValue(renderer: ReactTestRenderer) {
  return getSingleRendererElement(renderer).props.value;
}

async function rendered(renderer: ReactTestRenderer, text: string) {
  await retry(() => expect(getInputValue(renderer)).toEqual(text));
}

function changeInput(renderer: ReactTestRenderer, value: string) {
  act(() => {
    getSingleRendererElement(renderer).props.onChange({ target: { value } });
  });
}

function getSingleRendererElement(renderer: ReactTestRenderer) {
  return renderer.toJSON() as ReactTestRendererJSON;
}
