import * as React from 'react';
import { uniq } from 'lodash';
import retry from '@skidding/async-retry';
import {
  getCompFixtureStates,
  updateCompFixtureState
} from 'react-cosmos-shared2/fixtureState';
import { uuid } from 'react-cosmos-shared2/util';
import { HelloMessage, HelloMessageCls } from '../testHelpers/components';
import { createCompFxState, createFxValues } from '../testHelpers/fixtureState';
import { runTests, mount } from '../testHelpers';

const rendererId = uuid();
const fixtures = {
  first: <HelloMessage name="Bianca" />
};
const decorators = {};

runTests(mockConnect => {
  it('captures props', async () => {
    await mockConnect(async ({ getElement, selectFixture, untilMessage }) => {
      await mount(
        getElement({ rendererId, fixtures, decorators }),
        async renderer => {
          await selectFixture({
            rendererId,
            fixtureId: { path: 'first', name: null },
            fixtureState: null
          });

          await retry(() => expect(renderer.toJSON()).toBe('Hello Bianca'));

          await untilMessage({
            type: 'fixtureStateChange',
            payload: {
              rendererId,
              fixtureId: { path: 'first', name: null },
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
        }
      );
    });
  });

  it('overwrites prop', async () => {
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
                  props: createFxValues({ name: 'B' })
                })
              }
            });

            await retry(() => expect(renderer.toJSON()).toBe('Hello B'));
          }
        );
      }
    );
  });

  it('removes prop', async () => {
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
                  props: []
                })
              }
            });

            await retry(() => expect(renderer.toJSON()).toBe('Hello Stranger'));
          }
        );
      }
    );
  });

  it('clears props', async () => {
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
                  props: createFxValues({ name: 'B' })
                })
              }
            });

            await retry(() => expect(renderer.toJSON()).toBe('Hello B'));

            await setFixtureState({
              rendererId,
              fixtureId: { path: 'first', name: null },
              fixtureState: {
                components: updateCompFixtureState({
                  fixtureState,
                  decoratorId,
                  elPath,
                  props: null
                })
              }
            });

            await retry(() => expect(renderer.toJSON()).toBe('Hello Bianca'));

            // After the props are removed from the fixture state, the original
            // props are added back through a fixtureStateChange message
            await untilMessage({
              type: 'fixtureStateChange',
              payload: {
                rendererId,
                fixtureId: { path: 'first', name: null },
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
          }
        );
      }
    );
  });

  it('transitions props (reuses component instance)', async () => {
    await mockConnect(
      async ({
        getElement,
        selectFixture,
        getLastFixtureState,
        setFixtureState
      }) => {
        const refs: React.Component[] = [];
        // Intentionally create new ref function on every update to get the ref
        // to be called more than once even if the component instance is reused
        const getFixtures = () => ({
          first: (
            <HelloMessageCls
              ref={elRef => {
                if (elRef) {
                  refs.push(elRef);
                }
              }}
              name="Bianca"
            />
          )
        });

        await mount(
          getElement({
            rendererId,
            fixtures: getFixtures(),
            decorators
          }),
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
                  props: createFxValues({ name: 'B' })
                })
              }
            });

            renderer.update(
              getElement({
                rendererId,
                fixtures: getFixtures(),
                decorators
              })
            );

            await retry(() => {
              expect(refs.length).toBeGreaterThanOrEqual(2);
              expect(uniq(refs).length).toBe(1);
            });
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
        getLastFixtureState,
        setFixtureState
      }) => {
        const refs: React.Component[] = [];
        // Intentionally create new ref function on every update to get the ref
        // to be called more than once even if the component instance is reused
        const getFixtures = () => ({
          first: (
            <HelloMessageCls
              ref={elRef => {
                if (elRef) {
                  refs.push(elRef);
                }
              }}
              name="Bianca"
            />
          )
        });

        await mount(
          getElement({
            rendererId,
            fixtures: getFixtures(),
            decorators
          }),
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
                  props: createFxValues({ name: 'B' }),
                  resetInstance: true
                })
              }
            });

            renderer.update(
              getElement({
                rendererId,
                fixtures: getFixtures(),
                decorators
              })
            );

            await retry(() => {
              expect(refs.length).toBeGreaterThanOrEqual(2);
              expect(uniq(refs).length).toBe(2);
            });
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
        getLastFixtureState,
        selectFixture,
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
                  props: createFxValues({ name: 'B' })
                })
              }
            });

            await retry(() => expect(renderer.toJSON()).toBe('Hello B'));

            renderer.update(
              getElement({
                rendererId,
                fixtures: {
                  first: <HelloMessage name="Petec" />
                },
                decorators
              })
            );

            await untilMessage({
              type: 'fixtureStateChange',
              payload: {
                rendererId,
                fixtureId: { path: 'first', name: null },
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

            await retry(() => expect(renderer.toJSON()).toBe('Hello Petec'));
          }
        );
      }
    );
  });

  it('clears fixture state for removed fixture element', async () => {
    await mockConnect(async ({ getElement, untilMessage, selectFixture }) => {
      await mount(
        getElement({ rendererId, fixtures, decorators }),
        async renderer => {
          await selectFixture({
            rendererId,
            fixtureId: { path: 'first', name: null },
            fixtureState: null
          });

          await untilMessage({
            type: 'fixtureStateChange',
            payload: {
              rendererId,
              fixtureId: { path: 'first', name: null },
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
              },
              decorators
            })
          );

          expect(renderer.toJSON()).toBe('Hello all');

          await untilMessage({
            type: 'fixtureStateChange',
            payload: {
              rendererId,
              fixtureId: { path: 'first', name: null },
              fixtureState: {
                components: []
              }
            }
          });
        }
      );
    });
  });
});
