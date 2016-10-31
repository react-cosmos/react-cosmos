import startReactCosmos from 'react-cosmos';
import getConfig from './config';

// eslint-disable-next-line no-undef
const userConfig = require(COSMOS_CONFIG_PATH);
const { proxies, containerQuerySelector } = getConfig(userConfig);

module.exports = startReactCosmos({
  proxies,
  containerQuerySelector,
  // The following constants are replaced at compile-time (through entry-loader)
  // with a map of all components and fixtures read from the disk, matching user
  // conf. Each component or fixture module will have a fn assigned, containing
  // a require call to their exact file path. By the time webpack analyzes this
  // file to build the dependency tree all paths will be embedded. This makes it
  // possible for webpack to know which modules to bundle from the user codebase.
  // eslint-disable-next-line no-undef
  components: COMPONENTS,
  // eslint-disable-next-line no-undef
  fixtures: FIXTURES,
});
