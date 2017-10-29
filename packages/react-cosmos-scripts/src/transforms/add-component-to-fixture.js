// @flow

import j from 'jscodeshift';

type Args = {
  fixtureCode: string,
  componentPath: string,
  componentName: string
};

/**
 * Upgrade old-style fixtures to include import and reference component
 */
export function addComponentToFixture({
  fixtureCode,
  componentPath,
  componentName
}: Args) {
  const root = j(fixtureCode);
  const imports = root.find(j.ImportDeclaration);

  // Create component import
  const compImport = j.importDeclaration(
    [j.importDefaultSpecifier(j.identifier(componentName))],
    // Trim '.js` extensions
    j.stringLiteral(componentPath.replace(/\.js$/, ''))
  );

  // Is this the first import?
  if (imports.length > 0) {
    // Does the import already exist?
    const compImportExists =
      imports.filter(
        ({ node }) =>
          node.source.value === componentPath ||
          // This is not bullet proof, but most probably an import with the name
          // of the component in a fixture points to the same component file
          (node.specifiers[0] &&
            node.specifiers[0].local.name === componentName)
      ).length > 0;

    if (!compImportExists) {
      imports.at(imports.length - 1).insertAfter(compImport);
    }
  } else {
    root
      .find(j.Program)
      .get('body')
      .unshift(compImport);
  }

  // Add component to fixture
  const fixtureProps = root
    .find(j.ExportDefaultDeclaration)
    .get('declaration')
    .get('properties');

  // Don't add component prop twice
  const compPropExists =
    fixtureProps.filter(({ node }) => node.key.name === 'component').length > 0;

  if (!compPropExists) {
    const compProp = j.objectProperty(
      j.identifier('component'),
      j.identifier(componentName)
    );
    fixtureProps.unshift(compProp);
  }

  let output = root.toSource({
    quote: 'single'
  });

  // Ensure there is an empty line between last import and export
  output = output.replace(/;\nexport default/g, `;\n\nexport default`);

  // Ensure there are no empty lines between imports
  output = output.replace(/;\n\nimport/g, `;\nimport`);

  return output;
}
