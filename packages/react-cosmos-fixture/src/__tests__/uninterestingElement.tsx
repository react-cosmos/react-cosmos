import * as React from 'react';
import retry from '@skidding/async-retry';
import { uuid } from 'react-cosmos-shared2/util';
import { runTests, mount } from '../testHelpers';

const rendererId = uuid();
const fixtures = {
  first: <div>yo</div>
};
const decorators = {};

runTests(mockConnect => {
  it('collects no fixture state for uninteresting element type', async () => {
    await mockConnect(async ({ getElement, selectFixture, untilMessage }) => {
      await mount(
        getElement({ rendererId, fixtures, decorators }),
        async renderer => {
          await selectFixture({
            rendererId,
            fixtureId: { path: 'first', name: null },
            fixtureState: null
          });

          await retry(() =>
            expect(renderer.toJSON()!.children).toEqual(['yo'])
          );

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
