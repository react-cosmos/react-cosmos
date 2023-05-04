export function createViteRendererIndex(userImportsModuleId: string) {
  return `
import { mountDomRenderer } from 'react-cosmos-plugin-vite/dom';

mount();

async function mount() {
  // Use dynamic import to reload updated modules upon hot reloading
  const args = await import('${userImportsModuleId}');
  mountDomRenderer(args);
}

// Fallback for when React Refresh isn't enabled.
// Under normal conditions accepting HMR updates here isn't necessary because
// individual React modules will be hot reloaded by React Refresh.
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    mount();
  });
}\n`;
}
