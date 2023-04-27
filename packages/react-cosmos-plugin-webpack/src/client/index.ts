import { mountDomRenderer } from 'react-cosmos-dom';
import { dismissErrorOverlay } from './errorOverlay/index.js';

mount();

async function mount() {
  // Use dynamic import to reload updated modules upon hot reloading
  const { rendererConfig, moduleWrappers } = await import('./userImports.js');
  mountDomRenderer({
    rendererConfig,
    moduleWrappers,
    onErrorReset: dismissErrorOverlay,
  });
}

if ((import.meta as any).webpackHot) {
  (import.meta as any).webpackHot.accept('./userImports.js', () => {
    // If a previous error has been solved, the error overlay auto-closes nicely.
    // If the error persists, however, the overlay will pop up again on its own
    dismissErrorOverlay();
    mount();
  });
}
