import * as React from 'react';
import delay from 'delay';
import until from 'async-until';
import retry from '@skidding/async-retry';
import { StateMock } from '@react-mock/state';
import {
  FixtureStateSimpleValue,
  createValues,
  updateFixtureStateClassState,
  removeFixtureStateClassState
} from 'react-cosmos-shared2/fixtureState';
import { uuid } from 'react-cosmos-shared2/util';
import { Counter, CoolCounter } from '../testHelpers/components';
import {
  anyProps,
  anyClassState,
  getClassState
} from '../testHelpers/fixtureState';
import { runFixtureLoaderTests } from '../testHelpers';

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

runFixtureLoaderTests(mount => {
  it('captures mocked state', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ renderer, selectFixture, fixtureStateChange }) => {
        await selectFixture({
          rendererId,
          fixtureId,
          fixtureState: {}
        });
        await retry(() => expect(renderer.toJSON()).toBe('5 times'));
        await fixtureStateChange({
          rendererId,
          fixtureId,
          fixtureState: {
            props: [anyProps()],
            classState: [
              anyClassState({
                values: createValues({ count: 5 })
              })
            ]
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
          fixtureState: {}
        });
        const fixtureState = await getLastFixtureState();
        const [{ elementId }] = getClassState(fixtureState);
        await setFixtureState({
          rendererId,
          fixtureId,
          fixtureState: {
            classState: updateFixtureStateClassState({
              fixtureState,
              elementId,
              values: createValues({ count: 100 })
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
            classState: updateFixtureStateClassState({
              fixtureState,
              elementId,
              values: createValues({ count: 200 })
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
          fixtureState: {}
        });
        const fixtureState = await getLastFixtureState();
        const [{ elementId }] = getClassState(fixtureState);
        await setFixtureState({
          rendererId,
          fixtureId,
          fixtureState: {
            classState: updateFixtureStateClassState({
              fixtureState,
              elementId,
              values: {}
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
        fixtureStateChange,
        getLastFixtureState
      }) => {
        await selectFixture({
          rendererId,
          fixtureId,
          fixtureState: {}
        });
        const fixtureState = await getLastFixtureState();
        const [{ elementId }] = getClassState(fixtureState);
        await setFixtureState({
          rendererId,
          fixtureId,
          fixtureState: {
            classState: updateFixtureStateClassState({
              fixtureState,
              elementId,
              values: createValues({ count: 10 })
            })
          }
        });
        await retry(() => expect(renderer.toJSON()).toBe('10 times'));
        await setFixtureState({
          rendererId,
          fixtureId,
          fixtureState: {
            classState: removeFixtureStateClassState(fixtureState, elementId)
          }
        });
        await retry(() => expect(renderer.toJSON()).toBe('5 times'));
        // After the state is removed from the fixture state, the original
        // state is added back through a fixtureStateChange message
        await fixtureStateChange({
          rendererId,
          fixtureId,
          fixtureState: {
            props: [anyProps()],
            classState: [
              anyClassState({
                values: createValues({ count: 5 })
              })
            ]
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
          fixtureState: {}
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
          const [{ values }] = getClassState(fixtureState);
          return values
            ? (values.count as FixtureStateSimpleValue).value
            : null;
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
          fixtureState: {}
        });
        const fixtureState = await getLastFixtureState();
        const [{ elementId }] = getClassState(fixtureState);
        await setFixtureState({
          rendererId,
          fixtureId,
          fixtureState: {
            classState: updateFixtureStateClassState({
              fixtureState,
              elementId,
              values: createValues({ count: 50 })
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
        fixtureStateChange,
        getLastFixtureState
      }) => {
        await selectFixture({
          rendererId,
          fixtureId,
          fixtureState: {}
        });
        const fixtureState = await getLastFixtureState();
        const [{ elementId }] = getClassState(fixtureState);
        await setFixtureState({
          rendererId,
          fixtureId,
          fixtureState: {
            classState: updateFixtureStateClassState({
              fixtureState,
              elementId,
              values: createValues({ count: 6 })
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
        await fixtureStateChange({
          rendererId,
          fixtureId,
          fixtureState: {
            props: [anyProps()],
            classState: [
              anyClassState({
                values: createValues({ count: 50 })
              })
            ]
          }
        });
        expect(renderer.toJSON()).toBe('50 times');
      }
    );
  });

  it('clears fixture state for removed fixture element', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ renderer, update, selectFixture, fixtureStateChange }) => {
        await selectFixture({
          rendererId,
          fixtureId,
          fixtureState: {}
        });
        await fixtureStateChange({
          rendererId,
          fixtureId,
          fixtureState: {
            props: [anyProps()],
            classState: [
              anyClassState({
                values: createValues({ count: 5 })
              })
            ]
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
        await fixtureStateChange({
          rendererId,
          fixtureId,
          fixtureState: {
            props: [],
            classState: []
          }
        });
      }
    );
  });
});
