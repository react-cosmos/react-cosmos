import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import { getUrlParams, resetUrl } from '../../../testHelpers/url';
import {
  cleanup,
  getState,
  getMethodsOf,
  on
} from '../../../testHelpers/plugin2';
import { RouterSpec } from '../spec';
import { register } from '..';

afterEach(() => {
  cleanup();
  resetUrl();
});

function mockSetUrlParams() {
  getMethodsOf<RouterSpec>('router').setUrlParams({ fixturePath: 'zwei.js' });
}

it('sets "router" state', async () => {
  register();
  loadPlugins();
  mockSetUrlParams();

  await wait(() =>
    expect(getState<RouterSpec>('router').urlParams).toEqual({
      fixturePath: 'zwei.js'
    })
  );
});

it('sets URL params', async () => {
  register();
  loadPlugins();
  mockSetUrlParams();

  await wait(() => expect(getUrlParams()).toEqual({ fixturePath: 'zwei.js' }));
});

it('emits "fixtureChange" event', async () => {
  register();

  const fixtureChange = jest.fn();
  on<RouterSpec>('router', { fixtureChange });

  loadPlugins();
  mockSetUrlParams();

  await wait(() =>
    expect(fixtureChange).toBeCalledWith(expect.any(Object), 'zwei.js')
  );
});
