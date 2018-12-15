// @flow

import localForage from 'localforage';
import { registerPlugin } from 'react-plugin';

export type Storage = {
  getItem: (key: string) => Promise<any>,
  setItem: (key: string, value: any) => Promise<void>
};

export function register() {
  const { method } = registerPlugin({ name: 'storage' });

  method('getItem', (context, key: string) => localForage.getItem(key));
  method('setItem', (context, key: string, value: any) =>
    localForage.setItem(key, value)
  );
}
