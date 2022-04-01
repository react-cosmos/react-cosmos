import { omit } from 'lodash';
import { createPlugin, PluginContext } from 'react-plugin';
import { registerPlaygroundShortcuts } from '../../../renderer/registerPlaygroundShortcuts.js';
import { Commands, CoreSpec } from './spec.js';

type CoreContext = PluginContext<CoreSpec>;

const { onLoad, register } = createPlugin<CoreSpec>({
  name: 'core',
  initialState: {
    commands: {},
  },
  defaultConfig: {
    projectId: 'defaultProjectId',
    fixturesDir: '__fixtures__',
    fixtureFileSuffix: 'fixture',
    devServerOn: false,
    webRendererUrl: null,
  },
  methods: {
    registerCommands,
    runCommand,
    getProjectId,
    getFixtureFileVars,
    isDevServerOn,
    getWebRendererUrl,
  },
});

register();

onLoad(pluginContext =>
  registerPlaygroundShortcuts(command => runCommand(pluginContext, command))
);

onLoad(pluginContext => {
  const { projectId } = pluginContext.getConfig();
  document.title = projectId;
});

function registerCommands(context: CoreContext, commands: Commands) {
  context.setState(prevState => {
    const existingCommandNames = Object.keys(prevState.commands);
    Object.keys(commands).forEach(commandName => {
      if (existingCommandNames.indexOf(commandName) !== -1)
        throw new Error(`Command "${commandName} already registered`);
    });
    return {
      ...prevState,
      commands: { ...prevState.commands, ...commands },
    };
  });
  return () =>
    context.setState(prevState => ({
      ...prevState,
      commands: omit(prevState.commands, ...Object.keys(commands)),
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
