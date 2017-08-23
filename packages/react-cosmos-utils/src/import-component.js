import React from 'react';
import importModule from './import-module';

// TODO: Improve ReactComponent check!
const isReactComponent = component =>
  typeof component === 'string' || typeof component === 'function';

/**
 * Input example:
 *   { __esModule: true, default: [ReactComponent] }
 * Output example:
 *   [ReactComponent]
 */
export default (module, name) => {
  const component = importModule(module, name);

  if (!component || !isReactComponent(component)) {
    if (name) {
      return () =>
        <div>
          <strong>{name}</strong> is not a valid React component
        </div>;
    }

    return () => <div>Not a valid React component</div>;
  }

  return component;
};
