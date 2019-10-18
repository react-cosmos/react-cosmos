import { omit } from 'lodash';
import { createPlugin, PluginContext } from 'react-plugin';
import { CoreSpec } from './public';

type CoreContext = PluginContext<CoreSpec>;

const { register } = createPlugin<CoreSpec>({
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

function registerCommands(
  { setState }: CoreContext,
  commands: Record<string, () => unknown>
) {
  setState(prevState => {
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
    setState(prevState => ({
      ...prevState,
      commands: omit(prevState.commands, ...Object.keys(commands))
    }));
}

function runCommand({ getState }: CoreContext, name: string) {
  const { commands } = getState();
  if (!commands[name]) throw new Error(`Command "${name}" does not exist`);
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
