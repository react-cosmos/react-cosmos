import { loadPlugins } from 'react-plugin';
import {
  cleanup,
  getMethodsOf,
  mockMethodsOf
} from '../../../testHelpers/plugin';
import { RendererCoreSpec } from '../../RendererCore/public';
import { fakeFetchResponseStatus } from '../testHelpers/fetch';
import { RendererPreviewSpec } from '../public';
import { register } from '..';

afterEach(cleanup);

const rendererPreviewState: RendererPreviewSpec['state'] = {
  urlStatus: 'ok',
  runtimeStatus: 'connected'
};

function registerTestPlugins() {
  fakeFetchResponseStatus(200);
  register();
  mockMethodsOf<RendererCoreSpec>('rendererCore', {
    getWebUrl: () => 'mockRendererUrl'
  });
}

function loadTestPlugins() {
  loadPlugins({
    state: {
      rendererPreview: rendererPreviewState
    }
  });
}

function getRendererPreviewMethods() {
  return getMethodsOf<RendererPreviewSpec>('rendererPreview');
}

it('returns url status', async () => {
  registerTestPlugins();
  loadTestPlugins();

  expect(getRendererPreviewMethods().getUrlStatus()).toBe('ok');
});

it('returns runtime status', async () => {
  registerTestPlugins();
  loadTestPlugins();

  expect(getRendererPreviewMethods().getRuntimeStatus()).toBe('connected');
});
