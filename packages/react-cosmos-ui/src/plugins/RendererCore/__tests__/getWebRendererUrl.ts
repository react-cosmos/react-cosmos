import { loadPlugins, resetPlugins } from 'react-plugin';
import {
  getRendererCoreMethods,
  mockCore,
} from '../../../testHelpers/pluginMocks.js';
import { register } from '../index.js';
import { RendererCoreSpec } from '../spec.js';

beforeEach(register);

afterEach(resetPlugins);

const rendererCoreConfig: RendererCoreSpec['config'] = {
  fixtures: {},
  rendererUrl: '/mock-renderer.html',
};

it('returns web renderer URL', () => {
  mockCore();
  loadPlugins({
    config: {
      rendererCore: rendererCoreConfig,
    },
  });
  expect(getRendererCoreMethods().getRendererUrl()).toBe('/mock-renderer.html');
});
