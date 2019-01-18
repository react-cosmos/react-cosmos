// @flow

import React from 'react';
import { uuid } from 'react-cosmos-shared2/util';
import { createCompFxState, createFxValues } from '../testHelpers/fixtureState';
import { runTests, mount } from '../testHelpers';

const rendererId = uuid();
const fixtures = {
  first: <div>yo</div>
};
const decorators = {};

runTests(mockConnect => {
  it('transitions string children into an element with children', async () => {
    await mockConnect(async ({ getElement, selectFixture, untilMessage }) => {
      await mount(
        getElement({ rendererId, fixtures, decorators }),
        async renderer => {
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
                    props: createFxValues({ children: 'yo' })
                  })
                ]
              }
            }
          });

          renderer.update(
            getElement({
              rendererId,
              fixtures: {
                first: (
                  <div>
                    <div>brah</div>
                  </div>
                )
              },
              decorators
            })
          );

          await untilMessage({
            type: 'fixtureStateChange',
            payload: {
              rendererId,
              fixturePath: 'first',
              fixtureState: {
                components: [
                  createCompFxState({
                    props: [
                      {
                        key: 'children',
                        serializable: false,
                        stringified: `<div>\n  brah\n</div>`
                      }
                    ]
                  }),
                  createCompFxState({
                    props: createFxValues({ children: 'brah' })
                  })
                ]
              }
            }
          });
        }
      );
    });
  });
});
