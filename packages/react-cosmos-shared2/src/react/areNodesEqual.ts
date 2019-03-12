import { isEqual, pick, mapValues } from 'lodash';
import { isElement } from 'react-is';
import * as React from 'react';

export function areNodesEqual(a: React.ReactNode, b: React.ReactNode): boolean {
  return isEqual(stripInternalElementAttrs(a), stripInternalElementAttrs(b));
}

// Don't compare private element attrs like _owner and _store, which hold
// internal details and have auto increment-type attrs
function stripInternalElementAttrs(node: React.ReactNode): {} {
  if (Array.isArray(node)) {
    return node.map(n => stripInternalElementAttrs(n));
  }
  if (!isElement(node)) {
    return node;
  }

  const el = node as React.ReactElement<any>;
  return {
    ...pick(el, 'type', 'key', 'ref'),
    // children and other props can contain Elements
    props: mapValues(el.props, propValue =>
      stripInternalElementAttrs(propValue)
    )
  };
}
