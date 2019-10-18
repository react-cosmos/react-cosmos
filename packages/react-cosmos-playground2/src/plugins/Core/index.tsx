import { omit } from 'lodash';
import { registerShortcuts } from 'react-cosmos-shared2/playground';
import { createPlugin, PluginContext } from 'react-plugin';
import { Commands, CoreSpec } from './public';

type CoreContext = PluginContext<CoreSpec>;

const { onLoad, register } = createPlugin<CoreSpec>({
  name: 'core',
  initialState: {
    commands: {}
  },
  defaultConfig: {
    projectId: 'defaultProjectId',
    fixturesDir: '__fixtures__',
    fixtureFileSuffix: 'fixture',
    devServerOn: false,
    webRendererUrl: null
  },
  methods: {
    registerCommands,
    runCommand,
    getProjectId,
    getFixtureFileVars,
    isDevServerOn,
    getWebRendererUrl
  }
});

export { register };

onLoad(pluginContext =>
  registerShortcuts(command => runCommand(pluginContext, command))
);

function registerCommands(context: CoreContext, commands: Commands) {
  context.setState(prevState => {
    const existingCommandNames = Object.keys(prevState.commands);
    Object.keys(commands).forEach(commandName => {
      if (existingCommandNames.indexOf(commandName) !== -1)
        throw new Error(`Command "${commandName} already registered`);
    });
    return {
      ...prevState,
      commands: { ...prevState.commands, ...commands }
    };
  });
  return () =>
    context.setState(prevState => ({
      ...prevState,
      commands: omit(prevState.commands, ...Object.keys(commands))
    }));
}

function runCommand(context: CoreContext, name: string) {
  const { commands } = context.getState();
  if (!commands[name])
    return console.warn(`Command "${name}" is not available`);
  commands[name]();
}

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
