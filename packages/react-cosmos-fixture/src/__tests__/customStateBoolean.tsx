import retry from '@skidding/async-retry';
import React from 'react';
import { uuid } from 'react-cosmos-shared2/util';
import { ReactTestRenderer } from 'react-test-renderer';
// Warning: Import test helpers before tested source to mock Socket.IO
import { runFixtureLoaderTests } from '../testHelpers';
import { resetPersistentValues } from '../useState/shared/persistentValueStore';
import { useState } from '..';

function createFixtures({ defaultValue }: { defaultValue: boolean }) {
  const MyComponent = () => {
    const [toggled, setToggled] = useState('toggled', { defaultValue });
    return (
      <button onClick={() => setToggled(!toggled)}>{String(toggled)}</button>
    );
  };
  return {
    first: <MyComponent />
  };
}

const rendererId = uuid();
const fixtures = createFixtures({ defaultValue: false });
const decorators = {};
const fixtureId = { path: 'first', name: null };

afterEach(resetPersistentValues);

runFixtureLoaderTests(mount => {
  it('renders fixture', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ renderer, selectFixture }) => {
        await selectFixture({ rendererId, fixtureId, fixtureState: {} });
        await rendered(renderer, 'false');
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
              toggled: {
                defaultValue: { type: 'primitive', value: false },
                currentValue: { type: 'primitive', value: false }
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
        await rendered(renderer, 'false');
        toggleButton(renderer);
        await fixtureStateChange({
          rendererId,
          fixtureId,
          fixtureState: {
            props: expect.any(Array),
            customState: {
              toggled: {
                defaultValue: { type: 'primitive', value: false },
                currentValue: { type: 'primitive', value: true }
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
        await rendered(renderer, 'false');
        update({
          rendererId,
          fixtures: createFixtures({ defaultValue: true }),
          decorators
        });
        await fixtureStateChange({
          rendererId,
          fixtureId,
          fixtureState: {
            props: expect.any(Array),
            customState: {
              toggled: {
                defaultValue: { type: 'primitive', value: true },
                currentValue: { type: 'primitive', value: true }
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
  await retry(() => Boolean(renderer.toJSON()));
  await retry(() => expect(getButtonText(renderer)).toEqual(text));
}

function toggleButton(renderer: ReactTestRenderer) {
  renderer.toJSON()!.props.onClick();
}
