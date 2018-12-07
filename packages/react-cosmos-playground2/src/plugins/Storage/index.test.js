// @flow

import { registerPlugin, resetPlugins, loadPlugins } from 'react-plugin';
import { register } from '.';

const mockSetItem = jest.fn();

jest.mock('localforage', () => ({
  getItem: key => Promise.resolve(`${key}Value`),
  setItem: (key, value) => {
    mockSetItem(key, value);
    return Promise.resolve('setReturnValue');
  }
}));

afterEach(() => {
  resetPlugins();
  mockSetItem.mockClear();
});

it('gets item from localForage', done => {
  expect.hasAssertions();
  register();

  const { init } = registerPlugin({ name: 'test' });
  init(({ callMethod }) => {
    callMethod('storage.getItem', 'fooKey').then(returnVal => {
      expect(returnVal).toEqual('fooKeyValue');
      done();
    });
  });

  loadPlugins();
});

it('sets item to localForage', done => {
  expect.hasAssertions();
  register();

  const { init } = registerPlugin({ name: 'test' });
  init(({ callMethod }) => {
    callMethod('storage.setItem', 'fooKey', 'fooValue').then(returnVal => {
      expect(mockSetItem).toBeCalledWith('fooKey', 'fooValue');
      expect(returnVal).toEqual('setReturnValue');
      done();
    });
  });

  loadPlugins();
});
