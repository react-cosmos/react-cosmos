export function createViteRendererIndex(userImportsModuleId: string) {
  return `
import { mountDomRenderer } from 'react-cosmos-plugin-vite/dom';

mount();

async function mount() {
  // Use dynamic import to reload updated modules upon hot reloading
  const args = await import('${userImportsModuleId}');
  mountDomRenderer(args);
}

// Accept updates that reach this module, which re-runs it and mounts the
// renderer with fresh user imports. This happens when a fixture or decorator
// isn't hot reloaded on its own by React Refresh. Mounting from an accept
// callback isn't needed, and it would use the stale imports of the previous
// module instance.
if (import.meta.hot) {
  import.meta.hot.accept();
}\n`;
}
