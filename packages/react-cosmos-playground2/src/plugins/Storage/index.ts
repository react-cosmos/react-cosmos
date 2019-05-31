import * as localForage from 'localforage';
import { PluginContext, createPlugin } from 'react-plugin';
import { StorageSpec } from './public';

type Context = PluginContext<StorageSpec>;

const { register } = createPlugin<StorageSpec>({
  name: 'storage',
  initialState: {
    cache: null
  },
  methods: {
    loadCache,
    getItem,
    setItem
  }
});

export { register };

async function loadCache(context: Context, projectId: string) {
  const items: {} = (await localForage.getItem(getProjectKey(projectId))) || {};
  context.setState({ cache: { projectId, items } });
}

function getItem(context: Context, key: string) {
  const { cache } = context.getState();
  if (!cache) {
    throw new Error(`Can't retrieve item "${key}" before loading storage`);
  }

  return cache.items[key];
}

function setItem(context: Context, key: string, value: any) {
  const { cache } = context.getState();
  if (!cache) {
    throw new Error(`Can't set item "${key}" before loading storage`);
  }

  const { projectId, items } = cache;
  const newItems = { ...items, [key]: value };
  context.setState({ cache: { projectId, items: newItems } });
  localForage.setItem(getProjectKey(projectId), newItems);
}

function getProjectKey(projectId: string) {
  return `cosmos-${projectId}`;
}
