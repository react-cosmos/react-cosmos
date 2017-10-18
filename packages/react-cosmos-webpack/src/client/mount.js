import importModule from 'react-cosmos-utils/lib/import-module';
import { getComponents } from 'react-cosmos-voyager2/lib/client/get-components';
import getUserModules from './user-modules';
import { mount } from 'react-cosmos-loader';

import type {
  Modules,
  FixtureFile,
  Component
} from 'react-cosmos-voyager2/src/types';

// eslint-disable-next-line no-undef
const { containerQuerySelector } = COSMOS_CONFIG;

export default function() {
  const {
    fixtureModules,
    fixtureFiles,
    deprecatedComponentModules,
    proxies
  } = getUserModules();

  // Old fixtures don't have a `component` property. To support both old & new
  // fixtures simultaneously, old style fixtures are altered on the fly by
  // adding each fixture's corresponding component in the fixture body.
  // FYI: deprecatedComponentModules is empty when using new style fixtures
  // exclusively.
  const normalizedFixtureModules = getNormalizedFixtureModules(
    fixtureModules,
    fixtureFiles,
    deprecatedComponentModules
  );

  // TEMP: The new data structures are ready on the server, but are not
  // yet adopted on the client. This conversion will be removed when the Loader
  // and CP start working with the types from react-cosmos-voyager2
  const newStyleComponents: Array<Component> = getComponents({
    fixtureModules: normalizedFixtureModules,
    fixtureFiles
  });
  const { components, fixtures } = getOldSchoolModulesFromNewStyleComponents(
    newStyleComponents
  );

  mount({
    proxies: importModule(proxies),
    components,
    fixtures,
    containerQuerySelector
  });
}

function getNormalizedFixtureModules(
  fixtureModules: Modules,
  fixtureFiles: Array<FixtureFile>,
  deprecatedComponentModules: Modules
) {
  const alteredFixtures: Set<string> = new Set();
  const invalidFixtures: Set<string> = new Set();

  const modules = Object.keys(fixtureModules).reduce((acc, next) => {
    const fixtureModule = importModule(fixtureModules[next]);

    // Component seems to be up to date, no alteration needed
    if (fixtureModule.component) {
      return {
        ...acc,
        [next]: fixtureModule
      };
    }

    try {
      const fixtureFile = fixtureFiles.find(f => f.filePath === next);
      const { components } = fixtureFile;
      const componentModule =
        deprecatedComponentModules[components[0].filePath];

      alteredFixtures.add(next);

      return {
        ...acc,
        [next]: {
          ...fixtureModule,
          component: importModule(componentModule)
        }
      };
    } catch (err) {
      invalidFixtures.add(next);

      return acc;
    }
  }, {});

  if (alteredFixtures.size > 0) {
    console.log(
      `[Cosmos] Successfully read ${alteredFixtures.size} old school fixtures:`
    );
    console.log(getPrintableListFromPaths(alteredFixtures));
  }

  if (invalidFixtures.size > 0) {
    console.warn(`[Cosmos] Failed to read ${invalidFixtures.size} fixtures:`);
    console.warn(getPrintableListFromPaths(invalidFixtures));
  }

  if (alteredFixtures.size > 0 || invalidFixtures.size > 0) {
    console.log(
      '[Cosmos] Upgrade these fixtures by adding the `component` property.'
    );
    console.log(
      '[Cosmos] More details at https://github.com/react-cosmos/react-cosmos/issues/440'
    );
  }

  return modules;
}

function getOldSchoolModulesFromNewStyleComponents(newStyleComponents) {
  const components = {};
  const fixtures = {};

  newStyleComponents.forEach(c => {
    const componentName = getObjectPath(c);
    components[componentName] = c.type;
    fixtures[componentName] = {};

    c.fixtures.forEach(f => {
      const fixtureName = getObjectPath(f);
      fixtures[componentName][fixtureName] = f.source;
    });
  });

  return { components, fixtures };
}

function getPrintableListFromPaths(set: Set<string>): string {
  return [...set.values()].map(f => `- ${f}`).join('\n');
}

function getObjectPath(obj: { name: string, namespace: string }): string {
  return obj.namespace ? `${obj.namespace}/${obj.name}` : obj.name;
}
