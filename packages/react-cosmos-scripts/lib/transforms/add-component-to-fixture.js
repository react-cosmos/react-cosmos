'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.addComponentToFixture = addComponentToFixture;

var _jscodeshift = require('jscodeshift');

var _jscodeshift2 = _interopRequireDefault(_jscodeshift);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/**
 * Upgrade old-style fixtures to include import and reference component
 */
function addComponentToFixture(_ref) {
  var fixtureCode = _ref.fixtureCode,
    componentPath = _ref.componentPath,
    componentName = _ref.componentName;

  var root = (0, _jscodeshift2.default)(fixtureCode);
  var imports = root.find(_jscodeshift2.default.ImportDeclaration);

  // Create component import
  var compImport = _jscodeshift2.default.importDeclaration(
    [
      _jscodeshift2.default.importDefaultSpecifier(
        _jscodeshift2.default.identifier(componentName)
      )
    ],
    // Trim '.js` extensions
    _jscodeshift2.default.stringLiteral(componentPath.replace(/\.js$/, ''))
  );

  // Is this the first import?
  if (imports.length > 0) {
    // Does the import already exist?
    var compImportExists =
      imports.filter(function(_ref2) {
        var node = _ref2.node;
        return (
          node.source.value === componentPath ||
          // This is not bullet proof, but most probably an import with the name
          // of the component in a fixture points to the same component file
          (node.specifiers[0] &&
            node.specifiers[0].local.name === componentName)
        );
      }).length > 0;

    if (!compImportExists) {
      imports.at(imports.length - 1).insertAfter(compImport);
    }
  } else {
    root
      .find(_jscodeshift2.default.Program)
      .get('body')
      .unshift(compImport);
  }

  // Add component to fixture
  var fixtureProps = root
    .find(_jscodeshift2.default.ExportDefaultDeclaration)
    .get('declaration')
    .get('properties');

  // Don't add component prop twice
  var compPropExists =
    fixtureProps.filter(function(_ref3) {
      var node = _ref3.node;
      return node.key.name === 'component';
    }).length > 0;

  if (!compPropExists) {
    var compProp = _jscodeshift2.default.objectProperty(
      _jscodeshift2.default.identifier('component'),
      _jscodeshift2.default.identifier(componentName)
    );
    fixtureProps.unshift(compProp);
  }

  var output = root.toSource({
    quote: 'single'
  });

  // Ensure there is an empty line between last import and export
  output = output.replace(/;\nexport default/g, ';\n\nexport default');

  // Ensure there are no empty lines between imports
  output = output.replace(/;\n\nimport/g, ';\nimport');

  return output;
}
