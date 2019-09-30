import { PluginContext, createPlugin } from 'react-plugin';
import { CoreSpec } from './public';

type CoreContext = PluginContext<CoreSpec>;

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

function getProjectId({ getConfig }: CoreContext) {
  return getConfig().projectId;
}

function getFixtureFileVars({ getConfig }: CoreContext) {
  const { fixturesDir, fixtureFileSuffix } = getConfig();
  return { fixturesDir, fixtureFileSuffix };
}

function isDevServerOn({ getConfig }: CoreContext) {
  return getConfig().devServerOn;
}

function getWebRendererUrl({ getConfig }: CoreContext) {
  return getConfig().webRendererUrl;
}
