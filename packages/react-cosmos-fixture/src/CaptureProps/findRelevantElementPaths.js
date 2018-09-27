// @flow

import {
  findElementPaths,
  getExpectedElementAtPath
} from '../shared/childrenTree';

import type { Children } from '../shared/childrenTree';

export function findRelevantElementPaths(children: Children): string[] {
  const elPaths = findElementPaths(children);

  return elPaths.filter(elPath => {
    const { type } = getExpectedElementAtPath(children, elPath);

    return type.cosmosCaptureProps !== false;
  });
}
