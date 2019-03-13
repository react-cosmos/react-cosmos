import * as React from 'react';
import retry from '@skidding/async-retry';
import { StateMock } from '@react-mock/state';
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
  first: (
    <>
      <StateMock state={{ count: 5 }}>
        <Counter />
      </StateMock>
      <StateMock state={{ count: 10 }}>
        <Counter />
      </StateMock>
    </>
  )
};
const decorators = {};
const fixtureId = { path: 'first', name: null };

runFixtureConnectTests(mount => {
  it('captures mocked state from multiple instances', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ selectFixture, untilMessage }) => {
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
                }),
                createCompFxState({
                  props: [],
                  state: createFxValues({ count: 10 })
                })
              ]
            }
          }
        });
      }
    );
  });

  it('overwrites mocked state in second instances', async () => {
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
        const [, { decoratorId, elPath }] = getCompFixtureStates(fixtureState);
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
        await retry(() =>
          expect(renderer.toJSON()).toEqual(['5 times', '100 times'])
        );
      }
    );
  });
});
