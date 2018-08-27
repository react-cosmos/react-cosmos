// @flow

import { render, unmountComponentAtNode } from 'react-dom';

import type { LoaderWebOpts } from 'react-cosmos-flow/loader';
import type { Renderer } from 'react-cosmos-flow/context';

export function createDomRenderer(opts?: LoaderWebOpts = {}): Renderer {
  const { containerQuerySelector } = opts;
  const container = getDomContainer(containerQuerySelector);

  return function renderer(element) {
    render(element, container);

    return {
      unmount() {
        unmountComponentAtNode(container);
      },
      toJSON: () => null
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
      `[Cosmos] Could not find ${querySelector} element. Created fresh DOM container.`
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
