import { mountDomRenderer } from '../../../domRenderer';
import { dismissErrorOverlay } from './errorOverlay';
import './hmrErrorHandler';

mount();

function mount() {
  // Use dynamic import to load updated modules upon hot reloading
  const { rendererConfig, fixtures, decorators } = require('./userDeps');
  mountDomRenderer({
    rendererConfig,
    fixtures,
    decorators,
    onErrorReset: dismissErrorOverlay
  });
}

if ((module as any).hot) {
  (module as any).hot.accept('./userDeps', () => {
    // If a previous error has been solved, the error overlay auto-closes nicely.
    // If the error persists, however, the overlay will pop up again on its own
    dismissErrorOverlay();
    mount();
  });
}
