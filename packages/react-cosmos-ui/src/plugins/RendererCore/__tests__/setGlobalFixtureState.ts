import { waitFor } from '@testing-library/dom';
import { loadPlugins, resetPlugins } from 'react-plugin';
import {
  getRendererCoreMethods,
  getRouterContext,
  mockCore,
  mockNotifications,
  mockRouter,
  onRendererCore,
} from '../../../testHelpers/pluginMocks.js';
import { register } from '../index.js';
import { mockRendererReady } from '../testHelpers/index.js';

beforeEach(register);

afterEach(resetPlugins);

it('sets fixture state when setting global fixture state', async () => {
  mockCore();
  mockRouter({
    getSelectedFixtureId: () => ({ path: 'zwei.js' }),
  });
  mockNotifications();

  loadPlugins();

  const { request } = onRendererCore();
  mockRendererReady('mockRendererId');

  await waitFor(() =>
    expect(request).toBeCalledWith(expect.any(Object), {
      type: 'selectFixture',
      payload: {
        rendererId: 'mockRendererId',
        fixtureId: { path: 'zwei.js' },
        fixtureState: {},
      },
    })
  );

  const methods = getRendererCoreMethods();
  methods.setGlobalFixtureState('foo', 'bar');

  await waitFor(() =>
    expect(request).toBeCalledWith(expect.any(Object), {
      type: 'setFixtureState',
      payload: {
        rendererId: 'mockRendererId',
        fixtureId: { path: 'zwei.js' },
        fixtureState: {
          foo: 'bar',
        },
      },
    })
  );

  methods.setGlobalFixtureState('baz', 'qux');

  await waitFor(() =>
    expect(request).toBeCalledWith(expect.any(Object), {
      type: 'setFixtureState',
      payload: {
        rendererId: 'mockRendererId',
        fixtureId: { path: 'zwei.js' },
        fixtureState: {
          foo: 'bar',
          baz: 'qux',
        },
      },
    })
  );
});

it('uses global fixture state when renderer connects', async () => {
  mockCore();
  mockRouter({
    getSelectedFixtureId: () => ({ path: 'zwei.js' }),
  });
  mockNotifications();

  loadPlugins();

  const methods = getRendererCoreMethods();
  methods.setGlobalFixtureState('foo', 'bar');

  const { request } = onRendererCore();
  mockRendererReady('mockRendererId');

  await waitFor(() =>
    expect(request).toBeCalledWith(expect.any(Object), {
      type: 'selectFixture',
      payload: {
        rendererId: 'mockRendererId',
        fixtureId: { path: 'zwei.js' },
        fixtureState: {
          foo: 'bar',
        },
      },
    })
  );
});

it('uses global fixture state when renderer connects with fixture selected', async () => {
  mockCore();
  mockRouter({
    getSelectedFixtureId: () => ({ path: 'zwei.js' }),
  });
  mockNotifications();

  loadPlugins();

  const methods = getRendererCoreMethods();
  methods.setGlobalFixtureState('foo', 'bar');

  const { request } = onRendererCore();
  mockRendererReady('mockRendererId', { path: 'zwei.js' });

  await waitFor(() =>
    expect(request).toBeCalledWith(expect.any(Object), {
      type: 'setFixtureState',
      payload: {
        rendererId: 'mockRendererId',
        fixtureId: { path: 'zwei.js' },
        fixtureState: {
          foo: 'bar',
        },
      },
    })
  );
});

it('uses global fixture state on fixture select', async () => {
  mockCore();
  mockRouter({
    getSelectedFixtureId: () => null,
  });
  mockNotifications();

  loadPlugins();

  const methods = getRendererCoreMethods();
  methods.setGlobalFixtureState('foo', 'bar');

  const { request } = onRendererCore();
  mockRendererReady('mockRendererId');
  getRouterContext().emit('fixtureSelect', { path: 'zwei.js' });

  await waitFor(() =>
    expect(request).toBeCalledWith(expect.any(Object), {
      type: 'selectFixture',
      payload: {
        rendererId: 'mockRendererId',
        fixtureId: { path: 'zwei.js' },
        fixtureState: {
          foo: 'bar',
        },
      },
    })
  );
});

it('uses global fixture state on fixture reselect', async () => {
  mockCore();
  mockRouter({
    getSelectedFixtureId: () => ({ path: 'zwei.js' }),
  });
  mockNotifications();

  const { request } = onRendererCore();

  loadPlugins();

  const methods = getRendererCoreMethods();
  methods.setGlobalFixtureState('foo', 'bar');

  mockRendererReady('mockRendererId');
  getRouterContext().emit('fixtureReselect', { path: 'zwei.js' });

  await waitFor(() =>
    expect(request).toBeCalledWith(expect.any(Object), {
      type: 'selectFixture',
      payload: {
        rendererId: 'mockRendererId',
        fixtureId: { path: 'zwei.js' },
        fixtureState: {
          foo: 'bar',
        },
      },
    })
  );
});
