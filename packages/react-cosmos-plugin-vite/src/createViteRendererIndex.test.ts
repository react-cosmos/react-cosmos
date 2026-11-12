import { createViteRendererIndex } from './createViteRendererIndex.js';

type AcceptCallback = (newModule: unknown) => void;

// Runs the renderer index like Vite's HMR client runs a module that accepts
// its own updates. Each run is a new module instance with its own imports.
function createHotRenderer() {
  const mountDomRenderer = vi.fn();
  let acceptCallbacks: AcceptCallback[] = [];

  const source = createViteRendererIndex('virtual:cosmos-imports')
    .replace(/^import .+$/m, '')
    .replaceAll('import.meta.hot', 'hot')
    .replaceAll('import(', 'importModule(');
  const runModule = new Function(
    'mountDomRenderer',
    'importModule',
    'hot',
    source
  );

  async function load(userImports: object) {
    // Callbacks are tied to the module instance that registered them
    acceptCallbacks = [];
    const hot = {
      accept: (cb?: AcceptCallback) => cb && acceptCallbacks.push(cb),
    };
    runModule(mountDomRenderer, async () => userImports, hot);
    await flushPromises();
  }

  // Vite runs the updated module first, and only calls the accept callbacks of
  // the previous instance once every update in the batch is fetched. A slow
  // update in the same batch (like a CSS file that depends on source files)
  // delays those callbacks until after the new instance has mounted.
  async function hotUpdate(userImports: object) {
    const prevCallbacks = acceptCallbacks;
    await load(userImports);
    prevCallbacks.forEach(cb => cb({}));
    await flushPromises();
  }

  return { mountDomRenderer, load, hotUpdate };
}

function flushPromises() {
  return new Promise(resolve => setTimeout(resolve));
}

it('mounts renderer with user imports', async () => {
  const { mountDomRenderer, load } = createHotRenderer();
  const userImports = { version: 1 };
  await load(userImports);
  expect(mountDomRenderer).toHaveBeenLastCalledWith(userImports);
});

it('mounts renderer with latest user imports after hot update', async () => {
  const { mountDomRenderer, load, hotUpdate } = createHotRenderer();
  await load({ version: 1 });

  const updatedImports = { version: 2 };
  await hotUpdate(updatedImports);
  expect(mountDomRenderer).toHaveBeenLastCalledWith(updatedImports);

  const updatedImports2 = { version: 3 };
  await hotUpdate(updatedImports2);
  expect(mountDomRenderer).toHaveBeenLastCalledWith(updatedImports2);
});
