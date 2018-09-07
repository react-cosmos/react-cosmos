// @flow

import React, { Component } from 'react';
import {
  getFixtureStateProps,
  updateFixtureStateProps
} from 'react-cosmos-shared2/fixtureState';
import { uuid } from '../../shared/uuid';
import { mockConnect as mockPostMessage } from '../jestHelpers/postMessage';
import { mockConnect as mockWebSockets } from '../jestHelpers/webSockets';
import { mount } from '../jestHelpers/mount';

tests(mockPostMessage);
tests(mockWebSockets);

function tests(mockConnect) {
  it('posts fixture state with props', async () => {
    const rendererId = uuid();
    const fixtures = {
      first: <MyComponent name="Bianca" />
    };

    await mockConnect(async ({ getElement, selectFixture, untilMessage }) => {
      await mount(getElement({ rendererId, fixtures }), async instance => {
        await selectFixture({
          rendererId,
          fixturePath: 'first'
        });

        expect(instance.toJSON()).toBe('Hello Bianca');

        await untilMessage({
          type: 'fixtureState',
          payload: {
            rendererId,
            fixturePath: 'first',
            fixtureState: {
              props: [getPropsInstanceShape('Bianca')]
            }
          }
        });
      });
    });
  });

  it('overwrites prop', async () => {
    await mockConnect(
      async ({
        getElement,
        selectFixture,
        untilMessage,
        lastFixtureState,
        setFixtureState
      }) => {
        const rendererId = uuid();
        const fixtures = {
          first: <MyComponent name="Bianca" />
        };

        await mount(getElement({ rendererId, fixtures }), async instance => {
          await selectFixture({
            rendererId,
            fixturePath: 'first'
          });

          const fixtureState = await lastFixtureState();
          const [{ instanceId }] = getFixtureStateProps(fixtureState);

          await setFixtureState({
            rendererId,
            fixturePath: 'first',
            fixtureStateChange: {
              props: updateFixtureStateProps(fixtureState, instanceId, {
                name: 'B'
              })
            }
          });

          expect(instance.toJSON()).toBe('Hello B');

          await untilMessage({
            type: 'fixtureState',
            payload: {
              rendererId,
              fixturePath: 'first',
              fixtureState: {
                props: [getPropsInstanceShape('B')]
              }
            }
          });
        });
      }
    );
  });

  it('removes prop', async () => {
    await mockConnect(
      async ({
        getElement,
        selectFixture,
        lastFixtureState,
        setFixtureState
      }) => {
        const rendererId = uuid();
        const fixtures = {
          first: <MyComponent name="Bianca" />
        };

        await mount(getElement({ rendererId, fixtures }), async instance => {
          await selectFixture({
            rendererId,
            fixturePath: 'first'
          });

          const fixtureState = await lastFixtureState();
          const [{ instanceId }] = getFixtureStateProps(fixtureState);

          await setFixtureState({
            rendererId,
            fixturePath: 'first',
            fixtureStateChange: {
              props: updateFixtureStateProps(fixtureState, instanceId, {})
            }
          });

          expect(instance.toJSON()).toBe('Hello Stranger');
        });
      }
    );
  });

  it('removes prop', async () => {
    await mockConnect(
      async ({
        getElement,
        selectFixture,
        untilMessage,
        lastFixtureState,
        setFixtureState
      }) => {
        const rendererId = uuid();
        const fixtures = {
          first: <MyComponent name="Bianca" />
        };

        await mount(getElement({ rendererId, fixtures }), async instance => {
          await selectFixture({
            rendererId,
            fixturePath: 'first'
          });

          const fixtureState = await lastFixtureState();
          const [{ instanceId }] = getFixtureStateProps(fixtureState);

          await setFixtureState({
            rendererId,
            fixturePath: 'first',
            fixtureStateChange: {
              props: updateFixtureStateProps(fixtureState, instanceId, {
                name: 'B'
              })
            }
          });

          expect(instance.toJSON()).toBe('Hello B');

          await setFixtureState({
            rendererId,
            fixturePath: 'first',
            fixtureStateChange: {
              props: []
            }
          });

          expect(instance.toJSON()).toBe('Hello Bianca');

          await untilMessage({
            type: 'fixtureState',
            payload: {
              rendererId,
              fixturePath: 'first',
              fixtureState: {
                props: [getPropsInstanceShape('Bianca')]
              }
            }
          });
        });
      }
    );
  });

  it('transitions instance props', async () => {
    await mockConnect(
      async ({
        getElement,
        selectFixture,
        lastFixtureState,
        setFixtureState
      }) => {
        const rendererId = uuid();
        const getFixtures = ref => ({
          first: <MyComponent ref={ref} name="Bianca" />
        });
        let ref1, ref2;

        await mount(
          getElement({
            rendererId,
            fixtures: getFixtures(elRef => {
              if (elRef && !ref1) ref1 = elRef;
            })
          }),
          async instance => {
            await selectFixture({
              rendererId,
              fixturePath: 'first'
            });

            const fixtureState = await lastFixtureState();
            const [{ instanceId }] = getFixtureStateProps(fixtureState);

            await setFixtureState({
              rendererId,
              fixturePath: 'first',
              fixtureStateChange: {
                props: updateFixtureStateProps(fixtureState, instanceId, {
                  name: 'B'
                })
              }
            });

            instance.update(
              getElement({
                rendererId,
                fixtures: getFixtures(elRef => {
                  if (elRef) ref2 = elRef;
                })
              })
            );

            expect(ref2).toBeTruthy();
            expect(ref2).toBe(ref1);
          }
        );
      }
    );
  });

  it('resets instance with props', async () => {
    await mockConnect(
      async ({
        getElement,
        selectFixture,
        lastFixtureState,
        setFixtureState
      }) => {
        const rendererId = uuid();
        const getFixtures = ref => ({
          first: <MyComponent ref={ref} name="Bianca" />
        });
        let ref1, ref2;

        await mount(
          getElement({
            rendererId,
            fixtures: getFixtures(elRef => {
              if (elRef && !ref1) ref1 = elRef;
            })
          }),
          async instance => {
            await selectFixture({
              rendererId,
              fixturePath: 'first'
            });

            const fixtureState = await lastFixtureState();
            const [{ instanceId }] = getFixtureStateProps(fixtureState);

            await setFixtureState({
              rendererId,
              fixturePath: 'first',
              fixtureStateChange: {
                props: updateFixtureStateProps(
                  fixtureState,
                  instanceId,
                  {
                    name: 'B'
                  },
                  true
                )
              }
            });

            instance.update(
              getElement({
                rendererId,
                fixtures: getFixtures(elRef => {
                  if (elRef) ref2 = elRef;
                })
              })
            );

            expect(ref1).toBeTruthy();
            expect(ref2).not.toBe(ref1);
          }
        );
      }
    );
  });

  it('overwrites fixture state on fixture change', async () => {
    await mockConnect(
      async ({
        getElement,
        untilMessage,
        lastFixtureState,
        selectFixture,
        setFixtureState
      }) => {
        const rendererId = uuid();
        const fixtures = {
          first: <MyComponent name="Bianca" />
        };

        await mount(
          getElement({
            rendererId,
            fixtures
          }),
          async instance => {
            await selectFixture({
              rendererId,
              fixturePath: 'first'
            });

            const fixtureState = await lastFixtureState();
            const [{ instanceId }] = getFixtureStateProps(fixtureState);

            await setFixtureState({
              rendererId,
              fixturePath: 'first',
              fixtureStateChange: {
                props: updateFixtureStateProps(fixtureState, instanceId, {
                  name: 'B'
                })
              }
            });

            expect(instance.toJSON()).toBe('Hello B');

            instance.update(
              getElement({
                rendererId,
                fixtures: {
                  first: <MyComponent name="Petec" />
                }
              })
            );

            await untilMessage({
              type: 'fixtureState',
              payload: {
                rendererId,
                fixturePath: 'first',
                fixtureState: {
                  props: [getPropsInstanceShape('Petec')]
                }
              }
            });

            expect(instance.toJSON()).toBe('Hello Petec');
          }
        );
      }
    );
  });
}

class MyComponent extends Component<{ name?: string }> {
  render() {
    return `Hello ${this.props.name || 'Stranger'}`;
  }
}

function getPropsInstanceShape(name) {
  return {
    instanceId: expect.any(Number),
    componentName: 'MyComponent',
    renderKey: expect.any(Number),
    values: [
      {
        serializable: true,
        key: 'name',
        value: name
      }
    ]
  };
}
