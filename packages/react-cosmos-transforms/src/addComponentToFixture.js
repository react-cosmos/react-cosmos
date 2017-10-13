// @flow

import * as babylon from 'babylon';
import * as t from 'babel-types';
import generate from 'babel-generator';
import traverse from 'babel-traverse';

type Args = {
  fixtureCode: string,
  componentPath: string,
  componentName: string
};

/**
 * Upgrade old-style fixture to include component prop (statically)
 *
 * TODO: Move to new module react-cosmos-transform, together with a transform
 * to remove `componentPaths` and friends from cosmos.config
 */
export function addComponentToFixture({
  fixtureCode,
  componentPath,
  componentName
}: Args) {
  // TODO: How do we support everything user is using? (eg. Flow, TS, etc)
  const ast = babylon.parse(fixtureCode, {
    sourceType: 'module',
    plugins: ['jsx']
  });

  const { body } = ast.program;
  const imports = body.filter(t.isImportDeclaration);

  // Add component import
  const compImport = t.importDeclaration(
    [t.importDefaultSpecifier(t.identifier(componentName))],
    // Trim '.js` extensions
    t.stringLiteral(componentPath.replace(/\.js$/, ''))
  );

  // Is this the first import?
  if (imports.length > 0) {
    const lastImport = imports[imports.length - 1];
    const existingCompImport = imports.find(
      n =>
        n.source.value === componentPath ||
        // This is not bullet proof, but most probably an import with the name
        // of the component in a fixture points to the same component file
        (n.specifiers[0] && n.specifiers[0].local.name === componentName)
    );

    // Does the import already exist?
    if (!existingCompImport) {
      traverse(ast, {
        ImportDeclaration(path) {
          if (path.node === lastImport) {
            path.insertAfter(compImport);
          }
        }
      });
    }
  } else {
    traverse(ast, {
      Program(path) {
        path.unshiftContainer('body', compImport);
      }
    });
  }

  // Add component to fixture
  traverse(ast, {
    ExportDefaultDeclaration(path) {
      const componentProp = t.objectProperty(
        t.identifier('component'),
        t.identifier(componentName)
      );
      const existingProps = path.get('declaration').get('properties');

      // Don't add component prop twice
      if (!existingProps.find(p => p.node.key.name === 'component')) {
        path.get('declaration').replaceWith(
          t.objectExpression([
            componentProp,
            // Recreate existing props to have consistent whitespace
            ...existingProps
              .map(p => p.node)
              .map(n => t.objectProperty(n.key, n.value))
          ])
        );
      }
    }
  });

  let { code: newCode } = generate(ast, { quotes: 'single' }, fixtureCode);

  // Ensure there is an empty line between last import and export
  newCode = newCode.replace(/;\nexport default/g, `;\n\nexport default`);

  // Ensure there are no empty lines between imports
  newCode = newCode.replace(/;\n\nimport/g, `;\nimport`);

  // All files must end with a newline!
  return `${newCode}\n`;
}
