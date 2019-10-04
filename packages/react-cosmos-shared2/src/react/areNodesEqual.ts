import { isEqual } from 'lodash';
import React from 'react';
import { getComponentName } from './getComponentName';
import { isReactElement } from './isReactElement';

export function areNodesEqual(
  node1: React.ReactNode,
  node2: React.ReactNode,
  strictTypeCheck: boolean
): boolean {
  if (isReactElement(node1) && isReactElement(node2)) {
    return areElementsEqual(node1, node2, strictTypeCheck);
  }

  if (Array.isArray(node1) && Array.isArray(node2)) {
    return node1.every((node, nodeIndex) =>
      areNodesEqual(node, node2[nodeIndex], strictTypeCheck)
    );
  }

  return isEqual(node1, node2);
}

function areElementsEqual(
  element1: React.ReactElement<any>,
  element2: React.ReactElement<any>,
  strictTypeCheck: boolean
) {
  if (strictTypeCheck) {
    if (element1.type !== element2.type) {
      return false;
    }
  } else if (
    getComponentName(element1.type) !== getComponentName(element2.type)
  ) {
    return false;
  }

  // Don't compare private element attrs like _owner and _store, which hold
  // internal details and have auto increment-type attrs
  return (
    element1.key === element2.key &&
    // @ts-ignore
    element1.ref === element2.ref &&
    // Children (and props in general) can contain Elements and other Nodes
    areNodesEqual(element1.props, element2.props, strictTypeCheck)
  );
}
