// @flow

import type { Node } from 'react';

export type Children = Node | (any => Node);

export function isRootPath(elPath: string) {
  return elPath === '';
}
