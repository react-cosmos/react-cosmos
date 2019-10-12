import retry from '@skidding/async-retry';
import React from 'react';
import { ReactTestRenderer } from 'react-test-renderer';
import { createValue } from '../../fixtureState';
import { uuid } from '../../util';
import { testFixtureLoader } from '../testHelpers';
import { useValue } from '../useValue';

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
  return {
    first: <MyComponent />
  };
}

const rendererId = uuid();
const fixtures = createFixtures({ defaultValue: 'Fu Barr' });
const fixtureId = { path: 'first', name: null };

testFixtureLoader(
  'renders fixture',
  { rendererId, fixtures },
  async ({ renderer, selectFixture }) => {
    await selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await rendered(renderer, 'Fu Barr');
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
        values: {
          name: {
            defaultValue: createValue('Fu Barr'),
            currentValue: createValue('Fu Barr')
          }
        }
      }
    });
  }
);

testFixtureLoader(
  'updates fixture state via setter',
  { rendererId, fixtures },
  async ({ renderer, selectFixture, fixtureStateChange }) => {
    await selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await rendered(renderer, 'Fu Barr');
    changeInput(renderer, 'Fu Barr Bhaz');
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: expect.any(Array),
        values: {
          name: {
            defaultValue: createValue('Fu Barr'),
            currentValue: createValue('Fu Barr Bhaz')
          }
        }
      }
    });
  }
);

testFixtureLoader(
  'resets fixture state on default value change',
  { rendererId, fixtures },
  async ({ renderer, update, selectFixture, fixtureStateChange }) => {
    await selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await rendered(renderer, 'Fu Barr');
    update({
      rendererId,
      fixtures: createFixtures({ defaultValue: 'Fu Barr Bhaz' })
    });
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: expect.any(Array),
        values: {
          name: {
            defaultValue: createValue('Fu Barr Bhaz'),
            currentValue: createValue('Fu Barr Bhaz')
          }
        }
      }
    });
  }
);

function getButtonText(renderer: ReactTestRenderer) {
  return renderer.toJSON()!.props.value;
}

async function rendered(renderer: ReactTestRenderer, text: string) {
  await retry(() => expect(getButtonText(renderer)).toEqual(text));
}

function changeInput(renderer: ReactTestRenderer, value: string) {
  renderer.toJSON()!.props.onChange({ target: { value } });
}
