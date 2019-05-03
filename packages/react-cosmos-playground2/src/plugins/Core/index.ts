import { PluginContext, createPlugin } from 'react-plugin';
import { StorageSpec } from '../Storage/public';
import { CoreSpec } from './public';
import { Layout } from './Layout';

type Context = PluginContext<CoreSpec>;

const { onLoad, plug, register } = createPlugin<CoreSpec>({
  name: 'core',
  defaultConfig: {
    projectId: 'defaultProjectId',
    fixturesDir: '__fixtures__',
    fixtureFileSuffix: 'fixture',
    devServerOn: false,
    webRendererUrl: null
  },
  initialState: {
    storageCacheReady: false
  },
  methods: {
    getFixtureFileVars,
    isDevServerOn,
    getWebRendererUrl
  }
});

onLoad(context => {
  const storage = context.getMethodsOf<StorageSpec>('storage');
  storage.loadCache(context.getConfig().projectId).then(() => {
    context.setState({ storageCacheReady: true });
  });
});

plug({
  slotName: 'root',
  render: Layout,
  getProps: context => ({
    storageCacheReady: context.getState().storageCacheReady
  })
});

export { register };

function getFixtureFileVars({ getConfig }: Context) {
  const { fixturesDir, fixtureFileSuffix } = getConfig();
  return { fixturesDir, fixtureFileSuffix };
}

function isDevServerOn({ getConfig }: Context) {
  return getConfig().devServerOn;
}

function getWebRendererUrl({ getConfig }: Context) {
  return getConfig().webRendererUrl;
}
