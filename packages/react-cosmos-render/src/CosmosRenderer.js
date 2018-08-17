// @flow

import { Component, createElement } from 'react';
import { isElement, isValidElementType } from 'react-is';

import type { Element, ComponentType } from 'react';
import type { Fixture } from './types';

type Props = {
  children: Fixture
};

export class CosmosRenderer extends Component<Props> {
  render() {
    const { children } = this.props;

    if (typeof children === 'string') {
      return children;
    }

    if (isElement(children)) {
      // $FlowFixMe Flow can't get cues from react-is package
      const element: Element<any> = children;

      return element;
    }

    if (isValidElementType(children)) {
      // $FlowFixMe Flow can't get cues from react-is package
      const compType: ComponentType<any> = children;

      return createElement(compType);
    }

    throw new Error(`Invalid fixture ${String(children)}`);
  }
}
