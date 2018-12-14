// @flow

import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import { cleanup, mockEvent, mockInitCall } from '../../../testHelpers/plugin';
import { register } from '..';

afterEach(cleanup);

it('posts "requestFixtureList" renderer request', async () => {
  register();

  const handleRendererRequest = jest.fn();
  mockEvent('renderer.request', handleRendererRequest);

  mockInitCall('renderer.requestFixtureList');

  loadPlugins();

  await wait(() =>
    expect(handleRendererRequest).toBeCalledWith(expect.any(Object), {
      type: 'requestFixtureList'
    })
  );
});
