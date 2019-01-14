// @flow

import { initErrorOverlay, dismissErrorOverlay } from './errorOverlay';

function mount() {
  // Use dynamic import to load updated modules upon hot reloading
  require('./mount').mount({
    onFixtureChange: dismissErrorOverlay
  });
}

initErrorOverlay();
mount();

// $FlowFixMe
if (module.hot) {
  module.hot.accept('./mount', () => {
    // If a previous error has been solved, the error overlay auto-closes nicely.
    // If the error persists, however, the overlay will pop up again on its own.
    dismissErrorOverlay();
    mount();
  });
}
