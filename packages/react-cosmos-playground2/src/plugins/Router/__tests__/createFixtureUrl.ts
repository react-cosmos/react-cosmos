import qs from 'query-string';
import { loadPlugins } from 'react-plugin';
import { cleanup, getMethodsOf } from '../../../testHelpers/plugin';
import { resetUrl } from '../../../testHelpers/url';
import { RouterSpec } from '../public';
import { register } from '..';

afterEach(() => {
  cleanup();
  resetUrl();
});

const fixtureId = { path: 'zwei.js', name: null };

function getRouterMethods() {
  return getMethodsOf<RouterSpec>('router');
}

it('creates fixture URL', async () => {
  register();
  loadPlugins();
  const router = getRouterMethods();

  const url = `?${qs.stringify({ fixtureId: JSON.stringify(fixtureId) })}`;
  expect(router.createFixtureUrl(fixtureId)).toBe(url);
});
