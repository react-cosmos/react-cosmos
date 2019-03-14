import * as React from 'react';
import until from 'async-until';
import retry from '@skidding/async-retry';
import {
  getCompFixtureStates,
  updateCompFixtureState
} from 'react-cosmos-shared2/fixtureState';
import { uuid } from 'react-cosmos-shared2/util';
import { SuffixCounter } from '../testHelpers/components';
import { createCompFxState, createFxValues } from '../testHelpers/fixtureState';
import { runFixtureConnectTests } from '../testHelpers';

const rendererId = uuid();
const fixtures = {
  first: (
    // The extra levels of nesting capture a complex case regarding deep
    // comparison of children nodes
    <>
      <>
        <SuffixCounter suffix="times" />
      </>
    </>
  )
};
const decorators = {};
const fixtureId = { path: 'first', name: null };

runFixtureConnectTests(mount => {
  it('keeps state when resetting props', async () => {
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
        let fixtureState = await getLastFixtureState();
        const [{ decoratorId, elPath }] = getCompFixtureStates(fixtureState);
        fixtureState = {
          components: updateCompFixtureState({
            fixtureState,
            elPath,
            decoratorId,
            state: createFxValues({ count: 5 })
          })
        };
        await setFixtureState({
          rendererId,
          fixtureId,
          fixtureState
        });
        await retry(() => expect(renderer.toJSON()).toBe('5 times'));
        await setFixtureState({
          rendererId,
          fixtureId,
          fixtureState: {
            components: updateCompFixtureState({
              fixtureState,
              decoratorId,
              elPath,
              props: createFxValues({ suffix: 'timez' }),
              resetInstance: false
            })
          }
        });
        await retry(() => expect(renderer.toJSON()).toBe('5 timez'));
      }
    );
  });

  it('keeps state when transitioning props', async () => {
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
        let fixtureState = await getLastFixtureState();
        const [{ decoratorId, elPath }] = getCompFixtureStates(fixtureState);
        fixtureState = {
          components: updateCompFixtureState({
            fixtureState,
            decoratorId,
            elPath,
            state: createFxValues({ count: 5 })
          })
        };
        await setFixtureState({
          rendererId,
          fixtureId,
          fixtureState
        });
        await retry(() => expect(renderer.toJSON()).toBe('5 times'));
        await setFixtureState({
          rendererId,
          fixtureId,
          fixtureState: {
            components: updateCompFixtureState({
              fixtureState,
              decoratorId,
              elPath,
              props: createFxValues({ suffix: 'timez' })
            })
          }
        });
        await retry(() => expect(renderer.toJSON()).toBe('5 timez'));
      }
    );
  });

  it('keeps props when changing state', async () => {
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
        let fixtureState = await getLastFixtureState();
        const [{ decoratorId, elPath }] = getCompFixtureStates(fixtureState);
        fixtureState = {
          components: updateCompFixtureState({
            fixtureState,
            decoratorId,
            elPath,
            props: createFxValues({ suffix: 'timez' })
          })
        };
        await setFixtureState({
          rendererId,
          fixtureId,
          fixtureState
        });
        await retry(() => expect(renderer.toJSON()).toBe('0 timez'));
        await setFixtureState({
          rendererId,
          fixtureId,
          fixtureState: {
            components: updateCompFixtureState({
              fixtureState,
              decoratorId,
              elPath,
              state: createFxValues({ count: 5 })
            })
          }
        });
        await retry(() => expect(renderer.toJSON()).toBe('5 timez'));
      }
    );
  });

  it('keeps props when state changes', async () => {
    let counterRef: null | SuffixCounter;
    const fixturesNew = {
      first: (
        <SuffixCounter
          ref={elRef => {
            if (elRef) {
              counterRef = elRef;
            }
          }}
          suffix="times"
        />
      )
    };
    await mount(
      { rendererId, fixtures: fixturesNew, decorators },
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
        const [{ decoratorId, elPath }] = getCompFixtureStates(fixtureState);
        await setFixtureState({
          rendererId,
          fixtureId,
          fixtureState: {
            components: updateCompFixtureState({
              fixtureState,
              decoratorId,
              elPath,
              props: createFxValues({ suffix: 'timez' })
            })
          }
        });
        await retry(() => expect(renderer.toJSON()).toBe('0 timez'));

        await until(() => counterRef, { timeout: 1000 });
        counterRef!.setState({ count: 7 });

        await retry(() => expect(renderer.toJSON()).toBe('7 timez'));
        await fixtureStateChange({
          rendererId,
          fixtureId,
          fixtureState: {
            components: [
              createCompFxState({
                props: createFxValues({ suffix: 'timez' }),
                state: createFxValues({ count: 7 })
              })
            ]
          }
        });
      }
    );
  });

  it('updates props on fixture change', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ renderer, update, selectFixture, fixtureStateChange }) => {
        await selectFixture({
          rendererId,
          fixtureId,
          fixtureState: {}
        });
        update({
          rendererId,
          fixtures: {
            first: <SuffixCounter suffix="timez" />
          },
          decorators
        });
        await retry(() => expect(renderer.toJSON()).toBe('0 timez'));
        await fixtureStateChange({
          rendererId,
          fixtureId,
          fixtureState: {
            components: [
              createCompFxState({
                props: createFxValues({ suffix: 'timez' }),
                state: createFxValues({ count: 0 })
              })
            ]
          }
        });
      }
    );
  });
});
