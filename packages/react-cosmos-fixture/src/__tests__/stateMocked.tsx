import * as React from 'react';
import delay from 'delay';
import until from 'async-until';
import retry from '@skidding/async-retry';
import { StateMock } from '@react-mock/state';
import {
  getCompFixtureStates,
  updateCompFixtureState
} from 'react-cosmos-shared2/fixtureState';
import { uuid } from 'react-cosmos-shared2/util';
import { Counter, CoolCounter } from '../testHelpers/components';
import { createCompFxState, createFxValues } from '../testHelpers/fixtureState';
import { runFixtureConnectTests } from '../testHelpers';

const rendererId = uuid();
const fixtures = {
  first: (
    <StateMock state={{ count: 5 }}>
      <Counter />
    </StateMock>
  )
};
const decorators = {};
const fixtureId = { path: 'first', name: null };

runFixtureConnectTests(mount => {
  it('captures mocked state', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ renderer, selectFixture, untilMessage }) => {
        await selectFixture({
          rendererId,
          fixtureId,
          fixtureState: null
        });
        await retry(() => expect(renderer.toJSON()).toBe('5 times'));
        await untilMessage({
          type: 'fixtureStateChange',
          payload: {
            rendererId,
            fixtureId,
            fixtureState: {
              components: [
                createCompFxState({
                  props: [],
                  state: createFxValues({ count: 5 })
                })
              ]
            }
          }
        });
      }
    );
  });

  it('overwrites mocked state', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({
        renderer,
        selectFixture,
        setFixtureState,
        getLastFixtureState
      }) => {
        await selectFixture({
          rendererId,
          fixtureId,
          fixtureState: null
        });
        const fixtureState = await getLastFixtureState();
        const [{ decoratorId, elPath }] = getCompFixtureStates(fixtureState);
        await setFixtureState({
          rendererId,
          fixtureId,
          fixtureState: {
            components: updateCompFixtureState({
              fixtureState,
              decoratorId,
              elPath,
              state: createFxValues({ count: 100 })
            })
          }
        });
        await retry(() => expect(renderer.toJSON()).toBe('100 times'));
        // A second update will provide code coverage for a different branch:
        // the transition between fixture state values
        await setFixtureState({
          rendererId,
          fixtureId,
          fixtureState: {
            components: updateCompFixtureState({
              fixtureState,
              decoratorId,
              elPath,
              state: createFxValues({ count: 200 })
            })
          }
        });
        await retry(() => expect(renderer.toJSON()).toBe('200 times'));
      }
    );
  });

  it('removes mocked state property', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({
        renderer,
        selectFixture,
        setFixtureState,
        getLastFixtureState
      }) => {
        await selectFixture({
          rendererId,
          fixtureId,
          fixtureState: null
        });
        const fixtureState = await getLastFixtureState();
        const [{ decoratorId, elPath }] = getCompFixtureStates(fixtureState);
        await setFixtureState({
          rendererId,
          fixtureId,
          fixtureState: {
            components: updateCompFixtureState({
              fixtureState,
              decoratorId,
              elPath,
              state: []
            })
          }
        });
        await retry(() => expect(renderer.toJSON()).toBe('Missing count'));
      }
    );
  });

  it('reverts to mocked state', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({
        renderer,
        selectFixture,
        setFixtureState,
        untilMessage,
        getLastFixtureState
      }) => {
        await selectFixture({
          rendererId,
          fixtureId,
          fixtureState: null
        });
        const fixtureState = await getLastFixtureState();
        const [{ decoratorId, elPath }] = getCompFixtureStates(fixtureState);
        await setFixtureState({
          rendererId,
          fixtureId,
          fixtureState: {
            components: updateCompFixtureState({
              fixtureState,
              decoratorId,
              elPath,
              state: createFxValues({ count: 10 })
            })
          }
        });
        await retry(() => expect(renderer.toJSON()).toBe('10 times'));
        await setFixtureState({
          rendererId,
          fixtureId,
          fixtureState: {
            components: updateCompFixtureState({
              fixtureState,
              decoratorId,
              elPath,
              state: null
            })
          }
        });
        await retry(() => expect(renderer.toJSON()).toBe('5 times'));
        // After the state is removed from the fixture state, the original
        // state is added back through a fixtureStateChange message
        await untilMessage({
          type: 'fixtureStateChange',
          payload: {
            rendererId,
            fixtureId,
            fixtureState: {
              components: [
                createCompFxState({
                  props: [],
                  state: createFxValues({ count: 5 })
                })
              ]
            }
          }
        });
      }
    );
  });

  it('captures component state changes', async () => {
    let counterRef: null | Counter;
    const fixturesNew = {
      first: (
        <StateMock state={{ count: 5 }}>
          <Counter
            ref={elRef => {
              if (elRef) {
                counterRef = elRef;
              }
            }}
          />
        </StateMock>
      )
    };
    await mount(
      { rendererId, fixtures: fixturesNew, decorators },
      async ({ selectFixture, getLastFixtureState }) => {
        await selectFixture({
          rendererId,
          fixtureId,
          fixtureState: null
        });
        await until(() => counterRef);
        counterRef!.setState({ count: 7 });
        await retry(async () => expect(await getCount()).toBe(7));

        // Simulate a small pause between updates
        await delay(500);

        counterRef!.setState({ count: 13 });
        await retry(async () => expect(await getCount()).toBe(13));

        async function getCount() {
          const fixtureState = await getLastFixtureState();
          const [{ state }] = getCompFixtureStates(fixtureState);
          return state ? JSON.parse(state[0].stringified) : null;
        }
      }
    );
  });

  it('applies fixture state to replaced component type', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({
        renderer,
        update,
        selectFixture,
        setFixtureState,
        getLastFixtureState
      }) => {
        await selectFixture({
          rendererId,
          fixtureId,
          fixtureState: null
        });
        const fixtureState = await getLastFixtureState();
        const [{ decoratorId, elPath }] = getCompFixtureStates(fixtureState);
        await setFixtureState({
          rendererId,
          fixtureId,
          fixtureState: {
            components: updateCompFixtureState({
              fixtureState,
              decoratorId,
              elPath,
              state: createFxValues({ count: 50 })
            })
          }
        });
        await retry(() => expect(renderer.toJSON()).toBe('50 times'));
        update({
          rendererId,
          fixtures: {
            first: (
              <StateMock state={{ count: 5 }}>
                <CoolCounter />
              </StateMock>
            )
          },
          decorators
        });
        expect(renderer.toJSON()).toBe('50 timez');
      }
    );
  });

  it('overwrites fixture state on fixture change', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({
        renderer,
        update,
        selectFixture,
        setFixtureState,
        untilMessage,
        getLastFixtureState
      }) => {
        await selectFixture({
          rendererId,
          fixtureId,
          fixtureState: null
        });
        const fixtureState = await getLastFixtureState();
        const [{ decoratorId, elPath }] = getCompFixtureStates(fixtureState);
        await setFixtureState({
          rendererId,
          fixtureId,
          fixtureState: {
            components: updateCompFixtureState({
              fixtureState,
              decoratorId,
              elPath,
              state: createFxValues({ count: 6 })
            })
          }
        });
        await retry(() => expect(renderer.toJSON()).toBe('6 times'));
        // When the fixture changes the fixture state follows along
        update({
          rendererId,
          fixtures: {
            first: (
              <StateMock state={{ count: 50 }}>
                <Counter />
              </StateMock>
            )
          },
          decorators
        });
        await untilMessage({
          type: 'fixtureStateChange',
          payload: {
            rendererId,
            fixtureId,
            fixtureState: {
              components: [
                createCompFxState({
                  props: [],
                  state: createFxValues({ count: 50 })
                })
              ]
            }
          }
        });
        expect(renderer.toJSON()).toBe('50 times');
      }
    );
  });

  it('clears fixture state for removed fixture element', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ renderer, update, selectFixture, untilMessage }) => {
        await selectFixture({
          rendererId,
          fixtureId,
          fixtureState: null
        });
        await untilMessage({
          type: 'fixtureStateChange',
          payload: {
            rendererId,
            fixtureId,
            fixtureState: {
              components: [
                createCompFxState({
                  props: [],
                  state: createFxValues({ count: 5 })
                })
              ]
            }
          }
        });
        update({
          rendererId,
          fixtures: {
            // Counter element from fixture is gone, and so should the
            // fixture state related to it.
            first: 'No counts for you.'
          },
          decorators
        });
        expect(renderer.toJSON()).toBe('No counts for you.');
        await untilMessage({
          type: 'fixtureStateChange',
          payload: {
            rendererId,
            fixtureId,
            fixtureState: {
              components: []
            }
          }
        });
      }
    );
  });
});
