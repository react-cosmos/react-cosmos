import retry from '@skidding/async-retry';
import React from 'react';
import { uuid } from 'react-cosmos-shared2/util';
import { ReactTestRenderer } from 'react-test-renderer';
// Warning: Import test helpers before tested source to mock Socket.IO
import { runFixtureLoaderTests } from '../testHelpers';
import { resetPersistentValues } from '../useState/shared/persistentValueStore';
import { useState } from '..';

function createFixtures({ defaultValue }: { defaultValue: string }) {
  const MyComponent = () => {
    const [value, setValue] = useState('name', { defaultValue });
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
const decorators = {};
const fixtureId = { path: 'first', name: null };

afterEach(resetPersistentValues);

runFixtureLoaderTests(mount => {
  it('renders fixture', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ renderer, selectFixture }) => {
        await selectFixture({ rendererId, fixtureId, fixtureState: {} });
        await rendered(renderer, 'Fu Barr');
      }
    );
  });

  it('creates fixture state', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ selectFixture, fixtureStateChange }) => {
        await selectFixture({ rendererId, fixtureId, fixtureState: {} });
        await fixtureStateChange({
          rendererId,
          fixtureId,
          fixtureState: {
            props: expect.any(Array),
            customState: {
              name: {
                defaultValue: { type: 'primitive', value: 'Fu Barr' },
                currentValue: { type: 'primitive', value: 'Fu Barr' }
              }
            }
          }
        });
      }
    );
  });

  it('updates fixture state via setter', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ renderer, selectFixture, fixtureStateChange }) => {
        await selectFixture({ rendererId, fixtureId, fixtureState: {} });
        await rendered(renderer, 'Fu Barr');
        changeInput(renderer, 'Fu Barr Bhaz');
        await fixtureStateChange({
          rendererId,
          fixtureId,
          fixtureState: {
            props: expect.any(Array),
            customState: {
              name: {
                defaultValue: { type: 'primitive', value: 'Fu Barr' },
                currentValue: { type: 'primitive', value: 'Fu Barr Bhaz' }
              }
            }
          }
        });
      }
    );
  });

  it('resets fixture state on default value change', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ renderer, update, selectFixture, fixtureStateChange }) => {
        await selectFixture({ rendererId, fixtureId, fixtureState: {} });
        await rendered(renderer, 'Fu Barr');
        update({
          rendererId,
          fixtures: createFixtures({ defaultValue: 'Fu Barr Bhaz' }),
          decorators
        });
        await fixtureStateChange({
          rendererId,
          fixtureId,
          fixtureState: {
            props: expect.any(Array),
            customState: {
              name: {
                defaultValue: { type: 'primitive', value: 'Fu Barr Bhaz' },
                currentValue: { type: 'primitive', value: 'Fu Barr Bhaz' }
              }
            }
          }
        });
      }
    );
  });
});

function getButtonText(renderer: ReactTestRenderer) {
  return renderer.toJSON()!.props.value;
}

async function rendered(renderer: ReactTestRenderer, text: string) {
  await retry(() => Boolean(renderer.toJSON()));
  await retry(() => expect(getButtonText(renderer)).toEqual(text));
}

function changeInput(renderer: ReactTestRenderer, value: string) {
  renderer.toJSON()!.props.onChange({ target: { value } });
}
