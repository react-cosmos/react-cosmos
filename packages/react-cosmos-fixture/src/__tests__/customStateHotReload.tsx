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
  it('preserves fixture state change (via setter) on default value change', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ renderer, update, selectFixture, fixtureStateChange }) => {
        await selectFixture({ rendererId, fixtureId, fixtureState: {} });
        await rendered(renderer, { countText: '0', toggledText: 'false' });
        clickCountButton(renderer);
        clickToggledButton(renderer);
        await rendered(renderer, { countText: '1', toggledText: 'true' });
        update({
          rendererId,
          fixtures: createFixtures({ defaultCount: 2, defaultToggled: false }),
          decorators
        });
        await fixtureStateChange({
          rendererId,
          fixtureId,
          fixtureState: {
            props: expect.any(Array),
            customState: {
              // `count` was reset, `toggled` was preserved
              count: {
                type: 'primitive',
                defaultValue: 2,
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

  it('preserves fixture state change (via setFixtureState) on default value change', async () => {
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
        await rendered(renderer, { countText: '0', toggledText: 'false' });
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
        await rendered(renderer, { countText: '1', toggledText: 'false' });
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
              // `count` was preserved, `toggled` was reset
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

  it('cleans up fixture state on input rename', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ renderer, update, selectFixture, fixtureStateChange }) => {
        await selectFixture({ rendererId, fixtureId, fixtureState: {} });
        await rendered(renderer, { countText: '0', toggledText: 'false' });
        clickCountButton(renderer);
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
              toggled: {
                type: 'primitive',
                defaultValue: false,
                currentValue: false
              }
            }
          }
        });
        update({
          rendererId,
          fixtures: createFixtures({
            toggledName: 'confirmed',
            defaultToggled: true
          }),
          decorators
        });
        await rendered(renderer, { countText: '1', toggledText: 'true' });
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
              // `toggled` was replaced by `confirmed`
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
  { countText, toggledText }: { countText: string; toggledText: string }
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
