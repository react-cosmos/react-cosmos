import { waitFor } from '@testing-library/dom';
import { loadPlugins, resetPlugins } from 'react-plugin';
import {
  getRendererCoreMethods,
  getRouterContext,
  mockNotifications,
  mockRouter,
  onRendererCore,
} from '../../../testHelpers/pluginMocks.js';
import { register } from '../index.js';
import { mockRendererReady } from '../testHelpers/index.js';

beforeEach(register);

afterEach(resetPlugins);

it('posts "selectFixture" renderer request with extended fixture state', async () => {
  mockRouter({
    // This fails, this needs to be covered, too
    // getSelectedFixtureId: () => ({ path: 'zwei.js' }),
    getSelectedFixtureId: () => null,
  });
  mockNotifications();

  const { request } = onRendererCore();

  loadPlugins();

  const methods = getRendererCoreMethods();
  const cleanUp = methods.extendInitialFixtureState(prevState => ({
    ...prevState,
    foo: 'bar',
  }));

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

  cleanUp();
  // mockRendererReady('mockRendererId');
  getRouterContext().emit('fixtureSelect', { path: 'zwei.js' });

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
});

it('posts "selectFixture" renderer request with extended fixture state on reselect', async () => {
  mockRouter({
    // This fails, this needs to be covered, too
    getSelectedFixtureId: () => ({ path: 'zwei.js' }),
    // getSelectedFixtureId: () => null,
  });
  mockNotifications();

  const { request } = onRendererCore();

  loadPlugins();

  const methods = getRendererCoreMethods();
  const cleanUp = methods.extendInitialFixtureState(prevState => ({
    ...prevState,
    foo: 'bar',
  }));

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

  cleanUp();
  // mockRendererReady('mockRendererId');
  getRouterContext().emit('fixtureReselect', { path: 'zwei.js' });

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
});
