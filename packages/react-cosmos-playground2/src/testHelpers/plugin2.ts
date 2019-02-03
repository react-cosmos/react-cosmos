import {
  IPluginSpec,
  IPlugArgs,
  MethodHandlers,
  EventHandlers,
  resetPlugins,
  createPlugin,
  getPluginContext
} from 'react-plugin';

export function cleanup() {
  resetPlugins();
}

export function getState<PluginSpec extends IPluginSpec>(
  pluginName: PluginSpec['name']
) {
  return getPluginContext<PluginSpec>(pluginName).getState();
}

export function getMethodsOf<PluginSpec extends IPluginSpec>(
  pluginName: PluginSpec['name']
) {
  const name = getNewPluginName();
  createPlugin({ name }).register();

  return getPluginContext(name).getMethodsOf<PluginSpec>(pluginName);
}

export function on<PluginSpec extends IPluginSpec>(
  pluginName: PluginSpec['name'],
  handlers: EventHandlers<any, PluginSpec>
) {
  const name = getNewPluginName();
  const testPlugin = createPlugin({ name });
  testPlugin.on<PluginSpec>(pluginName, handlers);
  testPlugin.register();
}

export function mockMethods<PluginSpec extends IPluginSpec>(
  pluginName: PluginSpec['name'],
  methods: MethodHandlers<PluginSpec>
) {
  createPlugin<any>({ name: pluginName, methods }).register();
}

export function mockPlug(plug: IPlugArgs<any, {}>) {
  const name = getNewPluginName();
  const testPlugin = createPlugin({ name });
  testPlugin.plug(plug);
  testPlugin.register();
}

let pluginId: number = 0;

function getNewPluginName() {
  return `test${pluginId++}`;
}
