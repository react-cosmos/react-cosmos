// @flow

import { flatten, get, set, cloneDeep } from 'lodash';
import { isElement } from 'react-is';
import { Fragment } from 'react';

import type { Node, Element } from 'react';

export function findElementPaths(
  children: Node | (any => Node),
  curPath: string = ''
): string[] {
  if (Array.isArray(children)) {
    return flatten(
      children.map((child, idx) =>
        findElementPaths(child, `${curPath}[${idx}]`)
      )
    );
  }

  if (isElement(children)) {
    // $FlowFixMe Flow can't get cues from react-is package
    const childEl: Element<any> = children;

    const childPaths = findElementPaths(
      childEl.props.children,
      curPath === '' ? 'props.children' : `${curPath}.props.children`
    );

    // Ignore Fragment elements
    return childEl.type === Fragment ? childPaths : [curPath, ...childPaths];
  }

  // At this point children can be null, boolean, string, number, Portal, etc.
  // https://github.com/facebook/flow/blob/172d28f542f49bbc1e765131c9dfb9e31780f3a2/lib/react.js#L13-L20
  // Children can also be a function.
  // https://reactjs.org/docs/jsx-in-depth.html#functions-as-children
  return [];
}

export function setChildElement(
  node: Element<any> | Array<Element<any>>,
  childPath: string,
  updater: (Element<any>) => Element<any>
) {
  const isRootPath = childPath === '';
  const childEl = isRootPath ? node : get(node, childPath);

  if (!childEl) {
    throw new Error(`Can't find child element path ${childPath}`);
  }

  if (Array.isArray(childEl)) {
    throw new Error(`Can't replace array at child element path ${childPath}`);
  }

  const newEl = updater(childEl);

  if (isRootPath) {
    return newEl;
  }

  const newNode = cloneDeep(node);

  // Flow def is wrong. lodash.set can handle arrays too
  // https://github.com/lodash/lodash/blob/6018350ac10d5ce6a5b7db625140b82aeab804df/isObject.js#L15-L16
  // $FlowFixMe
  return set(newNode, childPath, newEl);
}
