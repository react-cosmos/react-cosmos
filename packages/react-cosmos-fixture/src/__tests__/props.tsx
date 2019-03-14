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
import { runFixtureConnectTests } from '../testHelpers';

const rendererId = uuid();
const fixtures = {
  first: <HelloMessage name="Bianca" />
};
const decorators = {};
const fixtureId = { path: 'first', name: null };

runFixtureConnectTests(mount => {
  it('captures props', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ renderer, selectFixture, fixtureStateChange }) => {
        await selectFixture({
          rendererId,
          fixtureId,
          fixtureState: {}
        });
        await retry(() => expect(renderer.toJSON()).toBe('Hello Bianca'));
        await fixtureStateChange({
          rendererId,
          fixtureId,
          fixtureState: {
            components: [
              createCompFxState({
                componentName: 'HelloMessage',
                props: createFxValues({ name: 'Bianca' })
              })
            ]
          }
        });
      }
    );
  });

  it('overwrites prop', async () => {
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
        const [{ decoratorId, elPath }] = getCompFixtureStates(fixtureState);
        await setFixtureState({
          rendererId,
          fixtureId,
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
  });

  it('removes prop', async () => {
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
        const [{ decoratorId, elPath }] = getCompFixtureStates(fixtureState);
        await setFixtureState({
          rendererId,
          fixtureId,
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
  });

  it('clears props', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({
        renderer,
        selectFixture,
        setFixtureState,
        fixtureStateChange,
        getLastFixtureState
      }) => {
        await selectFixture({
          rendererId,
          fixtureId,
          fixtureState: {}
        });
        const fixtureState = await getLastFixtureState();
        const [{ decoratorId, elPath }] = getCompFixtureStates(fixtureState);
        await setFixtureState({
          rendererId,
          fixtureId,
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
          fixtureId,
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
        await fixtureStateChange({
          rendererId,
          fixtureId,
          fixtureState: {
            components: [
              createCompFxState({
                componentName: 'HelloMessage',
                props: createFxValues({ name: 'Bianca' })
              })
            ]
          }
        });
      }
    );
  });

  it('transitions props (reuses component instance)', async () => {
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
      { rendererId, fixtures: getFixtures(), decorators },
      async ({
        update,
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
        const [{ decoratorId, elPath }] = getCompFixtureStates(fixtureState);
        await setFixtureState({
          rendererId,
          fixtureId,
          fixtureState: {
            components: updateCompFixtureState({
              fixtureState,
              decoratorId,
              elPath,
              props: createFxValues({ name: 'B' })
            })
          }
        });
        update({
          rendererId,
          fixtures: getFixtures(),
          decorators
        });
        await retry(() => {
          expect(refs.length).toBeGreaterThanOrEqual(2);
          expect(uniq(refs).length).toBe(1);
        });
      }
    );
  });

  it('resets props (creates new component instance)', async () => {
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
      { rendererId, fixtures: getFixtures(), decorators },
      async ({
        update,
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
        const [{ decoratorId, elPath }] = getCompFixtureStates(fixtureState);
        await setFixtureState({
          rendererId,
          fixtureId,
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
        update({
          rendererId,
          fixtures: getFixtures(),
          decorators
        });
        await retry(() => {
          expect(refs.length).toBeGreaterThanOrEqual(2);
          expect(uniq(refs).length).toBe(2);
        });
      }
    );
  });

  it('overwrites fixture state on fixture change', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({
        renderer,
        update,
        selectFixture,
        setFixtureState,
        fixtureStateChange,
        getLastFixtureState
      }) => {
        await selectFixture({
          rendererId,
          fixtureId,
          fixtureState: {}
        });
        const fixtureState = await getLastFixtureState();
        const [{ decoratorId, elPath }] = getCompFixtureStates(fixtureState);
        await setFixtureState({
          rendererId,
          fixtureId,
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
        update({
          rendererId,
          fixtures: {
            first: <HelloMessage name="Petec" />
          },
          decorators
        });
        await fixtureStateChange({
          rendererId,
          fixtureId,
          fixtureState: {
            components: [
              createCompFxState({
                componentName: 'HelloMessage',
                props: createFxValues({ name: 'Petec' })
              })
            ]
          }
        });
        await retry(() => expect(renderer.toJSON()).toBe('Hello Petec'));
      }
    );
  });

  it('clears fixture state for removed fixture element', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ renderer, update, selectFixture, fixtureStateChange }) => {
        await selectFixture({
          rendererId,
          fixtureId,
          fixtureState: {}
        });
        await fixtureStateChange({
          rendererId,
          fixtureId,
          fixtureState: {
            components: [
              createCompFxState({
                componentName: 'HelloMessage',
                props: createFxValues({ name: 'Bianca' })
              })
            ]
          }
        });
        update({
          rendererId,
          fixtures: {
            // HelloMessage element from fixture is gone, and so should the
            // fixture state related to it.
            first: 'Hello all'
          },
          decorators
        });
        expect(renderer.toJSON()).toBe('Hello all');
        await fixtureStateChange({
          rendererId,
          fixtureId,
          fixtureState: {
            components: []
          }
        });
      }
    );
  });
});
