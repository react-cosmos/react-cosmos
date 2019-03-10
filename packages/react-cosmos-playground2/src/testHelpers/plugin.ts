import * as rtl from 'react-testing-library';
import {
  PluginSpec,
  PlugArgs,
  MethodHandlers,
  EventHandlers,
  resetPlugins,
  createPlugin,
  getPluginContext
} from 'react-plugin';

export function cleanup() {
  rtl.cleanup();
  resetPlugins();
}

export function getMethodsOf<Spec extends PluginSpec>(
  pluginName: Spec['name']
) {
  const name = getNewPluginName();
  createPlugin({ name }).register();

  return getPluginContext(name).getMethodsOf<Spec>(pluginName);
}

export function on<Spec extends PluginSpec>(
  pluginName: Spec['name'],
  handlers: EventHandlers<any, Spec>
) {
  const name = getNewPluginName();
  const testPlugin = createPlugin({ name });
  testPlugin.on<Spec>(pluginName, handlers);
  testPlugin.register();
}

export function mockMethodsOf<Spec extends PluginSpec>(
  pluginName: Spec['name'],
  methods: Partial<MethodHandlers<Spec>>
) {
  createPlugin<any>({ name: pluginName, methods }).register();
}

export function mockPlug(plug: PlugArgs<any, {}>) {
  const name = getNewPluginName();
  const testPlugin = createPlugin({ name });
  testPlugin.plug(plug);
  testPlugin.register();
}

let pluginId: number = 0;

function getNewPluginName() {
  return `test${pluginId++}`;
}
