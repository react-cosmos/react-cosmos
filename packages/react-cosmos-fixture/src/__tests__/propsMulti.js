// @flow

import React from 'react';
import {
  getCompFixtureStates,
  updateCompFixtureState
} from 'react-cosmos-shared2/fixtureState';
import { uuid } from 'react-cosmos-shared2/util';
import { HelloMessage } from '../testHelpers/components';
import { createCompFxState, createFxValues } from '../testHelpers/fixtureState';
import { runTests, mount } from '../testHelpers';

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

runTests(mockConnect => {
  it('captures multiple props instances', async () => {
    await mockConnect(async ({ getElement, selectFixture, untilMessage }) => {
      await mount(
        getElement({ rendererId, fixtures, decorators }),
        async renderer => {
          await selectFixture({
            rendererId,
            fixturePath: 'first',
            fixtureState: null
          });

          expect(renderer.toJSON()).toEqual(['Hello Bianca', 'Hello B']);

          await untilMessage({
            type: 'fixtureStateChange',
            payload: {
              rendererId,
              fixturePath: 'first',
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
            }
          });
        }
      );
    });
  });

  it('overwrites prop in second instance', async () => {
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
              fixturePath: 'first',
              fixtureState: null
            });

            const fixtureState = await getLastFixtureState();
            const [, { decoratorId, elPath }] = getCompFixtureStates(
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
                  props: createFxValues({ name: 'Petec' })
                })
              }
            });

            expect(renderer.toJSON()).toEqual(['Hello Bianca', 'Hello Petec']);
          }
        );
      }
    );
  });
});
