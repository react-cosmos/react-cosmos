import { PluginContext, createPlugin } from 'react-plugin';
import { CoreSpec } from './public';
import { layout } from './layout';

type Context = PluginContext<CoreSpec>;

const { plug, register } = createPlugin<CoreSpec>({
  name: 'core',
  defaultConfig: {
    projectId: 'defaultProjectId',
    fixturesDir: '__fixtures__',
    fixtureFileSuffix: 'fixture'
  },
  methods: {
    getProjectId,
    getFixtureFileVars
  }
});

plug({ slotName: 'root', render: layout });

export { register };

function getProjectId({ getConfig }: Context) {
  return getConfig().projectId;
}

function getFixtureFileVars({ getConfig }: Context) {
  const { fixturesDir, fixtureFileSuffix } = getConfig();
  return { fixturesDir, fixtureFileSuffix };
}
