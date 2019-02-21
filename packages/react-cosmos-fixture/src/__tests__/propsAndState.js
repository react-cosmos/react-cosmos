// @flow

import React from 'react';
import until from 'async-until';
import {
  getCompFixtureStates,
  updateCompFixtureState
} from 'react-cosmos-shared2/fixtureState';
import { uuid } from 'react-cosmos-shared2/util';
import { SuffixCounter } from '../testHelpers/components';
import { createCompFxState, createFxValues } from '../testHelpers/fixtureState';
import { runTests, mount } from '../testHelpers';

import type { ElementRef } from 'react';

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

runTests(mockConnect => {
  it('keeps state when resetting props', async () => {
    await mockConnect(
      async ({
        getElement,
        selectFixture,
        getLastFixtureState,
        setFixtureState
      }) => {
        await mount(
          getElement({ rendererId, fixtures, decorators }),
          async renderer => {
            await selectFixture({
              rendererId,
              fixtureId: { path: 'first', name: null },
              fixtureState: null
            });

            let fixtureState = await getLastFixtureState();
            const [{ decoratorId, elPath }] = getCompFixtureStates(
              fixtureState
            );

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
              fixtureId: { path: 'first', name: null },
              fixtureState
            });

            expect(renderer.toJSON()).toBe('5 times');

            await setFixtureState({
              rendererId,
              fixtureId: { path: 'first', name: null },
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

            expect(renderer.toJSON()).toBe('5 timez');
          }
        );
      }
    );
  });

  it('keeps state when transitioning props', async () => {
    await mockConnect(
      async ({
        getElement,
        selectFixture,
        getLastFixtureState,
        setFixtureState
      }) => {
        await mount(
          getElement({ rendererId, fixtures, decorators }),
          async renderer => {
            await selectFixture({
              rendererId,
              fixtureId: { path: 'first', name: null },
              fixtureState: null
            });

            let fixtureState = await getLastFixtureState();
            const [{ decoratorId, elPath }] = getCompFixtureStates(
              fixtureState
            );

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
              fixtureId: { path: 'first', name: null },
              fixtureState
            });

            expect(renderer.toJSON()).toBe('5 times');

            await setFixtureState({
              rendererId,
              fixtureId: { path: 'first', name: null },
              fixtureState: {
                components: updateCompFixtureState({
                  fixtureState,
                  decoratorId,
                  elPath,
                  props: createFxValues({ suffix: 'timez' })
                })
              }
            });

            expect(renderer.toJSON()).toBe('5 timez');
          }
        );
      }
    );
  });

  it('keeps props when changing state', async () => {
    await mockConnect(
      async ({
        getElement,
        selectFixture,
        getLastFixtureState,
        setFixtureState
      }) => {
        await mount(
          getElement({ rendererId, fixtures, decorators }),
          async renderer => {
            await selectFixture({
              rendererId,
              fixtureId: { path: 'first', name: null },
              fixtureState: null
            });

            let fixtureState = await getLastFixtureState();
            const [{ decoratorId, elPath }] = getCompFixtureStates(
              fixtureState
            );

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
              fixtureId: { path: 'first', name: null },
              fixtureState
            });

            expect(renderer.toJSON()).toBe('0 timez');

            await setFixtureState({
              rendererId,
              fixtureId: { path: 'first', name: null },
              fixtureState: {
                components: updateCompFixtureState({
                  fixtureState,
                  decoratorId,
                  elPath,
                  state: createFxValues({ count: 5 })
                })
              }
            });

            expect(renderer.toJSON()).toBe('5 timez');
          }
        );
      }
    );
  });

  it('keeps props when state changes', async () => {
    let counterRef: ?ElementRef<typeof SuffixCounter>;

    const fixtures = {
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

    await mockConnect(
      async ({
        getElement,
        selectFixture,
        untilMessage,
        getLastFixtureState,
        setFixtureState
      }) => {
        await mount(
          getElement({ rendererId, fixtures, decorators }),
          async renderer => {
            await selectFixture({
              rendererId,
              fixtureId: { path: 'first', name: null },
              fixtureState: null
            });

            const fixtureState = await getLastFixtureState();
            const [{ decoratorId, elPath }] = getCompFixtureStates(
              fixtureState
            );

            await setFixtureState({
              rendererId,
              fixtureId: { path: 'first', name: null },
              fixtureState: {
                components: updateCompFixtureState({
                  fixtureState,
                  decoratorId,
                  elPath,
                  props: createFxValues({ suffix: 'timez' })
                })
              }
            });

            expect(renderer.toJSON()).toBe('0 timez');

            await until(() => counterRef, { timeout: 1000 });
            if (!counterRef) {
              throw new Error('Counter ref missing');
            }

            counterRef.setState({ count: 7 });

            // Simulate a small pause to ensure state doesn't break later
            await new Promise(res => setTimeout(res, 500));

            expect(renderer.toJSON()).toBe('7 timez');

            await untilMessage({
              type: 'fixtureStateChange',
              payload: {
                rendererId,
                fixtureId: { path: 'first', name: null },
                fixtureState: {
                  components: [
                    createCompFxState({
                      props: createFxValues({ suffix: 'timez' }),
                      state: createFxValues({ count: 7 })
                    })
                  ]
                }
              }
            });
          }
        );
      }
    );
  });

  it('updates props on fixture change', async () => {
    await mockConnect(async ({ getElement, selectFixture, untilMessage }) => {
      await mount(
        getElement({ rendererId, fixtures, decorators }),
        async renderer => {
          await selectFixture({
            rendererId,
            fixtureId: { path: 'first', name: null },
            fixtureState: null
          });

          renderer.update(
            getElement({
              rendererId,
              fixtures: {
                first: <SuffixCounter suffix="timez" />
              },
              decorators
            })
          );

          expect(renderer.toJSON()).toBe('0 timez');

          await untilMessage({
            type: 'fixtureStateChange',
            payload: {
              rendererId,
              fixtureId: { path: 'first', name: null },
              fixtureState: {
                components: [
                  createCompFxState({
                    props: createFxValues({ suffix: 'timez' }),
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
});
