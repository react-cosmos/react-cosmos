import { wait } from '@testing-library/react';
import { loadPlugins, resetPlugins } from 'react-plugin';
import { resetUrl, pushUrlParams } from '../../../testHelpers/url';
import { getRouterMethods } from '../../../testHelpers/pluginMocks';
import { register } from '..';

afterEach(() => {
  resetPlugins();
  resetUrl();
});

it('returns true', async () => {
  register();

  pushUrlParams({ fullScreen: 'true' });
  loadPlugins();

  await wait(() => expect(getRouterMethods().isFullScreen()).toEqual(true));
});

it('returns false', async () => {
  register();
  loadPlugins();

  await wait(() => expect(getRouterMethods().isFullScreen()).toBe(false));
});
