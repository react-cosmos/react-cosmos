// @flow

import { flatten, get, set, cloneDeep } from 'lodash';
import { isElement } from 'react-is';
import { Fragment } from 'react';

import type { Node, Element } from 'react';

/**
 * Utility for extending React Elements from a tree of React Nodes.
 *
 * The root Node is the `children` prop of a parent Element. Besides the Node
 * type, children can also be a function.
 * https://reactjs.org/docs/jsx-in-depth.html#functions-as-children
 */

type Children = Node | (any => Node);

export function findElementPaths(
  children: Children,
  curPath: string = ''
): string[] {
  if (Array.isArray(children)) {
    return flatten(
      children.map((child, idx) =>
        findElementPaths(child, `${curPath}[${idx}]`)
      )
    );
  }

  if (!isElement(children)) {
    // At this point children can be null, boolean, string, number, Portal, etc.
    // https://github.com/facebook/flow/blob/172d28f542f49bbc1e765131c9dfb9e31780f3a2/lib/react.js#L13-L20
    return [];
  }

  // $FlowFixMe Flow can't get cues from react-is package
  const element: Element<any> = children;

  const elPaths = findElementPaths(
    element.props.children,
    isRootPath(curPath) ? 'props.children' : `${curPath}.props.children`
  );

  // Ignore Fragment elements, but include their children
  return element.type === Fragment ? elPaths : [curPath, ...elPaths];
}

// NiceToHave: Assert child path validity
export function getElementAtPath(
  children: Children,
  elPath: string
): null | Element<any> {
  // Only elements or array of elements have child nodes
  if (!children || typeof children !== 'object') {
    return null;
  }

  const childNode: Children = isRootPath(elPath)
    ? children
    : get(children, elPath);

  if (!isElement(childNode)) {
    // Why be silent about trying to fetch a node that isn't an element?
    // Because users of this utility only care about elements. Whether the child
    // node was removed or replaced by a different type of node (eg. string,
    // array of elements, etc.) is irrelevant.
    return null;
  }

  // $FlowFixMe Flow can't get cues from react-is package
  return childNode;
}

export function setElementAtPath(
  children: Children,
  elPath: string,
  updater: (Element<any>) => Element<any>
) {
  // Only elements or array of elements have child nodes
  if (!children || typeof children !== 'object') {
    throw new Error(`Can't edit non-element node`);
  }

  const childEl = getElementAtPath(children, elPath);

  if (!childEl) {
    throw new Error(`Missing element at path: ${elPath}`);
  }

  const newEl = updater(childEl);

  if (isRootPath(elPath)) {
    return newEl;
  }

  return set(cloneDeep(children), elPath, newEl);
}

function isRootPath(elPath) {
  return elPath === '';
}
