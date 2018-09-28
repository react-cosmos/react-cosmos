// @flow

import React from 'react';
import { StateMock } from '@react-mock/state';
import {
  getCompFixtureStates,
  updateCompFixtureState
} from 'react-cosmos-shared2/fixtureState';
import { uuid } from '../../shared/uuid';
import { Counter } from '../jestHelpers/components';
import { createCompFxState, createFxValues } from '../jestHelpers/fixtureState';
import { mockConnect as mockPostMessage } from '../jestHelpers/postMessage';
import { mockConnect as mockWebSockets } from '../jestHelpers/webSockets';
import { mount } from '../jestHelpers/mount';

const rendererId = uuid();
const fixtures = {
  first: (
    <>
      <StateMock state={{ count: 5 }}>
        <Counter />
      </StateMock>
      <StateMock state={{ count: 10 }}>
        <Counter />
      </StateMock>
    </>
  )
};

tests(mockPostMessage);
tests(mockWebSockets);

function tests(mockConnect) {
  it('captures mocked state from multiple instances', async () => {
    await mockConnect(async ({ getElement, selectFixture, untilMessage }) => {
      await mount(getElement({ rendererId, fixtures }), async () => {
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
                  props: [],
                  state: createFxValues({ count: 5 })
                }),
                createCompFxState({
                  props: [],
                  state: createFxValues({ count: 10 })
                })
              ]
            }
          }
        });
      });
    });
  });

  it('overwrites mocked state in second instances', async () => {
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
          const [, { decoratorId, elPath }] = getCompFixtureStates(
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
                state: createFxValues({ count: 100 })
              })
            }
          });

          expect(renderer.toJSON()).toEqual(['5 times', '100 times']);
        });
      }
    );
  });
}
