import React from 'react';
import { loadComponents, loadFixtures } from './load-modules';
import Loader from './components/Loader';
import PropsProxy from './components/proxies/PropsProxy';
import createStateProxy from './components/proxies/StateProxy';
import importModule from 'react-cosmos-utils/lib/import-module';

const initProxy = proxy => importModule(proxy)();

export default ({
  proxies,
  components,
  fixtures,
  component,
  fixture,
}) => (
  <Loader
    components={loadComponents(components)}
    fixtures={loadFixtures(fixtures)}
    component={component}
    fixture={fixture}
    proxies={[
      ...proxies.map(initProxy),
      // Loaded by default in all configs
      createStateProxy(),
      // The final proxy in the chain simply renders the selected component
      PropsProxy,
    ]}
  />
);
