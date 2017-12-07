import { Component } from 'react';

export function isComponentClass(componentType) {
  // Warning: Some functions don't have the .prototype property
  return (
    componentType.prototype &&
    // ES6 Class
    (componentType.prototype instanceof Component ||
      // React.createClass
      componentType.prototype.getInitialState !== undefined) &&
    true
  );
}
