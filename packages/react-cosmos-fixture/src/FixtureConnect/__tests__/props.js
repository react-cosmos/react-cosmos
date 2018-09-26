// @flow

import React, { Component } from 'react';
import {
  getPropsFixtureState,
  updatePropsFixtureState
} from 'react-cosmos-shared2/fixtureState';
import { uuid } from '../../shared/uuid';
import { mockConnect as mockPostMessage } from '../jestHelpers/postMessage';
import { mockConnect as mockWebSockets } from '../jestHelpers/webSockets';
import { mount } from '../jestHelpers/mount';

export class HelloMessage extends Component<{ name?: string }> {
  render() {
    return `Hello ${this.props.name || 'Stranger'}`;
  }
}

const rendererId = uuid();
const fixtures = {
  first: <HelloMessage name="Bianca" />
};

tests(mockPostMessage);
tests(mockWebSockets);

function tests(mockConnect) {
  it('captures props', async () => {
    await mockConnect(async ({ getElement, selectFixture, untilMessage }) => {
      await mount(getElement({ rendererId, fixtures }), async renderer => {
        await selectFixture({
          rendererId,
          fixturePath: 'first'
        });

        expect(renderer.toJSON()).toBe('Hello Bianca');

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
        await mount(getElement({ rendererId, fixtures }), async renderer => {
          await selectFixture({
            rendererId,
            fixturePath: 'first'
          });

          const fixtureState = await lastFixtureState();
          const [{ decoratorId, elPath }] = getPropsFixtureState(fixtureState);

          await setFixtureState({
            rendererId,
            fixturePath: 'first',
            fixtureStateChange: {
              props: updatePropsFixtureState({
                fixtureState,
                decoratorId,
                elPath,
                values: [createNamePropValue('B')]
              })
            }
          });

          expect(renderer.toJSON()).toBe('Hello B');

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
        await mount(getElement({ rendererId, fixtures }), async renderer => {
          await selectFixture({
            rendererId,
            fixturePath: 'first'
          });

          const fixtureState = await lastFixtureState();
          const [{ decoratorId, elPath }] = getPropsFixtureState(fixtureState);

          await setFixtureState({
            rendererId,
            fixturePath: 'first',
            fixtureStateChange: {
              props: updatePropsFixtureState({
                fixtureState,
                decoratorId,
                elPath,
                values: []
              })
            }
          });

          expect(renderer.toJSON()).toBe('Hello Stranger');
        });
      }
    );
  });

  it('clears props', async () => {
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
          const [{ decoratorId, elPath }] = getPropsFixtureState(fixtureState);

          await setFixtureState({
            rendererId,
            fixturePath: 'first',
            fixtureStateChange: {
              props: updatePropsFixtureState({
                fixtureState,
                decoratorId,
                elPath,
                values: [createNamePropValue('B')]
              })
            }
          });

          expect(renderer.toJSON()).toBe('Hello B');

          await setFixtureState({
            rendererId,
            fixturePath: 'first',
            fixtureStateChange: {
              props: []
            }
          });

          expect(renderer.toJSON()).toBe('Hello Bianca');

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
          first: <HelloMessage ref={ref} name="Bianca" />
        });
        let ref1, ref2;

        await mount(
          getElement({
            rendererId,
            fixtures: getFixtures(elRef => {
              if (elRef && !ref1) ref1 = elRef;
            })
          }),
          async renderer => {
            await selectFixture({
              rendererId,
              fixturePath: 'first'
            });

            const fixtureState = await lastFixtureState();
            const [{ decoratorId, elPath }] = getPropsFixtureState(
              fixtureState
            );

            await setFixtureState({
              rendererId,
              fixturePath: 'first',
              fixtureStateChange: {
                props: updatePropsFixtureState({
                  fixtureState,
                  decoratorId,
                  elPath,
                  values: [createNamePropValue('B')]
                })
              }
            });

            renderer.update(
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
          first: <HelloMessage ref={ref} name="Bianca" />
        });
        let ref1, ref2;

        await mount(
          getElement({
            rendererId,
            fixtures: getFixtures(elRef => {
              if (elRef && !ref1) ref1 = elRef;
            })
          }),
          async renderer => {
            await selectFixture({
              rendererId,
              fixturePath: 'first'
            });

            const fixtureState = await lastFixtureState();
            const [{ decoratorId, elPath }] = getPropsFixtureState(
              fixtureState
            );

            await setFixtureState({
              rendererId,
              fixturePath: 'first',
              fixtureStateChange: {
                props: updatePropsFixtureState({
                  fixtureState,
                  decoratorId,
                  elPath,
                  values: [createNamePropValue('B')],
                  resetInstance: true
                })
              }
            });

            renderer.update(
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
        await mount(getElement({ rendererId, fixtures }), async renderer => {
          await selectFixture({
            rendererId,
            fixturePath: 'first'
          });

          const fixtureState = await lastFixtureState();
          const [{ decoratorId, elPath }] = getPropsFixtureState(fixtureState);

          await setFixtureState({
            rendererId,
            fixturePath: 'first',
            fixtureStateChange: {
              props: updatePropsFixtureState({
                fixtureState,
                decoratorId,
                elPath,
                values: [createNamePropValue('B')]
              })
            }
          });

          expect(renderer.toJSON()).toBe('Hello B');

          renderer.update(
            getElement({
              rendererId,
              fixtures: {
                first: <HelloMessage name="Petec" />
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

          expect(renderer.toJSON()).toBe('Hello Petec');
        });
      }
    );
  });

  it('clears fixture state for removed fixture element', async () => {
    await mockConnect(async ({ getElement, untilMessage, selectFixture }) => {
      await mount(getElement({ rendererId, fixtures }), async renderer => {
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
              props: [getPropsInstanceShape('Bianca')]
            }
          }
        });

        renderer.update(
          getElement({
            rendererId,
            fixtures: {
              // HelloMessage element from fixture is gone, and so should the
              // fixture state related to it.
              first: 'Hello all'
            }
          })
        );

        expect(renderer.toJSON()).toBe('Hello all');

        await untilMessage({
          type: 'fixtureState',
          payload: {
            rendererId,
            fixturePath: 'first',
            fixtureState: {
              props: []
            }
          }
        });
      });
    });
  });
}

function createNamePropValue(name) {
  return {
    serializable: true,
    key: 'name',
    stringified: `"${name}"`
  };
}

function getPropsInstanceShape(name) {
  return {
    decoratorId: expect.any(Number),
    elPath: expect.any(String),
    componentName: 'HelloMessage',
    renderKey: expect.any(Number),
    values: [
      {
        serializable: true,
        key: 'name',
        stringified: `"${name}"`
      }
    ]
  };
}
