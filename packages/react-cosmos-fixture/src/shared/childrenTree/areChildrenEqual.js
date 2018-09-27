// @flow

import { isEqual, pick } from 'lodash';
import { isElement } from 'react-is';

import type { Element } from 'react';
import type { Children } from './shared';

export function areChildrenEqual(a: Children, b: Children): boolean {
  return isEqual(stripInternalNodeAttrs(a), stripInternalNodeAttrs(b));
}

// Don't compare private element attrs like _owner and _store, which hold
// internal details and have auto increment-type attrs
function stripInternalNodeAttrs(node: Children) {
  if (Array.isArray(node)) {
    return node.map(n => stripInternalNodeAttrs(n));
  }

  if (isElement(node)) {
    // $FlowFixMe Flow can't get cues from react-is package
    const el: Element<any> = node;
    const { props } = el;
    const { children } = props;

    return {
      ...pick(el, 'type', 'key', 'ref'),
      props: {
        ...props,
        children: children && stripInternalNodeAttrs(children)
      }
    };
  }

  return node;
}
