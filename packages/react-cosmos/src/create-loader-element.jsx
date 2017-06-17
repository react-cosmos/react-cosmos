import React from 'react';
import { loadComponents, loadFixtures } from './load-modules';
import importModule from 'react-cosmos-utils/lib/import-module';
import { RemoteLoader } from 'react-cosmos-loader';
import createStateProxy from 'react-cosmos-state-proxy';

const initProxy = proxy => importModule(proxy)();

export default ({ proxies, components, fixtures, component, fixture }) =>
  <RemoteLoader
    components={loadComponents(components)}
    fixtures={loadFixtures(fixtures)}
    component={component}
    fixture={fixture}
    proxies={[
      ...proxies.map(initProxy),
      // Loaded by default in all configs
      createStateProxy(),
    ]}
  />;
