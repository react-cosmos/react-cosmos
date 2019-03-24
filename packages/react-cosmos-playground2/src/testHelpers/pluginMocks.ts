import { MethodHandlers } from 'react-plugin';
import { RouterSpec } from '../plugins/Router/public';
import { CoreSpec } from '../plugins/Core/public';
import { cleanup, mockMethodsOf } from './plugin';

afterEach(cleanup);

export function mockRouter(methods: Partial<MethodHandlers<RouterSpec>>) {
  mockMethodsOf<RouterSpec>('router', methods);
}

export function mockCore(methods: Partial<MethodHandlers<CoreSpec>>) {
  mockMethodsOf<CoreSpec>('core', methods);
}
