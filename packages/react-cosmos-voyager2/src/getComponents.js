// @flow

import path from 'path';
import glob from 'glob';
import micromatch from 'micromatch';
import promisify from 'util.promisify';
import commondir from 'commondir';
import { sortBy } from 'lodash';
import { importModule } from './utils/importModule';
import { inferComponentName } from './utils/inferComponentName';
import { getComponentInfoFromFixture } from './utils/getComponentInfoFromFixture';
import { createDefaultNamer } from './utils/defaultNamer';

import type { ComponentType } from 'react';
import type { Components, FixturesByComponent } from './types';

const globAsync = promisify(glob);

type Args = ?{
  fileMatch?: Array<string>,
  cwd?: string
};

const defaultFileMatch = [
  '**/__fixture?(s)__/**/*.{js,jsx}',
  '**/?(*.)fixture?(s).{js,jsx}'
];

const defaults = {
  fileMatch: defaultFileMatch,
  cwd: process.cwd()
};

export async function getComponents(args: Args): Promise<Components> {
  const { fileMatch, cwd } = { ...defaults, ...args };

  // TODO: How do we watch for file changes?
  const allPaths = await globAsync('**/*', {
    cwd,
    absolute: true,
    ignore: '**/node_modules/**'
  });
  const fixturePaths = micromatch(allPaths, fileMatch);
  const fixtureCommonDir = getCommonDirFromPaths(fixturePaths);
  const defaultFixtureNamer = createDefaultNamer('default');

  // Group all fixtures by component
  const fixturesByComponent: FixturesByComponent = new Map();
  const componentNames: Map<ComponentType<*>, string> = new Map();
  const componentPaths: Map<ComponentType<*>, string> = new Map();

  // Can't use forEach because we want each (async) loop to be serial
  for (let i = 0; i < fixturePaths.length; i++) {
    const fixturePath = fixturePaths[i];
    const source = importModule(require(fixturePath));
    const fileNamespace = getFileNamespace(fixtureCommonDir, fixturePath);

    // Fixture files can export one fixture object or a list of fixture object
    const isMultiFixture = Array.isArray(source);
    const fixturesInFile = isMultiFixture ? source : [source];

    // Can't use forEach because we want each (async) loop to be serial
    for (let j = 0; j < fixturesInFile.length; j++) {
      const fixture = fixturesInFile[j];
      const fixtureIndex = isMultiFixture ? j : null;
      const { component, name } = fixture;

      // TODO: Throw if fixture.component is missing

      // Check user specified namespace first, fallback to namespacing based
      // on file path
      const namespace = fixture.namespace || fileNamespace;

      // Is this the first fixture for this component?
      let compFixtures = fixturesByComponent.get(component);
      if (!compFixtures) {
        compFixtures = [];
        fixturesByComponent.set(component, compFixtures);
      }

      compFixtures.push({
        filePath: fixturePath,
        fixtureIndex,
        name: name || defaultFixtureNamer(component),
        namespace
      });

      if (!componentPaths.get(component)) {
        const {
          componentName,
          componentPath
        } = await getComponentInfoFromFixture({
          fixturePath,
          fixtureIndex
        });

        // It's possible to identify the component name but not the file path
        if (componentName) {
          componentNames.set(component, componentName);
        }
        if (componentPath) {
          componentPaths.set(component, componentPath);
        }
      }
    }
  }

  // Add component meta data around fixtures
  const components: Components = [];
  const componentCommonDir = getCommonDirFromPaths(
    Array.from(componentPaths.values())
  );
  const defaultComponentNamer = createDefaultNamer('Component');

  for (let componentType of fixturesByComponent.keys()) {
    const compFixtures = fixturesByComponent.get(componentType);
    const filePath = componentPaths.get(componentType) || null;
    const name =
      // Try to read the Class/function name at run-time. User can override
      // this for custom naming
      inferComponentName(componentType) ||
      // Use the name that was used to reference the component in one of its
      // fixtures
      componentNames.get(componentType) ||
      // Fallback to "Component", "Component (1)", "Component (2)", etc.
      defaultComponentNamer();
    const namespace =
      typeof componentType.namespace === 'string'
        ? componentType.namespace
        : getFileNamespace(componentCommonDir, filePath);

    components.push({
      filePath,
      name,
      namespace,
      type: componentType,
      fixtures: compFixtures ? sortBy(compFixtures, f => f.name) : []
    });
  }

  return sortBy(components, c => c.name);
}

function getCommonDirFromPaths(paths: Array<string>) {
  return paths.length > 0 ? commondir(paths) : '';
}

function getFileNamespace(commonDir, filePath) {
  return filePath ? path.dirname(filePath).slice(commonDir.length + 1) : '';
}
