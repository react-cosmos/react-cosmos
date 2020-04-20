import {
  PluginSpec,
  PlugComponentType,
  MethodHandlers,
  EventHandlers,
  createPlugin,
  getPluginContext,
} from 'react-plugin';

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
  methods: MethodHandlers<Spec>
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
