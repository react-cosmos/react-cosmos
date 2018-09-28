// @flow

import React from 'react';
import until from 'async-until';
import {
  getCompFixtureStates,
  updateCompFixtureState
} from 'react-cosmos-shared2/fixtureState';
import { uuid } from '../../shared/uuid';
import { SuffixCounter } from '../jestHelpers/components';
import { createCompFxState, createFxValues } from '../jestHelpers/fixtureState';
import { mockConnect as mockPostMessage } from '../jestHelpers/postMessage';
import { mockConnect as mockWebSockets } from '../jestHelpers/webSockets';
import { mount } from '../jestHelpers/mount';

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

tests(mockPostMessage);
tests(mockWebSockets);

function tests(mockConnect) {
  it('keeps state when resetting props', async () => {
    await mockConnect(
      async ({
        getElement,
        selectFixture,
        untilMessage,
        lastFixtureState,
        setFixtureState
      }) => {
        await mount(getElement({ rendererId, fixtures }), async renderer => {
          await selectFixture({
            rendererId,
            fixturePath: 'first'
          });

          const fixtureState = await lastFixtureState();
          const [{ decoratorId, elPath }] = getCompFixtureStates(fixtureState);

          await setFixtureState({
            rendererId,
            fixturePath: 'first',
            fixtureStateChange: {
              components: updateCompFixtureState({
                fixtureState,
                elPath,
                decoratorId,
                state: createFxValues({ count: 5 })
              })
            }
          });

          expect(renderer.toJSON()).toBe('5 times');

          await setFixtureState({
            rendererId,
            fixturePath: 'first',
            fixtureStateChange: {
              components: updateCompFixtureState({
                fixtureState: await lastFixtureState(),
                decoratorId,
                elPath,
                props: createFxValues({ suffix: 'timez' }),
                resetInstance: false
              })
            }
          });

          expect(renderer.toJSON()).toBe('5 timez');

          await untilMessage({
            type: 'fixtureState',
            payload: {
              rendererId,
              fixturePath: 'first',
              fixtureState: {
                components: [
                  createCompFxState({
                    props: createFxValues({ suffix: 'timez' }),
                    state: createFxValues({ count: 5 })
                  })
                ]
              }
            }
          });
        });
      }
    );
  });

  it('keeps state when transitioning props', async () => {
    await mockConnect(
      async ({
        getElement,
        selectFixture,
        untilMessage,
        lastFixtureState,
        setFixtureState
      }) => {
        await mount(getElement({ rendererId, fixtures }), async renderer => {
          await selectFixture({
            rendererId,
            fixturePath: 'first'
          });

          const fixtureState = await lastFixtureState();
          const [{ decoratorId, elPath }] = getCompFixtureStates(fixtureState);

          await setFixtureState({
            rendererId,
            fixturePath: 'first',
            fixtureStateChange: {
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
            fixtureStateChange: {
              components: updateCompFixtureState({
                fixtureState: await lastFixtureState(),
                decoratorId,
                elPath,
                props: createFxValues({ suffix: 'timez' })
              })
            }
          });

          expect(renderer.toJSON()).toBe('5 timez');

          await untilMessage({
            type: 'fixtureState',
            payload: {
              rendererId,
              fixturePath: 'first',
              fixtureState: {
                components: [
                  createCompFxState({
                    props: createFxValues({ suffix: 'timez' }),
                    state: createFxValues({ count: 5 })
                  })
                ]
              }
            }
          });
        });
      }
    );
  });

  it('keeps props when changing state', async () => {
    await mockConnect(
      async ({
        getElement,
        selectFixture,
        untilMessage,
        lastFixtureState,
        setFixtureState
      }) => {
        await mount(getElement({ rendererId, fixtures }), async renderer => {
          await selectFixture({
            rendererId,
            fixturePath: 'first'
          });

          const fixtureState = await lastFixtureState();
          const [{ decoratorId, elPath }] = getCompFixtureStates(fixtureState);

          await setFixtureState({
            rendererId,
            fixturePath: 'first',
            fixtureStateChange: {
              components: updateCompFixtureState({
                fixtureState,
                decoratorId,
                elPath,
                props: createFxValues({ suffix: 'timez' })
              })
            }
          });

          expect(renderer.toJSON()).toBe('0 timez');

          await setFixtureState({
            rendererId,
            fixturePath: 'first',
            fixtureStateChange: {
              components: updateCompFixtureState({
                fixtureState: await lastFixtureState(),
                decoratorId,
                elPath,
                state: createFxValues({ count: 5 })
              })
            }
          });

          expect(renderer.toJSON()).toBe('5 timez');

          await untilMessage({
            type: 'fixtureState',
            payload: {
              rendererId,
              fixturePath: 'first',
              fixtureState: {
                components: [
                  createCompFxState({
                    props: createFxValues({ suffix: 'timez' }),
                    state: createFxValues({ count: 5 })
                  })
                ]
              }
            }
          });
        });
      }
    );
  });

  // FIXME
  it.skip('keeps props when state changes', async () => {
    const timeout = 1000;
    let counterRef: ?ElementRef<typeof SuffixCounter>;

    const fixtures = {
      first: (
        // The extra levels of nesting capture a complex case regarding deep
        // comparison of children nodes
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
        lastFixtureState,
        setFixtureState
      }) => {
        await mount(getElement({ rendererId, fixtures }), async renderer => {
          await selectFixture({
            rendererId,
            fixturePath: 'first'
          });

          const fixtureState = await lastFixtureState();
          const [{ decoratorId, elPath }] = getCompFixtureStates(fixtureState);

          await setFixtureState({
            rendererId,
            fixturePath: 'first',
            fixtureStateChange: {
              components: updateCompFixtureState({
                fixtureState,
                decoratorId,
                elPath,
                props: createFxValues({ suffix: 'timez' })
              })
            }
          });

          expect(renderer.toJSON()).toBe('0 timez');

          await until(() => counterRef, { timeout });
          if (!counterRef) {
            throw new Error('Counter ref missing');
          }

          counterRef.setState({ count: 7 });

          // Simulate a small pause to ensure state doesn't break later
          await new Promise(res => setTimeout(res, 500));

          expect(renderer.toJSON()).toBe('7 timez');

          await untilMessage({
            type: 'fixtureState',
            payload: {
              rendererId,
              fixturePath: 'first',
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
        });
      }
    );
  });

  it('updates props on fixture change', async () => {
    await mockConnect(async ({ getElement, selectFixture, untilMessage }) => {
      await mount(getElement({ rendererId, fixtures }), async renderer => {
        await selectFixture({
          rendererId,
          fixturePath: 'first'
        });

        renderer.update(
          getElement({
            rendererId,
            fixtures: {
              first: <SuffixCounter suffix="timez" />
            }
          })
        );

        expect(renderer.toJSON()).toBe('0 timez');

        await untilMessage({
          type: 'fixtureState',
          payload: {
            rendererId,
            fixturePath: 'first',
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
      });
    });
  });
}
