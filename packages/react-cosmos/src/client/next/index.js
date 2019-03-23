// @flow

import { getRendererId } from './rendererId';
import { initErrorOverlay, dismissErrorOverlay } from './errorOverlay';
import { initGlobalErrorHandler } from './globalErrorHandler';
import { rendererConfig } from './shared';

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

// $FlowFixMe
if (module.hot) {
  module.hot.accept('./mount', () => {
    // If a previous error has been solved, the error overlay auto-closes nicely.
    // If the error persists, however, the overlay will pop up again on its own
    dismissErrorOverlay();
    mount();
  });
}
