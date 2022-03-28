import {
  createPlugin,
  getPluginContext,
  PlugComponentType,
  PluginEventHandlers,
  PluginMethodHandlers,
  PluginSpec,
  PluginWithEvents,
  PluginWithMethods,
} from 'react-plugin';

export function getMethodsOf<Spec extends PluginSpec>(
  pluginName: Spec['name']
) {
  const name = getNewPluginName();
  createPlugin({ name }).register();

  return getPluginContext(name).getMethodsOf<Spec>(pluginName);
}

export function on<Spec extends PluginWithEvents>(
  pluginName: Spec['name'],
  handlers: PluginEventHandlers<any, Spec>
) {
  const name = getNewPluginName();
  const testPlugin = createPlugin({ name });
  testPlugin.on<Spec>(pluginName, handlers);
  testPlugin.register();
}

export function mockMethodsOf<Spec extends PluginWithMethods>(
  pluginName: Spec['name'],
  methods: PluginMethodHandlers<Spec>
) {
  createPlugin<any>({ name: pluginName, methods }).register();
}

export function mockPlug<SlotProps extends {} = {}>(
  slotName: string,
  component: PlugComponentType<any, any>
) {
  const name = getNewPluginName();
  const testPlugin = createPlugin({ name });
  testPlugin.plug<SlotProps>(slotName, component);
  testPlugin.register();
}

let pluginId: number = 0;

function getNewPluginName() {
  return `test${pluginId++}`;
}
