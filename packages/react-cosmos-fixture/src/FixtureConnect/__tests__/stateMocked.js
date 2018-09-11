// @flow

import React, { Component } from 'react';
import until from 'async-until';
import {
  getFixtureStateState,
  updateFixtureStateState
} from 'react-cosmos-shared2/fixtureState';
import { uuid } from '../../shared/uuid';
import { ComponentState } from '../../ComponentState';
import { mockConnect as mockPostMessage } from '../jestHelpers/postMessage';
import { mockConnect as mockWebSockets } from '../jestHelpers/webSockets';
import { mount } from '../jestHelpers/mount';

import type { ElementRef } from 'react';

export class Counter extends Component<{}, { count: number }> {
  state = { count: 0 };

  render() {
    const { count } = this.state;

    return typeof count === 'number' ? `${count} times` : 'Missing count';
  }
}

export class CoolCounter extends Component<{}, { count: number }> {
  state = { count: 0 };

  render() {
    return `${this.state.count} timez`;
  }
}

const rendererId = uuid();
const fixtures = {
  first: (
    <ComponentState state={{ count: 5 }}>
      <Counter />
    </ComponentState>
  )
};

tests(mockPostMessage);
tests(mockWebSockets);

function tests(mockConnect) {
  it('captures mocked state', async () => {
    await mockConnect(async ({ getElement, selectFixture, untilMessage }) => {
      await mount(getElement({ rendererId, fixtures }), async instance => {
        await selectFixture({
          rendererId,
          fixturePath: 'first'
        });

        expect(instance.toJSON()).toBe('5 times');

        await untilMessage({
          type: 'fixtureState',
          payload: {
            rendererId,
            fixturePath: 'first',
            fixtureState: {
              props: [getEmptyPropsInstanceShape()],
              state: [getStateInstanceShape(5)]
            }
          }
        });
      });
    });
  });

  it('overwrites mocked state', async () => {
    await mockConnect(
      async ({
        getElement,
        selectFixture,
        lastFixtureState,
        setFixtureState
      }) => {
        await mount(getElement({ rendererId, fixtures }), async instance => {
          await selectFixture({
            rendererId,
            fixturePath: 'first'
          });

          const fixtureState = await lastFixtureState();
          const [{ instanceId }] = getFixtureStateState(fixtureState);
          await setFixtureState({
            rendererId,
            fixturePath: 'first',
            fixtureStateChange: {
              state: updateFixtureStateState(fixtureState, instanceId, {
                count: 100
              })
            }
          });

          expect(instance.toJSON()).toBe('100 times');

          // A second update will provide code coverage for a different branch:
          // the transition between fixture state values
          await setFixtureState({
            rendererId,
            fixturePath: 'first',
            fixtureStateChange: {
              state: updateFixtureStateState(fixtureState, instanceId, {
                count: 200
              })
            }
          });

          expect(instance.toJSON()).toBe('200 times');
        });
      }
    );
  });

  it('removes mocked state property', async () => {
    await mockConnect(
      async ({
        getElement,
        selectFixture,
        lastFixtureState,
        setFixtureState
      }) => {
        await mount(getElement({ rendererId, fixtures }), async instance => {
          await selectFixture({
            rendererId,
            fixturePath: 'first'
          });

          const fixtureState = await lastFixtureState();
          const [{ instanceId }] = getFixtureStateState(fixtureState);
          await setFixtureState({
            rendererId,
            fixturePath: 'first',
            fixtureStateChange: {
              state: updateFixtureStateState(fixtureState, instanceId, {})
            }
          });

          expect(instance.toJSON()).toBe('Missing count');
        });
      }
    );
  });

  it('reverts to mocked state', async () => {
    await mockConnect(
      async ({
        getElement,
        selectFixture,
        untilMessage,
        lastFixtureState,
        setFixtureState
      }) => {
        await mount(getElement({ rendererId, fixtures }), async instance => {
          await selectFixture({
            rendererId,
            fixturePath: 'first'
          });

          const fixtureState = await lastFixtureState();
          const [{ instanceId }] = getFixtureStateState(fixtureState);
          await setFixtureState({
            rendererId,
            fixturePath: 'first',
            fixtureStateChange: {
              state: updateFixtureStateState(fixtureState, instanceId, {
                count: 10
              })
            }
          });

          expect(instance.toJSON()).toBe('10 times');

          await setFixtureState({
            rendererId,
            fixturePath: 'first',
            fixtureStateChange: {
              state: []
            }
          });

          expect(instance.toJSON()).toBe('5 times');

          await untilMessage({
            type: 'fixtureState',
            payload: {
              rendererId,
              fixturePath: 'first',
              fixtureState: {
                props: [getEmptyPropsInstanceShape()],
                state: [getStateInstanceShape(5)]
              }
            }
          });
        });
      }
    );
  });

  it('captures component state changes', async () => {
    const timeout = 1000;
    let counterRef: ?ElementRef<typeof Counter>;

    const fixtures = {
      first: (
        <ComponentState state={{ count: 5 }}>
          <Counter
            ref={elRef => {
              if (elRef) {
                counterRef = elRef;
              }
            }}
          />
        </ComponentState>
      )
    };

    await mockConnect(
      async ({ getElement, selectFixture, lastFixtureState }) => {
        await mount(getElement({ rendererId, fixtures }), async () => {
          await selectFixture({
            rendererId,
            fixturePath: 'first'
          });

          await until(() => counterRef, { timeout });
          if (!counterRef) {
            throw new Error('Counter ref missing');
          }

          counterRef.setState({ count: 7 });
          try {
            await until(async () => (await getCount()) === 7, { timeout });
          } catch (err) {
            expect(await getCount()).toBe(7);
          }

          // Simulate a small pause between updates
          await new Promise(res => setTimeout(res, 500));

          counterRef.setState({ count: 13 });
          try {
            await until(async () => (await getCount()) === 13, { timeout });
          } catch (err) {
            expect(await getCount()).toBe(13);
          }
        });

        async function getCount() {
          const fixtureState = await lastFixtureState();
          const [{ values }] = getFixtureStateState(fixtureState);

          return values[0].value;
        }
      }
    );
  });

  it('applies fixture state to replaced component type', async () => {
    await mockConnect(
      async ({
        getElement,
        selectFixture,
        lastFixtureState,
        setFixtureState
      }) => {
        await mount(getElement({ rendererId, fixtures }), async instance => {
          await selectFixture({
            rendererId,
            fixturePath: 'first'
          });

          const fixtureState = await lastFixtureState();
          const [{ instanceId }] = getFixtureStateState(fixtureState);
          await setFixtureState({
            rendererId,
            fixturePath: 'first',
            fixtureStateChange: {
              state: updateFixtureStateState(fixtureState, instanceId, {
                count: 50
              })
            }
          });

          expect(instance.toJSON()).toBe('50 times');

          instance.update(
            getElement({
              rendererId,
              fixtures: {
                first: (
                  <ComponentState state={{ count: 5 }}>
                    <CoolCounter />
                  </ComponentState>
                )
              }
            })
          );

          expect(instance.toJSON()).toBe('50 timez');
        });
      }
    );
  });

  it('overwrites fixture state on fixture change', async () => {
    await mockConnect(
      async ({
        getElement,
        selectFixture,
        untilMessage,
        lastFixtureState,
        setFixtureState
      }) => {
        await mount(getElement({ rendererId, fixtures }), async instance => {
          await selectFixture({
            rendererId,
            fixturePath: 'first'
          });

          const fixtureState = await lastFixtureState();
          const [{ instanceId }] = getFixtureStateState(fixtureState);
          await setFixtureState({
            rendererId,
            fixturePath: 'first',
            fixtureStateChange: {
              state: updateFixtureStateState(fixtureState, instanceId, {
                count: 6
              })
            }
          });

          expect(instance.toJSON()).toBe('6 times');

          // When the fixture changes, however, the fixture state follows along
          instance.update(
            getElement({
              rendererId,
              fixtures: {
                first: (
                  <ComponentState state={{ count: 50 }}>
                    <Counter />
                  </ComponentState>
                )
              }
            })
          );

          await untilMessage({
            type: 'fixtureState',
            payload: {
              rendererId,
              fixturePath: 'first',
              fixtureState: {
                props: [getEmptyPropsInstanceShape()],
                state: [getStateInstanceShape(50)]
              }
            }
          });

          expect(instance.toJSON()).toBe('50 times');
        });
      }
    );
  });

  it('removes state from fixture state on unmount', async () => {
    await mockConnect(async ({ getElement, untilMessage, selectFixture }) => {
      await mount(getElement({ rendererId, fixtures }), async instance => {
        await selectFixture({
          rendererId,
          fixturePath: 'first'
        });

        await untilMessage({
          type: 'fixtureState',
          payload: {
            rendererId,
            fixturePath: 'first',
            fixtureState: {
              props: [getEmptyPropsInstanceShape()],
              state: [getStateInstanceShape(5)]
            }
          }
        });

        instance.update(
          getElement({
            rendererId,
            fixtures: {
              // This will cause both the CaptureProps and ComponentState
              // instance correspondings to the previous fixture element to
              // unmount
              first: null
            }
          })
        );

        await untilMessage({
          type: 'fixtureState',
          payload: {
            rendererId,
            fixturePath: 'first',
            fixtureState: {
              props: [],
              state: []
            }
          }
        });
      });
    });
  });
}

function getEmptyPropsInstanceShape() {
  return {
    instanceId: expect.any(Number),
    componentName: 'Counter',
    renderKey: expect.any(Number),
    values: []
  };
}

function getStateInstanceShape(count) {
  return {
    instanceId: expect.any(Number),
    componentName: 'Counter',
    values: [
      {
        serializable: true,
        key: 'count',
        value: count
      }
    ]
  };
}
