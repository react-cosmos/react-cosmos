// @flow

import React from 'react';
import {
  getCompFixtureStates,
  updateCompFixtureState
} from 'react-cosmos-shared2/fixtureState';
import { uuid } from '../../shared/uuid';
import { HelloMessage } from '../jestHelpers/components';
import { createCompFxState, createFxValues } from '../jestHelpers/fixtureState';
import { mockConnect as mockPostMessage } from '../jestHelpers/postMessage';
import { mockConnect as mockWebSockets } from '../jestHelpers/webSockets';
import { mount } from '../jestHelpers/mount';

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
              components: [
                createCompFxState({
                  componentName: 'HelloMessage',
                  props: createFxValues({ name: 'Bianca' })
                })
              ]
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
          const [{ decoratorId, elPath }] = getCompFixtureStates(fixtureState);

          await setFixtureState({
            rendererId,
            fixturePath: 'first',
            fixtureStateChange: {
              components: updateCompFixtureState({
                fixtureState,
                decoratorId,
                elPath,
                props: createFxValues({ name: 'B' })
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
                components: [
                  createCompFxState({
                    componentName: 'HelloMessage',
                    props: createFxValues({ name: 'B' })
                  })
                ]
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
          const [{ decoratorId, elPath }] = getCompFixtureStates(fixtureState);

          await setFixtureState({
            rendererId,
            fixturePath: 'first',
            fixtureStateChange: {
              components: updateCompFixtureState({
                fixtureState,
                decoratorId,
                elPath,
                props: []
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
          const [{ decoratorId, elPath }] = getCompFixtureStates(fixtureState);

          await setFixtureState({
            rendererId,
            fixturePath: 'first',
            fixtureStateChange: {
              components: updateCompFixtureState({
                fixtureState,
                decoratorId,
                elPath,
                props: createFxValues({ name: 'B' })
              })
            }
          });

          expect(renderer.toJSON()).toBe('Hello B');

          await setFixtureState({
            rendererId,
            fixturePath: 'first',
            fixtureStateChange: {
              components: updateCompFixtureState({
                fixtureState,
                decoratorId,
                elPath,
                props: null
              })
            }
          });

          expect(renderer.toJSON()).toBe('Hello Bianca');

          await untilMessage({
            type: 'fixtureState',
            payload: {
              rendererId,
              fixturePath: 'first',
              fixtureState: {
                components: [
                  createCompFxState({
                    componentName: 'HelloMessage',
                    props: createFxValues({ name: 'Bianca' })
                  })
                ]
              }
            }
          });
        });
      }
    );
  });

  it('transitions props (reuses component instance)', async () => {
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
            const [{ decoratorId, elPath }] = getCompFixtureStates(
              fixtureState
            );

            await setFixtureState({
              rendererId,
              fixturePath: 'first',
              fixtureStateChange: {
                components: updateCompFixtureState({
                  fixtureState,
                  decoratorId,
                  elPath,
                  props: createFxValues({ name: 'B' })
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

  it('resets props (creates new component instance)', async () => {
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
            const [{ decoratorId, elPath }] = getCompFixtureStates(
              fixtureState
            );

            await setFixtureState({
              rendererId,
              fixturePath: 'first',
              fixtureStateChange: {
                components: updateCompFixtureState({
                  fixtureState,
                  decoratorId,
                  elPath,
                  props: createFxValues({ name: 'B' }),
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
          const [{ decoratorId, elPath }] = getCompFixtureStates(fixtureState);

          await setFixtureState({
            rendererId,
            fixturePath: 'first',
            fixtureStateChange: {
              components: updateCompFixtureState({
                fixtureState,
                decoratorId,
                elPath,
                props: createFxValues({ name: 'B' })
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
                components: [
                  createCompFxState({
                    componentName: 'HelloMessage',
                    props: createFxValues({ name: 'Petec' })
                  })
                ]
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
              components: [
                createCompFxState({
                  componentName: 'HelloMessage',
                  props: createFxValues({ name: 'Bianca' })
                })
              ]
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
              components: []
            }
          }
        });
      });
    });
  });
}
