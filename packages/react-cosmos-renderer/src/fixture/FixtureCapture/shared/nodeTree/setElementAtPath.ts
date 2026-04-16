import { ReactNode } from 'react';
import { isReactElement, ReactElementWithChildren } from 'react-cosmos-core';
import { getExpectedElementAtPath } from './getElementAtPath.js';
import { isRootPath, setByPath } from './pathUtils.js';

export function setElementAtPath(
  node: ReactNode,
  elPath: string,
  updater: (el: ReactElementWithChildren) => ReactElementWithChildren
): ReactNode {
  const childEl = getExpectedElementAtPath(node, elPath);
  const newEl = updater(childEl);

  if (isRootPath(elPath)) {
    return newEl;
  }

  // If the root is a non-Array non-Element Node we should be at the root path
  // and returned already
  const clonedRoot = cloneNode(node) as ReactElementWithChildren | ReactNode[];

  return setByPath(clonedRoot, elPath, newEl);
}

function cloneNode(value: ReactNode) {
  return Array.isArray(value)
    ? value.map(n => cloneNodeItem(n))
    : cloneNodeItem(value);
}

function cloneNodeItem(value: ReactNode) {
  return isReactElement(value) ? cloneReactElement(value) : value;
}

function cloneReactElement(
  value: ReactElementWithChildren
): ReactElementWithChildren {
  const { children, ...otherProps } = value.props;
  return {
    ...value,
    props: {
      ...otherProps,
      children: cloneNode(children as ReactNode),
    },
  };
}
