// @flow

import { isEqual, pick, mapValues } from 'lodash';
import { isElement } from 'react-is';

import type { Node, Element } from 'react';

export function areNodesEqual(a: Node, b: Node): boolean {
  return isEqual(stripInternalElementAttrs(a), stripInternalElementAttrs(b));
}

// Don't compare private element attrs like _owner and _store, which hold
// internal details and have auto increment-type attrs
function stripInternalElementAttrs(node: Node) {
  if (Array.isArray(node)) {
    return node.map(n => stripInternalElementAttrs(n));
  }

  if (isElement(node)) {
    // $FlowFixMe Flow can't get cues from react-is package
    const el: Element<any> = node;

    return {
      ...pick(el, 'type', 'key', 'ref'),
      // children and other props can contain Elements
      props: mapValues(el.props, propValue =>
        stripInternalElementAttrs(propValue)
      )
    };
  }

  return node;
}
