// @flow

import React from 'react';
import {
  getCompFixtureStates,
  updateCompFixtureState
} from 'react-cosmos-shared2/fixtureState';
import { uuid } from 'react-cosmos-shared2/util';
import { Counter } from '../testHelpers/components';
import { createCompFxState, createFxValues } from '../testHelpers/fixtureState';
import { runTests, mount } from '../testHelpers';

const rendererId = uuid();
const fixtures = {
  first: <Counter />
};
const decorators = {};

runTests(mockConnect => {
  it('captures initial state', async () => {
    await mockConnect(async ({ getElement, selectFixture, untilMessage }) => {
      await mount(
        getElement({ rendererId, fixtures, decorators }),
        async renderer => {
          await selectFixture({
            rendererId,
            fixturePath: 'first',
            fixtureState: null
          });

          expect(renderer.toJSON()).toBe('0 times');

          await untilMessage({
            type: 'fixtureStateChange',
            payload: {
              rendererId,
              fixturePath: 'first',
              fixtureState: {
                components: [
                  createCompFxState({
                    componentName: 'Counter',
                    props: [],
                    state: createFxValues({ count: 0 })
                  })
                ]
              }
            }
          });
        }
      );
    });
  });

  it('overwrites initial state', async () => {
    await mockConnect(
      async ({
        getElement,
        selectFixture,
        getFxStateFromLastChange,
        setFixtureState
      }) => {
        await mount(
          getElement({ rendererId, fixtures, decorators }),
          async renderer => {
            await selectFixture({
              rendererId,
              fixturePath: 'first',
              fixtureState: null
            });

            const fixtureState = await getFxStateFromLastChange();
            const [{ decoratorId, elPath }] = getCompFixtureStates(
              fixtureState
            );
            await setFixtureState({
              rendererId,
              fixturePath: 'first',
              fixtureState: {
                components: updateCompFixtureState({
                  fixtureState,
                  decoratorId,
                  elPath,
                  state: createFxValues({ count: 5 })
                })
              }
            });

            expect(renderer.toJSON()).toBe('5 times');
          }
        );
      }
    );
  });

  it('removes initial state property', async () => {
    await mockConnect(
      async ({
        getElement,
        selectFixture,
        getFxStateFromLastChange,
        setFixtureState
      }) => {
        await mount(
          getElement({ rendererId, fixtures, decorators }),
          async renderer => {
            await selectFixture({
              rendererId,
              fixturePath: 'first',
              fixtureState: null
            });

            const fixtureState = await getFxStateFromLastChange();
            const [{ decoratorId, elPath }] = getCompFixtureStates(
              fixtureState
            );
            await setFixtureState({
              rendererId,
              fixturePath: 'first',
              fixtureState: {
                components: updateCompFixtureState({
                  fixtureState,
                  decoratorId,
                  elPath,
                  state: []
                })
              }
            });

            expect(renderer.toJSON()).toBe('Missing count');
          }
        );
      }
    );
  });

  it('reverts to initial state', async () => {
    await mockConnect(
      async ({
        getElement,
        selectFixture,
        getFxStateFromLastChange,
        setFixtureState
      }) => {
        await mount(
          getElement({ rendererId, fixtures, decorators }),
          async renderer => {
            await selectFixture({
              rendererId,
              fixturePath: 'first',
              fixtureState: null
            });

            const fixtureState = await getFxStateFromLastChange();
            const [{ decoratorId, elPath }] = getCompFixtureStates(
              fixtureState
            );
            await setFixtureState({
              rendererId,
              fixturePath: 'first',
              fixtureState: {
                components: updateCompFixtureState({
                  fixtureState,
                  decoratorId,
                  elPath,
                  state: createFxValues({ count: 5 })
                })
              }
            });

            expect(renderer.toJSON()).toBe('5 times');

            await setFixtureState({
              rendererId,
              fixturePath: 'first',
              fixtureState: {
                components: updateCompFixtureState({
                  fixtureState,
                  decoratorId,
                  elPath,
                  state: null
                })
              }
            });

            expect(renderer.toJSON()).toBe('0 times');
          }
        );
      }
    );
  });
});
