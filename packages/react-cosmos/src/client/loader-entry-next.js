// @flow
/* global process */

if (process.env.NODE_ENV === 'development') {
  require('./react-error-overlay-next');
}

function mount() {
  // Use modules are reloaded on every webpack hot reload event
  require('./mount-next').mount();
}

mount();

// $FlowFixMe
if (module.hot) {
  module.hot.accept('./mount-next', mount);
}
