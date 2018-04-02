// @flow

import fs from 'fs';
import path from 'path';
import promisify from 'util.promisify';
import * as babylon from 'babylon';
import * as t from 'babel-types';
import { resolveUserPath } from 'react-cosmos-shared/lib/server';

import type { ComponentInfo } from 'react-cosmos-flow/module';

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
  fixturePath: string,
  rootPath: string
): Promise<Array<ComponentInfo>> {
  const components = [];
  let ast;

  try {
    // TODO: Memoize
    const code = await readFileAsync(fixturePath, 'utf8');

    ast = babylon.parse(code, {
      sourceType: 'module',
      // XXX: Does using all plugins have any disadvantage?
      plugins: [
        'jsx',
        'flow',
        'typescript',
        'objectRestSpread',
        'classProperties',
        'asyncGenerators',
        'dynamicImport'
      ]
    });
  } catch (err) {
    console.log(`[Cosmos] Failed to parse ${fixturePath}`);
    return components;
  }

  try {
    const { body } = ast.program;

    // Get a list of all imports and vars to query them later
    const imports = body.filter(t.isImportDeclaration);
    const vars = body.filter(t.isVariableDeclaration);

    const defaultExportNode = body.find(t.isExportDefaultDeclaration);

    if (!defaultExportNode) {
      throw new Error('Could not find default export in fixture file');
    }

    const exportBody = defaultExportNode.declaration;

    // Sometimes the export is referencing a previously declared var,
    // other times it is declared inline
    const fixtureBody = t.isIdentifier(exportBody)
      ? getVarBodyByName(vars, exportBody.name)
      : exportBody;

    if (!fixtureBody) {
      throw new Error('Could not parse fixture export');
    }

    // Support for single and multi fixture files
    let fixtureNodes;
    if (t.isArrayExpression(fixtureBody)) {
      fixtureNodes = fixtureBody.elements;
    } else if (fixtureBody) {
      fixtureNodes = [fixtureBody];
    }

    if (!fixtureNodes) {
      throw new Error('Could not parse fixture contents');
    }

    fixtureNodes.forEach(fixtureNode => {
      let name = null;
      let filePath = null;

      try {
        let fixtureBody = fixtureNode;

        // Sometimes the fixture is referencing a previously declared var,
        // other times it is declared inline
        if (t.isIdentifier(fixtureBody)) {
          fixtureBody = getVarBodyByName(vars, fixtureNode.name);

          if (!fixtureBody) {
            throw new Error('Could not read fixture body');
          }
        }

        // Sometimes the fixture is returned via a proxy function
        // Eg. createFixture({ ... })
        if (t.isCallExpression(fixtureBody)) {
          fixtureBody = fixtureBody.arguments[0];
        }

        if (!t.isObjectExpression(fixtureBody)) {
          throw new Error('Could not read fixture body');
        }

        // $FlowFixMe
        const compProp = fixtureBody.properties.find(
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

        // There are 3 use cases we support here:
        // 1. Relative paths to js files that can be resolved via Node. We
        // resolve path to actual file. Eg: ./Button => /path/to/Button.js
        // 2. Relative paths to non-js files. We resolve this path relative to
        // the fixture dir even if we can't check if file exists.
        // Eg: ./Button => /path/to/Button)
        // 3. Custom resolved module paths. We use as is.
        // Eg: components/Button
        const isModulePath = importPath.match(/^[^./]/);
        filePath = isModulePath
          ? path.join(rootPath, importPath)
          : resolveUserPath(path.dirname(fixturePath), importPath);
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
  const relevantImport = imports.find(i =>
    i.specifiers.some(s => s.local.name === importName)
  );

  return relevantImport ? relevantImport.source.value : null;
}

// TODO: Find out how to use Flow types with Babel types
function getVarBodyByName(vars, varName: string): any | null {
  let varBody = null;

  vars.forEach(declaration =>
    declaration.declarations.forEach(declarator => {
      if (declarator.id.name === varName) {
        varBody = declarator.init;
      }
    })
  );

  return varBody;
}
