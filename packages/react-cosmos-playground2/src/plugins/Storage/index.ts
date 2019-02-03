import * as localForage from 'localforage';
import { createPlugin } from 'react-plugin';
import { StorageSpec } from './spec';

const { register } = createPlugin<StorageSpec>({
  name: 'storage',
  methods: {
    getItem: (context, key: string) => localForage.getItem(key),
    setItem: (context, key: string, value: any) =>
      localForage.setItem(key, value)
  }
});

export { register };
