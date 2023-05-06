import { loadPlugins, resetPlugins } from 'react-plugin';
import { register } from '..';
import { getRendererCoreMethods } from '../../../testHelpers/pluginMocks.js';
import { RendererCoreSpec } from '../spec.js';

beforeEach(register);

afterEach(resetPlugins);

const rendererCoreConfig: RendererCoreSpec['config'] = {
  fixtures: {},
  webRendererUrl: 'mockWebUrl',
};

it('returns web renderer URL', () => {
  loadPlugins({
    config: {
      rendererCore: rendererCoreConfig,
    },
  });
  expect(getRendererCoreMethods().getWebRendererUrl()).toBe('mockWebUrl');
});
