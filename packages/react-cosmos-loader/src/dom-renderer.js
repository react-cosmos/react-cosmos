// @flow

import { render, unmountComponentAtNode } from 'react-dom';

import type { Renderer } from './types';

export function createDomRenderer(container: HTMLElement): Renderer {
  return function renderer(element) {
    render(element, container);

    return {
      unmount() {
        unmountComponentAtNode(container);
      }
    };
  };
}
