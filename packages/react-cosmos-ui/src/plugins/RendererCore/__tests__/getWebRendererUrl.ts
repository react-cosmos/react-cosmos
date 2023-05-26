import { loadPlugins, resetPlugins } from 'react-plugin';
import { register } from '..';
import { getRendererCoreMethods } from '../../../testHelpers/pluginMocks.js';
import { RendererCoreSpec } from '../spec.js';

beforeEach(register);

afterEach(resetPlugins);

const rendererCoreConfig: RendererCoreSpec['config'] = {
  fixtures: {},
  rendererUrl: '/mock-renderer.html',
};

it('returns web renderer URL', () => {
  loadPlugins({
    config: {
      rendererCore: rendererCoreConfig,
    },
  });
  expect(getRendererCoreMethods().getRendererUrl()).toBe('/mock-renderer.html');
});
