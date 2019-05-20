import {
  getRendererId,
  addGlobalErrorHandler,
  mountDomRenderer
} from '../../../domRenderer';
import { initErrorOverlay, dismissErrorOverlay } from './errorOverlay';

const rendererId = getRendererId();

addGlobalErrorHandler(rendererId);
initErrorOverlay();
mount();

function mount() {
  // Use dynamic import to load updated modules upon hot reloading
  const { rendererConfig, fixtures, decorators } = require('./userDeps');
  mountDomRenderer({
    rendererId,
    rendererConfig,
    fixtures,
    decorators,
    onFixtureChange: dismissErrorOverlay
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
