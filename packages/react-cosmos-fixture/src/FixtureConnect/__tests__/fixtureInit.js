// @flow

import { uuid } from '../../shared/uuid';
import { mockConnect as mockPostMessage } from '../jestHelpers/postMessage';
import { mockConnect as mockWebSockets } from '../jestHelpers/webSockets';
import { mount } from '../jestHelpers/mount';

const rendererId = uuid();
const fixtures = {
  first: 'First',
  second: 'Second'
};

tests(mockPostMessage);
tests(mockWebSockets);

function tests(mockConnect) {
  it('renders initial fixture', async () => {
    await mockConnect(async ({ getElement }) => {
      await mount(
        getElement({ rendererId, fixtures, initFixturePath: 'second' }),
        async renderer => {
          expect(renderer.toJSON()).toBe('Second');
        }
      );
    });
  });
}
