// Replace with 'react-cosmos' in real life
import { startLoader } from '../../../packages/react-cosmos';
import createReduxProxy from '../redux-proxy';
import { components, fixtures } from './prepare-modules';

module.exports = startLoader({
  proxies: [createReduxProxy],
  components,
  fixtures,
});
