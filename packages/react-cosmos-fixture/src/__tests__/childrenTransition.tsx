import * as React from 'react';
import { uuid } from 'react-cosmos-shared2/util';
import { createCompFxState, createFxValues } from '../testHelpers/fixtureState';
import { Wrapper } from '../testHelpers/components';
import { runTests, mount } from '../testHelpers';

const rendererId = uuid();
const fixtures = {
  first: <Wrapper>yo</Wrapper>
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
                  <Wrapper>
                    <Wrapper>brah</Wrapper>
                  </Wrapper>
                )
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
                    props: [
                      {
                        key: 'children',
                        serializable: false,
                        stringified: `<Wrapper>\n  brah\n</Wrapper>`
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
