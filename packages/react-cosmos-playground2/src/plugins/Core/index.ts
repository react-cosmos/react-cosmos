import { IPluginContext, createPlugin } from 'react-plugin';
import { CoreSpec } from './spec';
import { layout } from './layout';

type CoreContext = IPluginContext<CoreSpec>;

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

function getProjectId({ getConfig }: CoreContext) {
  return getConfig().projectId;
}

function getFixtureFileVars({ getConfig }: CoreContext) {
  const { fixturesDir, fixtureFileSuffix } = getConfig();
  return { fixturesDir, fixtureFileSuffix };
}
