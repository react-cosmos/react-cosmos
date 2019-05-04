import { PluginSpec, MethodHandlers } from 'react-plugin';
import { StorageSpec } from '../plugins/Storage/public';
import { RouterSpec } from '../plugins/Router/public';
import { CoreSpec } from '../plugins/Core/public';
import { RendererCoreSpec } from '../plugins/RendererCore/public';
import { mockMethodsOf } from './plugin';

type MethodsOf<Spec extends PluginSpec> = Partial<MethodHandlers<Spec>>;

export function mockStorage(methods: MethodsOf<StorageSpec>) {
  mockMethodsOf<StorageSpec>('storage', methods);
}

export function mockRouter(methods: MethodsOf<RouterSpec>) {
  mockMethodsOf<RouterSpec>('router', methods);
}

export function mockCore(methods: MethodsOf<CoreSpec>) {
  mockMethodsOf<CoreSpec>('core', methods);
}

export function mockRendererCore(methods: MethodsOf<RendererCoreSpec>) {
  mockMethodsOf<RendererCoreSpec>('rendererCore', methods);
}
