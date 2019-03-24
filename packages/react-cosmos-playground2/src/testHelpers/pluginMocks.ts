import { MethodHandlers } from 'react-plugin';
import { CoreSpec } from '../plugins/Core/public';
import { cleanup, mockMethodsOf } from './plugin';

afterEach(cleanup);

export function mockCore(methods: Partial<MethodHandlers<CoreSpec>>) {
  mockMethodsOf<CoreSpec>('core', methods);
}
