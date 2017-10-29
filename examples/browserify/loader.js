import { mount } from 'react-cosmos-loader';
import { prepareOldSchoolFixtures } from './prepare-modules';

module.exports = mount({
  proxies: [],
  // FYI: The loader mount() API currently works with simple data types that
  // will be updated to match the newer data types from react-cosmos-voyager2
  fixtures: prepareOldSchoolFixtures()
});
