import { rendererConfig } from '../shared';
import { getRendererId } from './rendererId';
import { initErrorOverlay, dismissErrorOverlay } from './errorOverlay';
import { initGlobalErrorHandler } from './globalErrorHandler';

const rendererId = getRendererId();

function mount() {
  // Use dynamic import to load updated modules upon hot reloading
  require('./mount').mount({
    rendererId,
    rendererConfig,
    onFixtureChange: dismissErrorOverlay
  });
}

initGlobalErrorHandler(rendererId);
initErrorOverlay();
mount();

if ((module as any).hot) {
  (module as any).hot.accept('./mount', () => {
    // If a previous error has been solved, the error overlay auto-closes nicely.
    // If the error persists, however, the overlay will pop up again on its own
    dismissErrorOverlay();
    mount();
  });
}

// Hook for Cypress to simulate a HMR update
(window as any).__fakeHotReload = mount;
