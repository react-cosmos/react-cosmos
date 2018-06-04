'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.extractComponentsFromFixtureFile = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

/**
 * Gather info for one or more components from fixture code (statically)
 *
 * Note: There's no 100% guarantee. Components can be inlined in the same file
 * as fixtures, in which case the path returned will be null.
 *
 * TODO: Support CJS
 */
var extractComponentsFromFixtureFile = (exports.extractComponentsFromFixtureFile = (function() {
  var _ref = (0, _asyncToGenerator3.default)(
    /*#__PURE__*/ _regenerator2.default.mark(function _callee(
      fixturePath,
      rootPath
    ) {
      var components,
        ast,
        code,
        body,
        imports,
        vars,
        defaultExportNode,
        exportBody,
        fixtureBody,
        fixtureNodes;
      return _regenerator2.default.wrap(
        function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                components = [];
                ast = void 0;
                _context.prev = 2;
                _context.next = 5;
                return readFileAsync(fixturePath, 'utf8');

              case 5:
                code = _context.sent;

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
                _context.next = 13;
                break;

              case 9:
                _context.prev = 9;
                _context.t0 = _context['catch'](2);

                console.log('[Cosmos] Failed to parse ' + fixturePath);
                return _context.abrupt('return', components);

              case 13:
                _context.prev = 13;
                body = ast.program.body;

                // Get a list of all imports and vars to query them later

                imports = body.filter(t.isImportDeclaration);
                vars = body.filter(t.isVariableDeclaration);
                defaultExportNode = body.find(t.isExportDefaultDeclaration);

                if (defaultExportNode) {
                  _context.next = 20;
                  break;
                }

                throw new Error(
                  'Could not find default export in fixture file'
                );

              case 20:
                exportBody = defaultExportNode.declaration;

                // Sometimes the export is referencing a previously declared var,
                // other times it is declared inline

                fixtureBody = t.isIdentifier(exportBody)
                  ? getVarBodyByName(vars, exportBody.name)
                  : exportBody;

                if (fixtureBody) {
                  _context.next = 24;
                  break;
                }

                throw new Error('Could not parse fixture export');

              case 24:
                // Support for single and multi fixture files
                fixtureNodes = void 0;

                if (t.isArrayExpression(fixtureBody)) {
                  fixtureNodes = fixtureBody.elements;
                } else if (t.isObjectExpression(fixtureBody)) {
                  fixtureNodes = [fixtureBody];
                }

                if (fixtureNodes) {
                  _context.next = 28;
                  break;
                }

                throw new Error('Could not parse fixture contents');

              case 28:
                fixtureNodes.forEach(function(fixtureNode) {
                  var name = null;
                  var filePath = null;

                  try {
                    // Sometimes the fixture is referencing a previously declared var,
                    // other times it is declared inline
                    var _fixtureBody = t.isIdentifier(fixtureNode)
                      ? getVarBodyByName(vars, fixtureNode.name)
                      : fixtureNode;

                    if (!t.isObjectExpression(_fixtureBody)) {
                      throw new Error('Could not read fixture body');
                    }

                    // $FlowFixMe
                    var compProp = _fixtureBody.properties.find(function(prop) {
                      return prop.key.name === 'component';
                    });
                    if (!compProp) {
                      throw new Error('Fixture component property is missing');
                    }
                    if (!compProp.value.name) {
                      throw new Error('Fixture component has no name');
                    }

                    // From this point we'll return the component name even if we fail to
                    // detect the component file path
                    name = compProp.value.name;

                    var importPath = getImportPathByName(imports, name);
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
                    var isModulePath = importPath.match(/^[^./]/);
                    filePath = isModulePath
                      ? _path2.default.join(rootPath, importPath)
                      : (0, _server.resolveUserPath)(
                          _path2.default.dirname(fixturePath),
                          importPath
                        );
                  } catch (err) {
                    // TODO: Allow user to see these errors when debugging
                    // console.log(err.message);
                  }

                  components.push({
                    name: name,
                    filePath: filePath
                  });
                });
                _context.next = 33;
                break;

              case 31:
                _context.prev = 31;
                _context.t1 = _context['catch'](13);

              case 33:
                return _context.abrupt('return', components);

              case 34:
              case 'end':
                return _context.stop();
            }
          }
        },
        _callee,
        this,
        [[2, 9], [13, 31]]
      );
    })
  );

  return function extractComponentsFromFixtureFile(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})());

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _util = require('util.promisify');

var _util2 = _interopRequireDefault(_util);

var _babylon = require('babylon');

var babylon = _interopRequireWildcard(_babylon);

var _babelTypes = require('babel-types');

var t = _interopRequireWildcard(_babelTypes);

var _server = require('react-cosmos-shared/lib/server');

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};
    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key))
          newObj[key] = obj[key];
      }
    }
    newObj.default = obj;
    return newObj;
  }
}

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var readFileAsync = (0, _util2.default)(_fs2.default.readFile);

function getImportPathByName(imports, importName) {
  var relevantImport = imports.find(function(i) {
    return i.specifiers.some(function(s) {
      return s.local.name === importName;
    });
  });

  return relevantImport ? relevantImport.source.value : null;
}

// TODO: Find out how to use Flow types with Babel types
function getVarBodyByName(vars, varName) {
  var varBody = null;

  vars.forEach(function(declaration) {
    return declaration.declarations.forEach(function(declarator) {
      if (declarator.id.name === varName) {
        varBody = declarator.init;
      }
    });
  });

  return varBody;
}
