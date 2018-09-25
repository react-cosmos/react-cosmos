// @flow

import { Component } from 'react';

import type { ElementRef } from 'react';

export function getRefType(
  elRef: ElementRef<typeof Component>
): Class<Component<any>> {
  // NOTE: This assumes ref is a Class instance, something React might
  // change in the future
  return elRef.constructor;
}
