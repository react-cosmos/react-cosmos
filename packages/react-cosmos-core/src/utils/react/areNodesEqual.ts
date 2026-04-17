import { ComponentType, ReactNode } from 'react';
import { isObject } from '../data.js';
import { isEqual } from '../isEqual.js';
import { getComponentName } from './getComponentName.js';
import { isReactElement, ReactElementWithChildren } from './isReactElement.js';

export function areNodesEqual(
  node1: ReactNode,
  node2: ReactNode,
  strictTypeCheck: boolean
): boolean {
  if (isReactElement(node1) && isReactElement(node2))
    return areElementsEqual(node1, node2, strictTypeCheck);

  if (Array.isArray(node1) && Array.isArray(node2))
    return areArrayNodesEqual(node1, node2, strictTypeCheck);

  return isEqual(node1, node2);
}

function areElementsEqual(
  element1: ReactElementWithChildren,
  element2: ReactElementWithChildren,
  strictTypeCheck: boolean
) {
  if (!areElementTypesEqual(element1.type, element2.type, strictTypeCheck))
    return false;

  // Don't compare private element attrs like _owner and _store, which hold
  // internal details and have auto increment-type attrs
  return (
    element1.key === element2.key &&
    element1.props.ref === element2.props.ref &&
    // Children (and props in general) can contain Elements and other Nodes
    arePropsEqual(element1.props, element2.props)
  );
}

function areElementTypesEqual(
  type1: string | ComponentType,
  type2: string | ComponentType,
  strictTypeCheck: boolean
) {
  return strictTypeCheck
    ? type1 === type2
    : getComponentName(type1) === getComponentName(type2);
}

function areArrayNodesEqual(
  node1: ReactNode[],
  node2: ReactNode[],
  strictTypeCheck: boolean
) {
  if (node1.length !== node2.length) return false;

  return node1.every((node, nodeIndex) =>
    areNodesEqual(node, node2[nodeIndex], strictTypeCheck)
  );
}

type PlainObject = Record<string, unknown>;

function arePropsEqual(object1: PlainObject, object2: PlainObject): boolean {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);
  if (keys1.length !== keys2.length) return false;

  return keys1.every(
    key =>
      Object.prototype.hasOwnProperty.call(object2, key) &&
      arePropValuesEqual(object1[key], object2[key])
  );
}

// Recurse into plain objects and arrays so that functions at any depth are
// compared by their source code, not by reference. This makes prop comparison
// resilient to HMR, which creates fresh function instances on every reload.
function arePropValuesEqual(value1: unknown, value2: unknown): boolean {
  if (typeof value1 === 'function' && typeof value2 === 'function')
    return value1 === value2 || value1.toString() === value2.toString();

  if (isObject(value1) && isObject(value2))
    return arePropsEqual(value1, value2);

  if (Array.isArray(value1) && Array.isArray(value2)) {
    if (value1.length !== value2.length) return false;
    return value1.every((v, i) => arePropValuesEqual(v, value2[i]));
  }

  return isEqual(value1, value2);
}
