// @flow

import React from 'react';
import { uuid } from 'react-cosmos-shared2/util';
import { Counter } from '../testHelpers/components';
import { createCompFxState, createFxValues } from '../testHelpers/fixtureState';
import { mockConnect as mockPostMessage } from '../testHelpers/postMessage';
import { mockConnect as mockWebSockets } from '../testHelpers/webSockets';
import { mount } from '../testHelpers/mount';

const rendererId = uuid();
const fixtures = {
  first: <Counter />
};

tests(mockPostMessage);
tests(mockWebSockets);

function tests(mockConnect) {
  // NOTE: This is a regression test that was created for a bug that initally
  // slipped unnoticed in https://github.com/react-cosmos/react-cosmos/pull/893
  it('captures initial state after re-selecting fixture', async () => {
    await mockConnect(async ({ getElement, selectFixture, untilMessage }) => {
      await mount(getElement({ rendererId, fixtures }), async () => {
        await selectFixture({
          rendererId,
          fixturePath: 'first',
          fixtureState: null
        });

        await selectFixture({
          rendererId,
          fixturePath: 'first',
          fixtureState: null
        });

        await untilMessage({
          type: 'fixtureStateChange',
          payload: {
            rendererId,
            fixturePath: 'first',
            fixtureState: {
              components: [
                createCompFxState({
                  componentName: 'Counter',
                  props: [],
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
