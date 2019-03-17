import * as React from 'react';
import { findElementPaths, getExpectedElementAtPath } from './nodeTree';

type ExtendedComponentClass = React.ComponentClass & {
  cosmosCapture?: boolean;
};

export function findRelevantElementPaths(node: React.ReactNode): string[] {
  const elPaths = findElementPaths(node);

  return elPaths.filter(elPath => {
    const { type } = getExpectedElementAtPath(node, elPath);

    if (typeof type === 'string') {
      return isInterestingTag(type);
    }

    const classType = type as ExtendedComponentClass;
    return classType.cosmosCapture !== false && isInterestingClass(classType);
  });
}

function isInterestingTag(tagName: string) {
  // TODO: Make this customizable
  return tagName !== 'div' && tagName !== 'span';
}

function isInterestingClass(type: React.ComponentClass) {
  // TODO: Make this customizable
  return type.name !== 'StyledComponent';
}
