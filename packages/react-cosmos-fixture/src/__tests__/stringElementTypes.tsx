import * as React from 'react';
import { uuid } from 'react-cosmos-shared2/util';
import { runFixtureConnectTests } from '../testHelpers';
import { createCompFxState, createFxValues } from '../testHelpers/fixtureState';

const rendererId = uuid();
const decorators = {};
const fixtureId = { path: 'first', name: null };

runFixtureConnectTests(mount => {
  it('collects fixture state for interesting string element type', async () => {
    const fixtures = {
      first: <input type="text" />
    };
    await mount(
      { rendererId, fixtures, decorators },
      async ({ selectFixture, untilMessage }) => {
        await selectFixture({
          rendererId,
          fixtureId,
          fixtureState: null
        });
        await untilMessage({
          type: 'fixtureStateChange',
          payload: {
            rendererId,
            fixtureId,
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

  it('collects no fixture state for uninteresting string element type', async () => {
    const fixtures = {
      first: <div>yo</div>
    };
    await mount(
      { rendererId, fixtures, decorators },
      async ({ selectFixture, untilMessage }) => {
        await selectFixture({
          rendererId,
          fixtureId,
          fixtureState: null
        });
        await untilMessage({
          type: 'fixtureStateChange',
          payload: {
            rendererId,
            fixtureId,
            fixtureState: {
              components: []
            }
          }
        });
      }
    );
  });
});
