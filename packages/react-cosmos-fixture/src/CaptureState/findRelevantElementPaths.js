// @flow

import {
  findElementPaths,
  getExpectedElementAtPath
} from '../shared/childrenTree';
import { isRefSupported } from './isRefSupported';

import type { Children } from '../shared/childrenTree';

export function findRelevantElementPaths(children: Children): string[] {
  const elPaths = findElementPaths(children);

  return elPaths.filter(elPath => {
    const { type } = getExpectedElementAtPath(children, elPath);

    return isRefSupported(type) && type.cosmosCaptureState !== false;
  });
}
