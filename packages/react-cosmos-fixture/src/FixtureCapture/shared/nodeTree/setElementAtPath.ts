import React from 'react';
import { set } from 'lodash';
import { isElement } from 'react-is';
import { isRootPath } from './shared';
import { getExpectedElementAtPath } from './getElementAtPath';

export function setElementAtPath(
  node: React.ReactNode,
  elPath: string,
  updater: (el: React.ReactElement<any>) => React.ReactElement<any>
): React.ReactNode {
  const childEl = getExpectedElementAtPath(node, elPath);
  const newEl = updater(childEl);

  if (isRootPath(elPath)) {
    return newEl;
  }

  // _.set also accepts arrays
  // https://github.com/lodash/lodash/blob/6018350ac10d5ce6a5b7db625140b82aeab804df/isObject.js#L15-L16
  return set(cloneNode(node) as {}, elPath, newEl);
}

function cloneNode(value: React.ReactNode): React.ReactNode {
  if (Array.isArray(value)) {
    return value.map(n => cloneNode(n));
  }

  if (isElement(value)) {
    const el = value as React.ReactElement<any>;
    const { children, ...otherProps } = el.props;

    return {
      ...el,
      props: {
        ...otherProps,
        children: cloneNode(children)
      }
    };
  }

  return value;
}
