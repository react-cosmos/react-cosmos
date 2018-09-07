// @flow

import './react-devtools-hook';

function mount() {
  // Use modules are reloaded on every webpack hot reload event
  require('./mount-next').mount();
}

mount();

// $FlowFixMe
if (module.hot) {
  module.hot.accept('./mount-next', mount);
}
