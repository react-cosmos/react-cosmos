// @flow

import { isEqual, pick } from 'lodash';
import { isElement } from 'react-is';

import type { Element } from 'react';
import type { Children } from './shared';

export function areChildrenEqual(a: Children, b: Children): boolean {
  if (Array.isArray(a) && Array.isArray(b)) {
    const bNodes: Array<Node> = b;

    return a.reduce((res, n, i) => res && areChildrenEqual(n, bNodes[i]), true);
  }

  if (isElement(a) && isElement(b)) {
    // $FlowFixMe Flow can't get cues from react-is package
    return areElementsEqual(a, b);
  }

  return isEqual(a, b);
}

function areElementsEqual(elA: Element<any>, elB: Element<any>) {
  return isEqual(pickElAttrs(elA), pickElAttrs(elB));
}

function pickElAttrs(el: Element<any>) {
  // Avoid comparing private element attrs like _owner and _store, which
  // have auto increment-type attrs
  return pick(el, 'type', 'key', 'ref', 'props');
}
