import { PluginContext, createPlugin } from 'react-plugin';
import { CoreSpec } from './public';

type Context = PluginContext<CoreSpec>;

const { register } = createPlugin<CoreSpec>({
  name: 'core',
  defaultConfig: {
    projectId: 'defaultProjectId',
    fixturesDir: '__fixtures__',
    fixtureFileSuffix: 'fixture',
    devServerOn: false,
    webRendererUrl: null
  },
  methods: {
    getProjectId,
    getFixtureFileVars,
    isDevServerOn,
    getWebRendererUrl
  }
});

export { register };

function getProjectId({ getConfig }: Context) {
  return getConfig().projectId;
}

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
