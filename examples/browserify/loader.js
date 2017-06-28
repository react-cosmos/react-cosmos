// Replace with 'react-cosmos-loader' in real life
import mountLoader from '../../packages/react-cosmos-loader';
import { components, fixtures } from './prepare-modules';

module.exports = mountLoader({
  proxies: [],
  components,
  fixtures,
});
