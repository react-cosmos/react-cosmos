/**
 * Normalize exported value of ES6/CommonJS modules
 */
const importModule = (module, moduleName) => {
  // This is an implementation detail of Babel:
  // https://medium.com/@kentcdodds/misunderstanding-es6-modules-upgrading-babel-tears-and-a-solution-ad2d5ab93ce0#.skvldbg39
  // https://github.com/esnext/es6-module-transpiler/issues/86
  // eslint-disable-next-line no-underscore-dangle
  if (module.__esModule) {
    return module[moduleName] || module.default;
  }

  return module;
};

// TODO: Improve ReactComponent check!
const isReactComponent = component =>
  typeof component === 'string' || typeof component === 'function';

/**
 * Input example:
 * {
 *   'Comment': { __esModule: true, default: [ReactComponent] },
 * }
 * Output example:
 * {
 *   'Comment': [ReactComponent],
 * }
 */
export function loadComponents(components) {
  const result = {};

  Object.keys(components).forEach(name => {
    const component = importModule(components[name], name);

    if (!component || !isReactComponent(component)) {
      // eslint-disable-next-line no-console
      console.warn(`'${name}' is not a valid React component`);
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
 *     'short': { __esModule: true, default: { ... } },
 *   },
 *   'Post': {}
 * }
 * Output example:
 * {
 *   'Comment': {
 *     'short': {
 *       'author': 'Sarcastic Sue'
 *       'body': ':)'
 *     },
 *   },
 *   'Post': {
 *     'no props (auto)': {}
 *   }
 * }
 */
export function loadFixtures(fixtures) {
  const result = {};

  Object.keys(fixtures).forEach(componentName => {
    const componentFixtures = fixtures[componentName];
    const componentResult = {};

    Object.keys(componentFixtures).forEach(name => {
      componentResult[name] = importModule(componentFixtures[name], name);
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
