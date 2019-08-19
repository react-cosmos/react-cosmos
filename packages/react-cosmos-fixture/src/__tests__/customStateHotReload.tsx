import retry from '@skidding/async-retry';
import React from 'react';
import { uuid } from 'react-cosmos-shared2/util';
import { ReactTestRenderer, ReactTestRendererJSON } from 'react-test-renderer';
// Warning: Import test helpers before tested source to mock Socket.IO
import { runFixtureLoaderTests } from '../testHelpers';
import { resetPersistentValues } from '../stateHooks/shared/persistentValueStore';
import { useNumber, useBoolean } from '..';

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
  defaultToggled = false
}: CreateFixtureArgs = {}) {
  const MyComponent = () => {
    const [count, setCount] = useNumber(countName, {
      defaultValue: defaultCount
    });
    const [toggled, setToggled] = useBoolean(toggledName, {
      defaultValue: defaultToggled
    });
    return (
      <>
        <button onClick={() => setCount(prevCount => prevCount + 1)}>
          {count}
        </button>
        <button onClick={() => setToggled(!toggled)}>{String(toggled)}</button>
      </>
    );
  };
  return {
    first: <MyComponent />
  };
}

const rendererId = uuid();
const fixtures = createFixtures();
const decorators = {};
const fixtureId = { path: 'first', name: null };

afterEach(resetPersistentValues);

runFixtureLoaderTests(mount => {
  it('renders fixture', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ renderer, selectFixture }) => {
        await selectFixture({ rendererId, fixtureId, fixtureState: {} });
        await rendered(renderer, '0', 'false');
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
                type: 'primitive',
                defaultValue: 0,
                currentValue: 0
              },
              toggled: {
                type: 'primitive',
                defaultValue: false,
                currentValue: false
              }
            }
          }
        });
      }
    );
  });

  it('updates fixture state via setters', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ renderer, selectFixture, fixtureStateChange }) => {
        await selectFixture({ rendererId, fixtureId, fixtureState: {} });
        await rendered(renderer, '0', 'false');
        clickCountButton(renderer);
        clickCountButton(renderer);
        clickToggledButton(renderer);
        await fixtureStateChange({
          rendererId,
          fixtureId,
          fixtureState: {
            props: expect.any(Array),
            customState: {
              count: {
                type: 'primitive',
                defaultValue: 0,
                currentValue: 2
              },
              toggled: {
                type: 'primitive',
                defaultValue: false,
                currentValue: true
              }
            }
          }
        });
      }
    );
  });

  it('preserves (organic) fixture state on default value change in component', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ renderer, update, selectFixture, fixtureStateChange }) => {
        await selectFixture({ rendererId, fixtureId, fixtureState: {} });
        await rendered(renderer, '0', 'false');
        clickCountButton(renderer);
        await rendered(renderer, '1', 'false');
        update({
          rendererId,
          fixtures: createFixtures({ defaultCount: 0, defaultToggled: true }),
          decorators
        });
        await fixtureStateChange({
          rendererId,
          fixtureId,
          fixtureState: {
            props: expect.any(Array),
            customState: {
              // `count` default value has remained 0, and so the current value
              // was preserved at 1. On the other hand, the `toggled` default
              // value has changed to true, which also reset its current value.
              count: {
                type: 'primitive',
                defaultValue: 0,
                currentValue: 1
              },
              toggled: {
                type: 'primitive',
                defaultValue: true,
                currentValue: true
              }
            }
          }
        });
      }
    );
  });

  it('preserves (set) fixture state on default value change in component', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({
        renderer,
        update,
        selectFixture,
        setFixtureState,
        getLastFixtureState,
        fixtureStateChange
      }) => {
        await selectFixture({ rendererId, fixtureId, fixtureState: {} });
        await rendered(renderer, '0', 'false');
        const fixtureState = await getLastFixtureState();
        await setFixtureState({
          rendererId,
          fixtureId,
          fixtureState: {
            ...setFixtureState,
            customState: {
              ...fixtureState.customState,
              count: {
                type: 'primitive',
                defaultValue: 0,
                currentValue: 1
              }
            }
          }
        });
        await rendered(renderer, '1', 'false');
        update({
          rendererId,
          fixtures: createFixtures({ defaultCount: 0, defaultToggled: true }),
          decorators
        });
        await fixtureStateChange({
          rendererId,
          fixtureId,
          fixtureState: {
            props: expect.any(Array),
            customState: {
              // `count` default value has remained 0, and so the current value
              // was preserved at 1. On the other hand, the `toggled` default
              // value has changed to true, which also reset its current value.
              count: {
                type: 'primitive',
                defaultValue: 0,
                currentValue: 1
              },
              toggled: {
                type: 'primitive',
                defaultValue: true,
                currentValue: true
              }
            }
          }
        });
      }
    );
  });

  it('removes fixture state on component unmount', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ renderer, update, selectFixture, fixtureStateChange }) => {
        await selectFixture({ rendererId, fixtureId, fixtureState: {} });
        await rendered(renderer, '0', 'false');
        clickCountButton(renderer);
        update({
          rendererId,
          fixtures: createFixtures({
            toggledName: 'confirmed',
            defaultToggled: true
          }),
          decorators
        });
        await rendered(renderer, '1', 'true');
        await fixtureStateChange({
          rendererId,
          fixtureId,
          fixtureState: {
            props: expect.any(Array),
            customState: {
              count: {
                type: 'primitive',
                defaultValue: 0,
                currentValue: 1
              },
              confirmed: {
                type: 'primitive',
                defaultValue: true,
                currentValue: true
              }
            }
          }
        });
      }
    );
  });
});

async function rendered(
  renderer: ReactTestRenderer,
  countText: string,
  toggledText: string
) {
  await retry(() => Boolean(renderer.toJSON()));
  await retry(() =>
    expect(getButtonText(getCountButton(renderer))).toEqual(countText)
  );
  await retry(() =>
    expect(getButtonText(getToggledButton(renderer))).toEqual(toggledText)
  );
}

function clickCountButton(renderer: ReactTestRenderer) {
  toggleButton(getCountButton(renderer));
}

function clickToggledButton(renderer: ReactTestRenderer) {
  toggleButton(getToggledButton(renderer));
}

function getCountButton(renderer: ReactTestRenderer) {
  return (renderer.toJSON() as any)[0] as ReactTestRendererJSON;
}

function getToggledButton(renderer: ReactTestRenderer) {
  return (renderer.toJSON() as any)[1] as ReactTestRendererJSON;
}

function getButtonText(rendererNode: ReactTestRendererJSON) {
  return rendererNode.children!.join('');
}

function toggleButton(rendererNode: ReactTestRendererJSON) {
  rendererNode.props.onClick();
}
