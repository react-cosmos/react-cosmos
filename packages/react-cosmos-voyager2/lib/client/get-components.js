'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.getComponents = getComponents;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _commondir = require('commondir');

var _commondir2 = _interopRequireDefault(_commondir);

var _lodash = require('lodash');

var _inferComponentName = require('./utils/infer-component-name');

var _defaultNamer = require('./utils/default-namer');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function getComponents(_ref) {
  var fixtureFiles = _ref.fixtureFiles,
    fixtureModules = _ref.fixtureModules;

  var incompatFixtures = new Set();
  var fixturesByComponent = new Map();
  var componentNames = new Map();
  var componentPaths = new Map();

  fixtureFiles.forEach(function(fixtureFile) {
    var filePath = fixtureFile.filePath;

    var module = fixtureModules[filePath];

    if (!module) {
      console.log('[Cosmos] Missing module for ' + filePath);
      return;
    }

    var fileName = getFileNameFromPath(filePath);
    var fileFixtureNamer = (0, _defaultNamer.createDefaultNamer)(fileName);

    // Fixture files can export one fixture object or a list of fixture object
    var fixturesInFile = Array.isArray(module) ? module : [module];

    fixturesInFile.forEach(function(fixture, fixtureIndex) {
      var component = fixture.component,
        name = fixture.name;

      if (!fixture.component) {
        incompatFixtures.add(filePath);
        return;
      }

      // Is this the first fixture for this component?
      var compFixtures = fixturesByComponent.get(component);
      if (!compFixtures) {
        compFixtures = [];
        fixturesByComponent.set(component, compFixtures);
      }

      compFixtures.push({
        filePath: filePath,
        name: name || fileFixtureNamer(),
        // Note: namespace is updated later, after gathering all fixtures per
        // component
        namespace: '',
        // namespace,
        source: fixture
      });

      // Prepare for component info to be an empty list
      var componentInfo = fixtureFile.components[fixtureIndex];
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
    var fixtureCommonDir = getCommonDirFromPaths(Object.keys(fixtureModules));
    warnAboutIncompatFixtures(incompatFixtures, fixtureCommonDir);
  }

  // Add component meta data around fixtures
  var components = [];
  var componentPathValues = Array.from(componentPaths.values());
  var defaultComponentNamer = (0, _defaultNamer.createDefaultNamer)(
    'Component'
  );
  var componentNamers = new Map();

  var _loop = function _loop(componentType) {
    var compFixtures = fixturesByComponent.get(componentType);
    if (!compFixtures) {
      return 'continue';
    }

    var filePath = componentPaths.get(componentType) || null;
    var namespace =
      typeof componentType.namespace === 'string'
        ? componentType.namespace
        : getCollapsedComponentNamespace(componentPathValues, filePath);
    var name =
      // Try to read the Class/function name at run-time. User can override
      // this for custom naming
      (0, _inferComponentName.inferComponentName)(componentType) ||
      // Use the name that was used to reference the component in one of its
      // fixtures
      componentNames.get(componentType) ||
      // Fallback to "Component", "Component (1)", "Component (2)", etc.
      defaultComponentNamer();

    // Components with duplicate names can end up being squashed (#494), so
    // it's best to keep component names unique.
    // That said, component names only have to be unique under the same namespace
    var nsName = getObjectPath({ name: name, namespace: namespace });
    var namer = componentNamers.get(nsName);
    if (!namer) {
      namer = (0, _defaultNamer.createDefaultNamer)(name);
      componentNamers.set(nsName, namer);
    }
    var uniqueName = namer();

    // We had to wait until now to be able to determine the common dir between
    // all fixtures belonging to the same component
    var compFixtureCommonDir = getCommonDirFromPaths(
      compFixtures.map(function(f) {
        return f.filePath;
      })
    );
    var fixturesWithNamespace = compFixtures.map(function(f) {
      return (0, _extends3.default)({}, f, {
        // Check user specified namespace first, fallback to namespacing based
        // on file path
        namespace:
          f.source.namespace ||
          getFileNamespace(compFixtureCommonDir, f.filePath)
      });
    });

    components.push({
      filePath: filePath,
      name: uniqueName,
      namespace: namespace,
      type: componentType,
      fixtures: compFixtures
        ? (0, _lodash.sortBy)(fixturesWithNamespace, getObjectPath)
        : []
    });
  };

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (
      var _iterator = fixturesByComponent.keys()[Symbol.iterator](), _step;
      !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
      _iteratorNormalCompletion = true
    ) {
      var componentType = _step.value;

      var _ret = _loop(componentType);

      if (_ret === 'continue') continue;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return (0, _lodash.sortBy)(components, getObjectPath);
}

function getFileNameFromPath(filePath) {
  return filePath
    .split('/')
    .pop()
    .split('.')[0];
}

function getCommonDirFromPaths(paths) {
  return paths.length > 0 ? (0, _commondir2.default)(paths) : '';
}

function getFileNamespace(commonDir, filePath) {
  // Warning: This function works well only when the filePath starts with /
  return filePath
    ? _path2.default.dirname(filePath).slice(commonDir.length + 1)
    : '';
}

function getCollapsedComponentNamespace(componentPaths, filePath) {
  var componentCommonDir = getCommonDirFromPaths(componentPaths);
  var namespace = getFileNamespace(componentCommonDir, filePath);

  // Nothing to collapse
  if (!namespace) {
    return namespace;
  }

  var relPath = componentCommonDir
    ? componentCommonDir + '/' + namespace
    : namespace;
  var componentsAtPath = componentPaths.filter(function(p) {
    return p.indexOf(relPath + '/') === 0;
  });

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

function warnAboutIncompatFixtures(incompatFixtures, fixtureCommonDir) {
  console.log(
    '[Cosmos] Found ' + incompatFixtures.size + ' incompatible fixtures:'
  );
  console.log(
    []
      .concat((0, _toConsumableArray3.default)(incompatFixtures.values()))
      .map(function(f) {
        return '- ' + f.slice(fixtureCommonDir.length + 1);
      })
      .join('\n')
  );
  console.log(
    '[Cosmos] Enable these fixtures by adding the `component` property.'
  );
  console.log(
    '[Cosmos] More details at https://github.com/react-cosmos/react-cosmos/issues/440'
  );
}

function getObjectPath(obj) {
  return obj.namespace ? obj.namespace + '/' + obj.name : obj.name;
}
