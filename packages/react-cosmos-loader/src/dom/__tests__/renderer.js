// @flow

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { createDomRenderer } from '../renderer';

jest.mock('react-dom', () => ({
  render: jest.fn(),
  unmountComponentAtNode: jest.fn()
}));

function getElementFromRenderCall() {
  return render.mock.calls[0][0];
}

function getContainerFromRenderCall() {
  return render.mock.calls[0][1];
}

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  if (document.body) {
    document.body.innerHTML = '';
  }
});

describe('without containerQuerySelector', () => {
  it('calls ReactDOM.render a React element', () => {
    const renderer = createDomRenderer();
    renderer(<span />);

    expect(getElementFromRenderCall()).toEqual(<span />);
  });

  it('calls ReactDOM.render with a child of document.body', () => {
    const renderer = createDomRenderer();
    renderer(<span />);

    const container = getContainerFromRenderCall();
    expect(container.parentNode).toBe(document.body);
  });

  it('calls ReactDOM.unmountComponentAtNode on unmount', () => {
    const renderer = createDomRenderer();
    const wrapper = renderer(<span />);
    wrapper.unmount();

    const container = getContainerFromRenderCall();
    expect(unmountComponentAtNode).toHaveBeenCalledWith(container);
  });
});

describe('with invalid containerQuerySelector', () => {
  const loaderOpts = { containerQuerySelector: '#missing' };

  it('calls ReactDOM.render a React element', () => {
    const renderer = createDomRenderer(loaderOpts);
    renderer(<span />);

    expect(getElementFromRenderCall()).toEqual(<span />);
  });

  it('calls ReactDOM.render with a child of document.body', () => {
    const renderer = createDomRenderer(loaderOpts);
    renderer(<span />);

    const container = getContainerFromRenderCall();
    expect(container.parentNode).toBe(document.body);
  });

  it('calls ReactDOM.unmountComponentAtNode on unmount', () => {
    const renderer = createDomRenderer(loaderOpts);
    const wrapper = renderer(<span />);
    wrapper.unmount();

    const container = getContainerFromRenderCall();
    expect(unmountComponentAtNode).toHaveBeenCalledWith(container);
  });
});

describe('with containerQuerySelector', () => {
  const loaderOpts = { containerQuerySelector: '#app123' };

  let rootEl;
  beforeEach(() => {
    rootEl = window.document.createElement('div');
    rootEl.id = 'app123';

    if (document.body) {
      document.body.appendChild(rootEl);
    }
  });

  it('calls ReactDOM.render a React element', () => {
    const renderer = createDomRenderer();
    renderer(<span />);

    expect(getElementFromRenderCall()).toEqual(<span />);
  });

  it('calls ReactDOM.render targeted element', () => {
    const renderer = createDomRenderer(loaderOpts);
    renderer(<span />);

    const container = getContainerFromRenderCall();
    expect(container).toBe(rootEl);
  });

  it('calls ReactDOM.unmountComponentAtNode on unmount', () => {
    const renderer = createDomRenderer(loaderOpts);
    const wrapper = renderer(<span />);
    wrapper.unmount();

    expect(unmountComponentAtNode).toHaveBeenCalledWith(rootEl);
  });
});
