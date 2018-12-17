// @flow

import { uuid } from 'react-cosmos-shared2/util';
import { mockConnect as mockPostMessage } from '../testHelpers/postMessage';
import { mockConnect as mockWebSockets } from '../testHelpers/webSockets';
import { mount } from '../testHelpers/mount';

const rendererId = uuid();
const fixtures = {
  'src/foo/__fixtures__/default.js': 'Hello!'
};
const decorators = {
  'src/decorator.js': ({ children }) => ['Decorated at src', children],
  'src/foo/decorator.js': ({ children }) => ['Decorated at src/foo', children],
  'src/bar/decorator.js': ({ children }) => ['Decorated at src/bar', children]
};

tests(mockPostMessage);
tests(mockWebSockets);

function tests(mockConnect) {
  it('renders selected fixture inside decorator', async () => {
    await mockConnect(async ({ getElement, selectFixture }) => {
      await mount(
        getElement({ rendererId, fixtures, decorators }),
        async renderer => {
          const [fixturePath] = Object.keys(fixtures);
          await selectFixture({
            rendererId,
            fixturePath,
            fixtureState: null
          });

          // "src/bar/decorator" should be omitted because it's not a placed in
          // a parent directory of the selected fixture
          expect(renderer.toJSON()).toEqual([
            'Decorated at src',
            'Decorated at src/foo',
            'Hello!'
          ]);
        }
      );
    });
  });
}
