// @flow

import path from 'path';
import commondir from 'commondir';
import { sortBy } from 'lodash';
import { inferComponentName } from './utils/infer-component-name';
import { createDefaultNamer } from './utils/default-namer';

import type { ComponentType } from 'react';
import type {
  Modules,
  FixtureFile,
  Fixture,
  Component
} from 'react-cosmos-flow/module';

type FixturesByComponent = Map<ComponentType<*>, Array<Fixture>>;

type Args = {
  fixtureFiles: Array<FixtureFile>,
  fixtureModules: Modules
};

export function getComponents({
  fixtureFiles,
  fixtureModules
}: Args): Array<Component> {
  const incompatFixtures: Set<string> = new Set();
  const fixturesByComponent: FixturesByComponent = new Map();
  const componentNames: Map<ComponentType<*>, string> = new Map();
  const componentPaths: Map<ComponentType<*>, string> = new Map();

  fixtureFiles.forEach(fixtureFile => {
    const { filePath } = fixtureFile;
    const module = fixtureModules[filePath];

    if (!module) {
      console.log(`[Cosmos] Missing module for ${filePath}`);
      return;
    }

    const fileName = getFileNameFromPath(filePath);
    const fileFixtureNamer = createDefaultNamer(fileName);

    // Fixture files can export one fixture object or a list of fixture object
    const fixturesInFile = Array.isArray(module) ? module : [module];

    fixturesInFile.forEach((fixture, fixtureIndex) => {
      const { component, name } = fixture;

      if (!fixture.component) {
        incompatFixtures.add(filePath);
        return;
      }

      // Is this the first fixture for this component?
      let compFixtures = fixturesByComponent.get(component);
      if (!compFixtures) {
        compFixtures = [];
        fixturesByComponent.set(component, compFixtures);
      }

      compFixtures.push({
        filePath,
        name: name || fileFixtureNamer(),
        // Note: namespace is updated later, after gathering all fixtures per
        // component
        namespace: '',
        // namespace,
        source: fixture
      });

      // Prepare for component info to be an empty list
      const componentInfo = fixtureFile.components[fixtureIndex];
      if (componentInfo) {
        // Stop at the first name found. Different names for the same component
        // can be found in future fixtures but will be ignored.
        if (!componentNames.get(component) && componentInfo.name) {
          componentNames.set(component, componentInfo.name);
        }
        // It's possible to identify the component name but not the file path
        if (!componentPaths.get(component) && componentInfo.filePath) {
          componentPaths.set(component, componentInfo.filePath);
        }
      }
    });
  });

  if (incompatFixtures.size > 0) {
    const fixtureCommonDir = getCommonDirFromPaths(Object.keys(fixtureModules));
    warnAboutIncompatFixtures(incompatFixtures, fixtureCommonDir);
  }

  // Add component meta data around fixtures
  const components = [];
  const componentPathValues = Array.from(componentPaths.values());
  const defaultComponentNamer = createDefaultNamer('Component');
  const componentNamers: Map<string, () => string> = new Map();

  for (const componentType of fixturesByComponent.keys()) {
    const compFixtures = fixturesByComponent.get(componentType);
    if (!compFixtures) {
      continue;
    }

    const filePath = componentPaths.get(componentType) || null;
    const namespace =
      // Not sure how to tell Flow that components can have extra properties
      // defined
      // $FlowFixMe
      typeof componentType.namespace === 'string'
        ? componentType.namespace
        : getCollapsedComponentNamespace(componentPathValues, filePath);
    const name =
      // Try to read the Class/function name at run-time. User can override
      // this for custom naming
      inferComponentName(componentType) ||
      // Use the name that was used to reference the component in one of its
      // fixtures
      componentNames.get(componentType) ||
      // Fallback to "Component", "Component (1)", "Component (2)", etc.
      defaultComponentNamer();

    // Components with duplicate names can end up being squashed (#494), so
    // it's best to keep component names unique.
    // That said, component names only have to be unique under the same namespace
    const nsName = getObjectPath({ name, namespace });
    let namer = componentNamers.get(nsName);
    if (!namer) {
      namer = createDefaultNamer(name);
      componentNamers.set(nsName, namer);
    }
    const uniqueName = namer();

    // We had to wait until now to be able to determine the common dir between
    // all fixtures belonging to the same component
    const compFixtureCommonDir = getCommonDirFromPaths(
      compFixtures.map(f => f.filePath)
    );
    const fixturesWithNamespace = compFixtures.map(f => ({
      ...f,
      // Check user specified namespace first, fallback to namespacing based
      // on file path
      namespace:
        f.source.namespace || getFileNamespace(compFixtureCommonDir, f.filePath)
    }));

    components.push({
      filePath,
      name: uniqueName,
      namespace,
      type: componentType,
      fixtures: compFixtures ? sortBy(fixturesWithNamespace, getObjectPath) : []
    });
  }

  return sortBy(components, getObjectPath);
}

function getFileNameFromPath(filePath: string) {
  return filePath
    .split('/')
    .pop()
    .split('.')[0];
}

function getCommonDirFromPaths(paths: Array<string>) {
  return paths.length > 0 ? commondir(paths) : '';
}

function getFileNamespace(commonDir: string, filePath: ?string) {
  // Warning: This function works well only when the filePath starts with /
  return filePath ? path.dirname(filePath).slice(commonDir.length + 1) : '';
}

function getCollapsedComponentNamespace(
  componentPaths: Array<string>,
  filePath: ?string
) {
  const componentCommonDir = getCommonDirFromPaths(componentPaths);
  const namespace = getFileNamespace(componentCommonDir, filePath);

  // Nothing to collapse
  if (!namespace) {
    return namespace;
  }

  const relPath = componentCommonDir
    ? `${componentCommonDir}/${namespace}`
    : namespace;
  const componentsAtPath = componentPaths.filter(
    p => p.indexOf(`${relPath}/`) === 0
  );

  if (componentsAtPath.length > 1) {
    return namespace;
  }

  // Collapse path by one level to prevent an extra nesting (eg "Button/Button")
  // when there is only one component in a directory
  return namespace
    .split('/')
    .slice(0, -1)
    .join('/');
}

function warnAboutIncompatFixtures(
  incompatFixtures: Set<string>,
  fixtureCommonDir
) {
  console.log(`[Cosmos] Found ${incompatFixtures.size} incompatible fixtures:`);
  console.log(
    [...incompatFixtures.values()]
      .map(f => `- ${f.slice(fixtureCommonDir.length + 1)}`)
      .join('\n')
  );
  console.log(
    '[Cosmos] Enable these fixtures by adding the `component` property.'
  );
  console.log(
    '[Cosmos] More details at https://github.com/react-cosmos/react-cosmos/issues/440'
  );
}

function getObjectPath(obj: { name: string, namespace: string }): string {
  return obj.namespace ? `${obj.namespace}/${obj.name}` : obj.name;
}
