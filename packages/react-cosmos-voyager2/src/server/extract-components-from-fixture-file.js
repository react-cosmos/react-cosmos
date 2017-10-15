// @flow

import fs from 'fs';
import path from 'path';
import promisify from 'util.promisify';
import * as babylon from 'babylon';
import * as t from 'babel-types';

import type { ComponentInfo } from '../types';

const readFileAsync = promisify(fs.readFile);

/**
 * Gather info for one or more components from fixture code (statically)
 *
 * Note: There's no 100% guarantee. Components can be inlined in the same file
 * as fixtures, in which case the path returned will be null.
 *
 * TODO: Support CJS
 */
export async function extractComponentsFromFixtureFile(
  fixturePath: string
): Promise<Array<ComponentInfo>> {
  const components = [];

  // TODO: Memoize
  const code = await readFileAsync(fixturePath, 'utf8');

  // TODO: How do we support everything user is using? (eg. Flow, TS, etc)
  const ast = babylon.parse(code, {
    sourceType: 'module',
    plugins: ['jsx']
  });

  try {
    const { body } = ast.program;

    // Get a list of all imports to query them later
    const imports = body.filter(t.isImportDeclaration);
    const defaultExportNode = body.find(t.isExportDefaultDeclaration);

    if (!defaultExportNode) {
      throw new Error('Could not find default export in fixture file');
    }

    const exportBody = defaultExportNode.declaration;
    let fixtureNodes;

    // Support for single and multi fixture files
    if (t.isArrayExpression(exportBody)) {
      fixtureNodes = exportBody.elements;
    } else if (t.isObjectExpression(exportBody)) {
      fixtureNodes = [exportBody];
    }

    if (!fixtureNodes) {
      throw new Error('Could not parse fixture export');
    }

    fixtureNodes.forEach(fixtureNode => {
      let name = null;
      let filePath = null;

      try {
        const compProp = fixtureNode.properties.find(
          prop => prop.key.name === 'component'
        );
        if (!compProp) {
          throw new Error('Fixture component property is missing');
        }
        if (!compProp.value.name) {
          throw new Error('Fixture component has no name');
        }

        // From this point we'll return the component name even if we fail to
        // detect the component file path
        name = compProp.value.name;

        const importPath = getImportPathByName(imports, name);
        if (!importPath) {
          throw new Error(
            'Could not find corresponding component import. ' +
              'Maybe the component is declared inside the fixture?'
          );
        }

        // TODO: What if path isn't relative?
        const absPath = path.join(path.dirname(fixturePath), importPath);
        filePath = require.resolve(absPath);
      } catch (err) {
        // TODO: Allow user to see these errors when debugging
        // console.log(err.message);
      }

      components.push({
        name,
        filePath
      });
    });
  } catch (err) {
    // TODO: Allow user to see these errors when debugging
    // console.log(err.message);
  }

  return components;
}

function getImportPathByName(imports, importName: string): string | null {
  // TODO: Support `import { component }` or `import { component as component }`
  const relevantImport = imports.find(
    i => i.specifiers[0].local.name === importName
  );

  return relevantImport ? relevantImport.source.value : null;
}
