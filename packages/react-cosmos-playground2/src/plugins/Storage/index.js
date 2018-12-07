// @flow

import localForage from 'localforage';
import { registerPlugin } from 'react-plugin';

export function register() {
  const { method } = registerPlugin({ name: 'storage' });

  method('getItem', (context, key: string) => localForage.getItem(key));
  method('setItem', (context, key: string, value: any) =>
    localForage.setItem(key, value)
  );
}
