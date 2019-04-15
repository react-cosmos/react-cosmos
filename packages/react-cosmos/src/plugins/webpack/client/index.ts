import { initErrorOverlay, dismissErrorOverlay } from './errorOverlay';
import { rendererConfig, fixtures, decorators } from './userDeps';

function mount() {
  // Use dynamic import to load updated modules upon hot reloading
  require('../../../domRenderer').mountDomRenderer({
    rendererConfig,
    fixtures,
    decorators,
    onFixtureChange: dismissErrorOverlay
  });
}

initErrorOverlay();
mount();

if ((module as any).hot) {
  (module as any).hot.accept('../../../domRenderer', () => {
    // If a previous error has been solved, the error overlay auto-closes nicely.
    // If the error persists, however, the overlay will pop up again on its own
    dismissErrorOverlay();
    mount();
  });
}
