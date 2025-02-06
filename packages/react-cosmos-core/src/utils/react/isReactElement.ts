import { ReactElement, ReactNode } from 'react';
import { isElement } from 'react-is';

// Allows accessing props.children in unknown elements
export type ReactElementWithChildren = ReactElement<{
  children?: ReactNode | Function;
  [key: string]: unknown;
}>;

export function isReactElement(
  node: ReactNode
): node is ReactElementWithChildren {
  return isElement(node);
}
