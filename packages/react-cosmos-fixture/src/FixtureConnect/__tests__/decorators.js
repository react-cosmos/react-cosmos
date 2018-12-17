// @flow

import { uuid } from 'react-cosmos-shared2/util';
import { mockConnect as mockPostMessage } from '../testHelpers/postMessage';
import { mockConnect as mockWebSockets } from '../testHelpers/webSockets';
import { mount } from '../testHelpers/mount';

const rendererId = uuid();
const fixtures = {
  first: 'First',
  second: 'Second'
};
const decorators = {
  'foo-path': ({ children }) => ['Decorated by foo', children],
  'foo-path/bar-path': ({ children }) => ['Decorated by bar', children],
  'foo-path/baz-path': ({ children }) => ['Decorated by baz', children]
};

tests(mockPostMessage);
tests(mockWebSockets);

function tests(mockConnect) {
  it('renders selected fixture inside decorator', async () => {
    await mockConnect(async ({ getElement, selectFixture }) => {
      await mount(
        getElement({ rendererId, fixtures, decorators }),
        async renderer => {
          await selectFixture({
            rendererId,
            fixturePath: 'first',
            fixtureState: null
          });

          expect(renderer.toJSON()).toEqual([
            'Decorated by foo',
            'Decorated by bar',
            'Decorated by baz',
            'First'
          ]);
        }
      );
    });
  });
}
