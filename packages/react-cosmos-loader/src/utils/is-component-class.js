import { Component } from 'react';

export function isComponentClass(componentType) {
  // Warning: Some functions don't have the .prototype property
  return (
    componentType.prototype &&
    // ES6 Class
    // Warning: This will return false is the component is extending a
    // different copy of React than the one used by Cosmos. This is relevant
    // when running Cosmos from an external location instead of node_modules.
    (componentType.prototype instanceof Component ||
      // React.createClass
      componentType.prototype.getInitialState !== undefined) &&
    true
  );
}
