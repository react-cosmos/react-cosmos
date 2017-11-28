// @flow

import { render, unmountComponentAtNode } from 'react-dom';

import type { LoaderOpts } from 'react-cosmos-shared/src/types';
import type { Renderer } from './types';

export function createDomRenderer(opts?: LoaderOpts = {}): Renderer {
  const { containerQuerySelector } = opts;
  const container = getDomContainer(containerQuerySelector);

  return function renderer(element) {
    render(element, container);

    return {
      unmount() {
        unmountComponentAtNode(container);
      }
    };
  };
}

function getDomContainer(querySelector?: string): HTMLElement {
  if (!querySelector) {
    return createDomContainer();
  }

  const existingContainer = document.querySelector(querySelector);
  if (!existingContainer) {
    console.warn(
      `[Cosmos] Could not find ${
        querySelector
      } element. Created fresh DOM container.`
    );
    return createDomContainer();
  }

  return existingContainer;
}

function createDomContainer() {
  const existingNode = document.getElementById('root');
  if (existingNode) {
    return existingNode;
  }

  const newNode = document.createElement('div');
  newNode.setAttribute('id', 'root');
  if (document.body) {
    document.body.appendChild(newNode);
  }

  return newNode;
}
