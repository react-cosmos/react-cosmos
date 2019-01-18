// @flow

import { flatten } from 'lodash';
import { isElement } from 'react-is';
import { Fragment } from 'react';
import { getChildrenPath } from './shared';

import type { Node, Element } from 'react';

export function findElementPaths(node: Node, curPath: string = ''): string[] {
  if (Array.isArray(node)) {
    return flatten(
      node.map((child, idx) => findElementPaths(child, `${curPath}[${idx}]`))
    );
  }

  if (!isElement(node)) {
    // At this point the node can be null, boolean, string, number, Portal, etc.
    // https://github.com/facebook/flow/blob/172d28f542f49bbc1e765131c9dfb9e31780f3a2/lib/react.js#L13-L20
    return [];
  }

  // $FlowFixMe Flow can't get cues from react-is package
  const element: Element<any> = node;
  const { children } = element.props;

  const childElPaths =
    // Props of elements returned by render functions can't be read here
    typeof children !== 'function'
      ? findElementPaths(children, getChildrenPath(curPath))
      : [];

  // Ignore Fragment elements, but include their children
  return element.type === Fragment ? childElPaths : [curPath, ...childElPaths];
}
