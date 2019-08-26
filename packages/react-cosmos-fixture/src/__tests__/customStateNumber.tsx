import retry from '@skidding/async-retry';
import React from 'react';
import { uuid } from 'react-cosmos-shared2/util';
import { ReactTestRenderer } from 'react-test-renderer';
// Warning: Import test helpers before tested source to mock Socket.IO
import { runFixtureLoaderTests } from '../testHelpers';
import { resetPersistentValues } from '../useState/shared/persistentValueStore';
import { useState } from '..';

function createFixtures({ defaultValue }: { defaultValue: number }) {
  const MyComponent = () => {
    const [count, setCount] = useState('count', { defaultValue });
    return (
      <button onClick={() => setCount(prevCount => prevCount + 1)}>
        {count} clicks
      </button>
    );
  };
  return {
    first: <MyComponent />
  };
}

const rendererId = uuid();
const fixtures = createFixtures({ defaultValue: 0 });
const decorators = {};
const fixtureId = { path: 'first', name: null };

afterEach(resetPersistentValues);

runFixtureLoaderTests(mount => {
  it('renders fixture', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ renderer, selectFixture }) => {
        await selectFixture({ rendererId, fixtureId, fixtureState: {} });
        await rendered(renderer, '0 clicks');
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
              count: {
                defaultValue: { type: 'primitive', value: 0 },
                currentValue: { type: 'primitive', value: 0 }
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
        await rendered(renderer, '0 clicks');
        clickButton(renderer);
        clickButton(renderer);
        await fixtureStateChange({
          rendererId,
          fixtureId,
          fixtureState: {
            props: expect.any(Array),
            customState: {
              count: {
                defaultValue: { type: 'primitive', value: 0 },
                currentValue: { type: 'primitive', value: 2 }
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
        await rendered(renderer, '0 clicks');
        update({
          rendererId,
          fixtures: createFixtures({ defaultValue: 5 }),
          decorators
        });
        await fixtureStateChange({
          rendererId,
          fixtureId,
          fixtureState: {
            props: expect.any(Array),
            customState: {
              count: {
                defaultValue: { type: 'primitive', value: 5 },
                currentValue: { type: 'primitive', value: 5 }
              }
            }
          }
        });
      }
    );
  });
});

function getButtonText(renderer: ReactTestRenderer) {
  return renderer.toJSON()!.children!.join('');
}

async function rendered(renderer: ReactTestRenderer, text: string) {
  await retry(() => expect(getButtonText(renderer)).toEqual(text));
}

function clickButton(renderer: ReactTestRenderer) {
  renderer.toJSON()!.props.onClick();
}
