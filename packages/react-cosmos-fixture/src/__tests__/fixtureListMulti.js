// @flow

import { uuid } from 'react-cosmos-shared2/util';
import { runTests, mount } from '../testHelpers';

const rendererId = uuid();
const fixtures = { first: { a: null, b: null, c: null }, second: null };
const decorators = {};

runTests(mockConnect => {
  it('posts ready response on mount', async () => {
    await mockConnect(async ({ getElement, untilMessage }) => {
      await mount(
        getElement({ rendererId, fixtures, decorators }),
        async () => {
          await untilMessage({
            type: 'rendererReady',
            payload: {
              rendererId,
              fixtures: { first: ['a', 'b', 'c'], second: null }
            }
          });
        }
      );
    });
  });
});
