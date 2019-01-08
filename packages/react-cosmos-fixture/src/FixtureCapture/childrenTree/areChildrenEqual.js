// @flow

import { isEqual, pick, mapValues } from 'lodash';
import { isElement } from 'react-is';

import type { Element } from 'react';
import type { Children } from './shared';

export function areChildrenEqual(a: Children, b: Children): boolean {
  return isEqual(stripInternalElementAttrs(a), stripInternalElementAttrs(b));
}

// Don't compare private element attrs like _owner and _store, which hold
// internal details and have auto increment-type attrs
function stripInternalElementAttrs(children: Children) {
  if (Array.isArray(children)) {
    return children.map(c => stripInternalElementAttrs(c));
  }

  if (isElement(children)) {
    // $FlowFixMe Flow can't get cues from react-is package
    const el: Element<any> = children;

    return {
      ...pick(el, 'type', 'key', 'ref'),
      // children and other props can contain Elements
      props: mapValues(el.props, prop => stripInternalElementAttrs(prop))
    };
  }

  return children;
}
