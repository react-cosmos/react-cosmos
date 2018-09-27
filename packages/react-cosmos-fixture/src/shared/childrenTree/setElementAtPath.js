// @flow

import { set } from 'lodash';
import { isElement } from 'react-is';
import { isRootPath } from './shared';
import { getExpectedElementAtPath } from './getElementAtPath';

import type { Element } from 'react';
import type { Children } from './shared';

export function setElementAtPath(
  children: Children,
  elPath: string,
  updater: (Element<any>) => Element<any>
): Children {
  const childEl = getExpectedElementAtPath(children, elPath);
  const newEl = updater(childEl);

  if (isRootPath(elPath)) {
    return newEl;
  }

  // _.set also accepts arrays
  // https://github.com/lodash/lodash/blob/6018350ac10d5ce6a5b7db625140b82aeab804df/isObject.js#L15-L16
  // $FlowFixMe
  return set(cloneChildren(children), elPath, newEl);
}

function cloneChildren<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(n => cloneChildren(n));
  }

  if (isElement(value)) {
    // $FlowFixMe Flow can't get cues from react-is package
    const el: Element<any> = value;
    const { children, ...otherProps } = el.props;

    // $FlowFixMe Convince Flow that T is Element<any>
    return {
      ...el,
      props: {
        ...otherProps,
        children: cloneChildren(children)
      }
    };
  }

  return value;
}
