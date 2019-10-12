/**
 * Utility for extending React Elements from a tree of React Nodes.
 *
 * The root Node is the `children` prop of a parent Element. Besides the Node
 * type, children can also be a function.
 * https://reactjs.org/docs/jsx-in-depth.html#functions-as-children
 */
export { findElementPaths } from './findElementPaths';
export { getElementAtPath, getExpectedElementAtPath } from './getElementAtPath';
export { setElementAtPath } from './setElementAtPath';
export { getChildrenPath } from './shared';
