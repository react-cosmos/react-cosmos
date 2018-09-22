// @flow

import { flatten, get, set, cloneDeep } from 'lodash';
import { isElement } from 'react-is';
import { Fragment } from 'react';

import type { Node, Element } from 'react';

export function findElementPaths(node: Node, curPath: string = ''): string[] {
  if (
    !node ||
    typeof node === 'boolean' ||
    typeof node === 'string' ||
    typeof node === 'number'
  ) {
    return [];
  }

  if (Array.isArray(node)) {
    return flatten(
      node.map((oneNode, idx) =>
        findElementPaths(oneNode, `${curPath}[${idx}]`)
      )
    );
  }

  if (isElement(node)) {
    // $FlowFixMe Flow can't get cues from react-is package
    const elNode: Element<any> = node;

    const childPaths = findElementPaths(
      elNode.props.children,
      curPath === '' ? 'props.children' : `${curPath}.props.children`
    );

    // Ignore Fragment elements
    return elNode.type === Fragment ? childPaths : [curPath, ...childPaths];
  }

  return [curPath];
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
