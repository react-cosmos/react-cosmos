import * as React from 'react';
import retry from '@skidding/async-retry';
import {
  createValues,
  updateFixtureStateClassState,
  removeFixtureStateClassState
} from 'react-cosmos-shared2/fixtureState';
import { uuid } from 'react-cosmos-shared2/util';
import { Counter } from '../testHelpers/components';
import {
  anyProps,
  anyClassState,
  getClassState
} from '../testHelpers/fixtureState';
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
            props: [anyProps()],
            classState: [
              anyClassState({
                values: createValues({ count: 0 })
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
        const [{ elementId }] = getClassState(fixtureState);
        await setFixtureState({
          rendererId,
          fixtureId,
          fixtureState: {
            classState: updateFixtureStateClassState({
              fixtureState,
              elementId,
              values: createValues({ count: 5 })
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
        const [{ elementId }] = getClassState(fixtureState);
        await setFixtureState({
          rendererId,
          fixtureId,
          fixtureState: {
            classState: updateFixtureStateClassState({
              fixtureState,
              elementId,
              values: []
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
        const [{ elementId }] = getClassState(fixtureState);
        await setFixtureState({
          rendererId,
          fixtureId,
          fixtureState: {
            classState: updateFixtureStateClassState({
              fixtureState,
              elementId,
              values: createValues({ count: 5 })
            })
          }
        });
        await retry(() => expect(renderer.toJSON()).toBe('5 times'));
        await setFixtureState({
          rendererId,
          fixtureId,
          fixtureState: {
            classState: removeFixtureStateClassState(fixtureState, elementId)
          }
        });
        await retry(() => expect(renderer.toJSON()).toBe('0 times'));
      }
    );
  });
});
