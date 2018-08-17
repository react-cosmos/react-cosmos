// @flow

import { isElement, isValidElementType } from 'react-is';
import { createElement } from 'react';

import type { Node } from 'react';
import type { Fixture } from './types';

export function getNodeFromFixture(fixture: Fixture): Node {
  if (typeof fixture !== 'string' && isValidElementType(fixture)) {
    // $FlowFixMe Flow can't get cues from react-is package
    const compType: ComponentType<any> = fixture;

    return createElement(compType);
  }

  if (isElement(fixture)) {
    // $FlowFixMe Flow can't get cues from react-is package
    const element: Element<any> = fixture;

    return element;
  }

  throw new Error(`Invalid fixture ${String(fixture)}`);
}
