import importModule from 'react-cosmos-utils/lib/import-module';

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
