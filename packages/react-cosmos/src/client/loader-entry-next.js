// @flow

import { initErrorOverlay, dismissErrorOverlay } from './errorOverlay-next';

function mount() {
  // Use dynamic import to load updated modules upon hot reloading
  require('./mount-next').mount();
}

initErrorOverlay();
mount();

// $FlowFixMe
if (module.hot) {
  module.hot.accept('./mount-next', () => {
    // If a previous error has been solved, the error overlay auto-closes nicely.
    // If the error persists, however, the overlay will pop up again on its own.
    dismissErrorOverlay();
    mount();
  });
}
