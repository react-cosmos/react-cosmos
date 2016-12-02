// Replace with 'react-cosmos' & 'react-cosmos-redux-proxy' in real life
import { startPlayground } from '../../../packages/react-cosmos';
import { fixtures } from './prepare-modules';

module.exports = startPlayground({
  fixtures,
  loaderUri: 'http://localhost:8991/',
});
