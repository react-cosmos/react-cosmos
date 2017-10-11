// @flow

import fs from 'fs';
import path from 'path';
import promisify from 'util.promisify';
import * as babylon from 'babylon';

const readFileAsync = promisify(fs.readFile);

type Args = {
  fixturePath: string,
  fixtureIndex: number | null
};

type Output = {
  // The name of the component might also come in handy in case we couldn't
  // determine it otherwise
  componentName: string | null,
  componentPath: string | null
};

const defaults = {
  fixtureIndex: null
};

/**
 * Detect component name and file path from fixture code (statically)
 *
 * Note: There's no 100% guarantee. Components can be inlined in the same file
 * as fixtures, in which case the path returned will be null.
 *
 * TODO: Support CJS
 */
export async function getComponentInfoFromFixture(args: Args): Promise<Output> {
  const { fixturePath, fixtureIndex } = { ...defaults, ...args };

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
    const imports = body.filter(isTyper('ImportDeclaration'));
    const defaultExportNode = body.find(isTyper('ExportDefaultDeclaration'));

    if (!defaultExportNode) {
      throw Error('Could not find default export in fixture file');
    }

    const exportBody = defaultExportNode.declaration;
    let fixtureNode;

    // Support for single and multi fixture files
    if (isType(exportBody, 'ArrayExpression')) {
      fixtureNode = exportBody.elements[fixtureIndex];
    } else if (isType(exportBody, 'ObjectExpression')) {
      fixtureNode = exportBody;
    }

    if (!fixtureNode) {
      // Could not understand fixture contents so we report that we were
      // unsuccessful in detecting the component path
      throw Error('Could not parse fixture export');
    } else {
      const componentProperty = fixtureNode.properties.find(
        prop => prop.key.name === 'component'
      );
      const componentName = componentProperty.value.name;

      // From this point we'll return the component name even if we fail to
      // detect the component file path
      try {
        const componentPath = getImportPathByName(imports, componentName);
        if (!componentPath) {
          throw Error(
            'Could not find corresponding component import. ' +
              'Maybe the component is declared inside the fixture?'
          );
        }

        // TODO: What if path isn't relative?
        const componentAbsPath = path.join(
          path.dirname(fixturePath),
          componentPath
        );
        const componentResolvedPath = require.resolve(componentAbsPath);

        return {
          componentName,
          componentPath: componentResolvedPath
        };
      } catch (e) {
        // TODO: Allow user to see these errors when debugging
        // console.log(e.message);
        return {
          componentName,
          componentPath: null
        };
      }
    }
  } catch (e) {
    // TODO: Allow user to see these errors when debugging
    // console.log(e.message);
    return {
      componentName: null,
      componentPath: null
    };
  }
}

function getImportPathByName(imports, componentName: string): string | null {
  // TODO: Support `import { component }` or `import { component as component }`
  const relevantImport = imports.find(
    i => i.specifiers[0].local.name === componentName
  );

  return relevantImport ? relevantImport.source.value : null;
}

function isTyper(nodeType) {
  return node => isType(node, nodeType);
}

function isType(node, nodeType) {
  return node.type === nodeType;
}
