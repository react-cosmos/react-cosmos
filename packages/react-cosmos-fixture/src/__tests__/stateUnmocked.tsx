import * as React from 'react';
import retry from '@skidding/async-retry';
import {
  getCompFixtureStates,
  updateCompFixtureState
} from 'react-cosmos-shared2/fixtureState';
import { uuid } from 'react-cosmos-shared2/util';
import { Counter } from '../testHelpers/components';
import { createCompFxState, createFxValues } from '../testHelpers/fixtureState';
import { runFixtureConnectTests } from '../testHelpers';

const rendererId = uuid();
const fixtures = {
  first: <Counter />
};
const decorators = {};
const fixtureId = { path: 'first', name: null };

runFixtureConnectTests(mount => {
  it('captures initial state', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ renderer, selectFixture, fixtureStateChange }) => {
        await selectFixture({
          rendererId,
          fixtureId,
          fixtureState: {}
        });
        await retry(() => expect(renderer.toJSON()).toBe('0 times'));
        await fixtureStateChange({
          rendererId,
          fixtureId,
          fixtureState: {
            components: [
              createCompFxState({
                componentName: 'Counter',
                props: [],
                state: createFxValues({ count: 0 })
              })
            ]
          }
        });
      }
    );
  });

  it('overwrites initial state', async () => {
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
        const [{ decoratorId, elPath }] = getCompFixtureStates(fixtureState);
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
        await retry(() => expect(renderer.toJSON()).toBe('5 times'));
      }
    );
  });

  it('removes initial state property', async () => {
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

  it('reverts to initial state', async () => {
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
        const [{ decoratorId, elPath }] = getCompFixtureStates(fixtureState);
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
        await retry(() => expect(renderer.toJSON()).toBe('5 times'));
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
        await retry(() => expect(renderer.toJSON()).toBe('0 times'));
      }
    );
  });
});
