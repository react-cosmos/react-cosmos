import * as React from 'react';
import retry from '@skidding/async-retry';
import {
  getCompFixtureStates,
  updateCompFixtureState
} from 'react-cosmos-shared2/fixtureState';
import { uuid } from 'react-cosmos-shared2/util';
import { HelloMessage } from '../testHelpers/components';
import { createCompFxState, createFxValues } from '../testHelpers/fixtureState';
import { runFixtureConnectTests } from '../testHelpers';

const rendererId = uuid();
const fixtures = {
  first: (
    <>
      <HelloMessage name="Bianca" />
      <HelloMessage name="B" />
    </>
  )
};
const decorators = {};
const fixtureId = { path: 'first', name: null };

runFixtureConnectTests(mount => {
  it('captures multiple props instances', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ renderer, selectFixture, fixtureStateChange }) => {
        await selectFixture({
          rendererId,
          fixtureId,
          fixtureState: null
        });
        await retry(() =>
          expect(renderer.toJSON()).toEqual(['Hello Bianca', 'Hello B'])
        );
        await fixtureStateChange({
          rendererId,
          fixtureId,
          fixtureState: {
            components: [
              createCompFxState({
                componentName: 'HelloMessage',
                elPath: 'props.children[0]',
                props: createFxValues({ name: 'Bianca' })
              }),
              createCompFxState({
                componentName: 'HelloMessage',
                elPath: 'props.children[1]',
                props: createFxValues({ name: 'B' })
              })
            ]
          }
        });
      }
    );
  });

  it('overwrites prop in second instance', async () => {
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
              props: createFxValues({ name: 'Petec' })
            })
          }
        });
        await retry(() =>
          expect(renderer.toJSON()).toEqual(['Hello Bianca', 'Hello Petec'])
        );
      }
    );
  });
});
