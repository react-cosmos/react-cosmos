import mountLoader from 'react-cosmos-loader';
import { components, fixtures } from './prepare-modules';

module.exports = mountLoader({
  proxies: [],
  components,
  fixtures,
});
