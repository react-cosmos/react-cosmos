export function createViteRendererIndex(userDepsModuleId) {
  return `
import { mountDomRenderer } from 'react-cosmos-dom';

mount();

async function mount() {
  // Use dynamic import to load updated modules upon hot reloading
  const args = await import('${userDepsModuleId}');
  mountDomRenderer(args);
}

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    mount();
  });
}\n`;
}
