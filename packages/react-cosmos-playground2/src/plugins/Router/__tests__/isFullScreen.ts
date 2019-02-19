import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import { resetUrl, pushUrlParams } from '../../../testHelpers/url';
import { cleanup, getMethodsOf } from '../../../testHelpers/plugin';
import { RouterSpec } from '../public';
import { register } from '..';

afterEach(() => {
  cleanup();
  resetUrl();
});

function getRouterMethods() {
  return getMethodsOf<RouterSpec>('router');
}

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
