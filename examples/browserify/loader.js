// Replace with 'react-cosmos' in real life
import { startLoader } from '../../packages/react-cosmos';
import { components, fixtures } from './prepare-modules';

module.exports = startLoader({
  proxies: [],
  components,
  fixtures,
});
