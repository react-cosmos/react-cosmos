/**
 * Normalize exported value of ES6/CommonJS modules
 */
const importModule = (fn, moduleName) => {
  // Make sure imported modules that crash on load are omitted and not spoil the
  // rest of the build.
  try {
    // Modules are require calls wrapped in functions instead of plain paths
    // in order to help bundlers like Webpack know which files to bundle.
    let module = fn();

    // This is an implementation detail of Babel:
    // https://medium.com/@kentcdodds/misunderstanding-es6-modules-upgrading-babel-tears-and-a-solution-ad2d5ab93ce0#.skvldbg39
    // It looks like to be a "standard": https://github.com/esnext/es6-module-transpiler/issues/86 **for now**.
    // eslint-disable-next-line no-underscore-dangle
    if (module.__esModule) {
      module = module[moduleName] || module.default;
    }

    return module;
  } catch (e) {
    return null;
  }
};

// TODO: Improve ReactClass check!
const isReactClass = component =>
  typeof component === 'string' || typeof component === 'function';

/**
 * Input example:
 * {
 *   'Comment': () => require('/path/to/project/src/components/Comment.js'),
 * }
 * Output example:
 * {
 *   'Comment': [ReactClass],
 * }
 */
export function loadComponents(components) {
  const result = {};

  Object.keys(components).forEach(name => {
    const component = importModule(components[name], name);

    if (!component || !isReactClass(component)) {
      // eslint-disable-next-line no-console
      console.warn(`Could not load component '${name}'`);
    } else {
      result[name] = component;
    }
  });

  return result;
}

/**
 * Input example:
 * {
 *   'Comment': {
 *     'short': () => require('/path/to/project/src/components/__fixtures__/Comment/short.js'),
 *     'long': () => require('/path/to/project/src/components/__fixtures__/Comment/long.js'),
 *   },
 * }
 * Output example:
 * {
 *   'Comment': {
 *     'short': {
 *       'author': 'Sarcastic Sue'
 *       'body': ':)'
 *     },
 *     'long': {
 *       'author': 'Loud Larry'
 *       'body': 'Don't get me started on JavaScript...'
 *     },
 *   },
 * }
 */
export function loadFixtures(fixtures) {
  const result = {};

  Object.keys(fixtures).forEach(componentName => {
    const componentFixtures = fixtures[componentName];
    const componentResult = {};

    Object.keys(componentFixtures).forEach(name => {
      const fixture = importModule(componentFixtures[name], name);

      if (!fixture) {
        // eslint-disable-next-line no-console
        console.warn(`Could not load fixture '${name}' of '${componentName}'`);
      } else {
        componentResult[name] = fixture;
      }
    });

    // Allow users to browse components before creating fixtures
    // TODO: Create more than empty defaults. Alongside a more metadata-rich
    // input, we could generate default fixtures to match PropTypes.
    if (!Object.keys(componentResult).length) {
      componentResult['no props (auto)'] = {};
    }

    result[componentName] = componentResult;
  });

  return result;
}
