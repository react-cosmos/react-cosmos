// @flow

import { flatten } from 'lodash';
import { isElement } from 'react-is';
import { Fragment } from 'react';
import { isRootPath } from './shared';

import type { Element } from 'react';
import type { Children } from './shared';

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
