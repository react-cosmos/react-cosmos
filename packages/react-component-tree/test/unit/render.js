/* eslint-env node, mocha, browser */
/* eslint-disable no-unused-expressions */
/* global expect, sinon */

import React from 'react';
import { render } from '../../src/render.js';

const ReactDOM = require('react-dom-polyfill')(React);

describe('UNIT Render', () => {
  const children = [React.createElement('span', {
    key: '1',
    children: 'test child',
  })];

  let domContainer;

  class Component extends React.Component {
    render() {
      return React.DOM.span();
    }
  }

  beforeEach(() => {
    sinon.spy(React, 'createElement');
    sinon.stub(ReactDOM, 'render');

    domContainer = document.createElement('div');

    render({
      component: Component,
      snapshot: {
        foo: 'bar',
        children,
      },
      container: domContainer,
    });
  });

  afterEach(() => {
    React.createElement.restore();
    ReactDOM.render.restore();
  });

  it('should create element for component', () => {
    const args = React.createElement.lastCall.args;
    expect(args[0]).to.equal(Component);
  });

  it('should create element with props', () => {
    const args = React.createElement.lastCall.args;
    expect(args[1].foo).to.equal('bar');
  });

  it('should omit children from props', () => {
    const args = React.createElement.lastCall.args;
    expect(args[1].children).to.be.undefined;
  });

  it('should create element with children', () => {
    const args = React.createElement.lastCall.args;
    expect(args[2]).to.be.equal(children);
  });

  it('should render created element', () => {
    const args = ReactDOM.render.lastCall.args;
    expect(args[0]).to.equal(React.createElement.returnValues[0]);
  });

  it('should render in given container', () => {
    const args = ReactDOM.render.lastCall.args;
    expect(args[1]).to.equal(domContainer);
  });
});
