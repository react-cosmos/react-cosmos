export function createViteRendererIndex(userDepsModuleId: string) {
  return `
import { mountDomRenderer } from 'react-cosmos-dom';

mount();

async function mount() {
  // Use dynamic import to reload updated modules upon hot reloading
  const args = await import('${userDepsModuleId}');
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
