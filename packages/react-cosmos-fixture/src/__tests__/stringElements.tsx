import * as React from 'react';
import { uuid } from 'react-cosmos-shared2/util';
import { runTests, mount } from '../testHelpers';
import { createCompFxState, createFxValues } from '../testHelpers/fixtureState';

const rendererId = uuid();
const decorators = {};

runTests(mockConnect => {
  it('collects fixture state for interesting string element type', async () => {
    const fixtures = {
      first: <input type="text" />
    };
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
                    componentName: 'input',
                    props: createFxValues({ type: 'text' })
                  })
                ]
              }
            }
          });
        }
      );
    });
  });

  it('collects no fixture state for uninteresting string element type', async () => {
    const fixtures = {
      first: <div>yo</div>
    };
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
                components: []
              }
            }
          });
        }
      );
    });
  });
});
