/* eslint-env node, mocha, browser */
/* eslint-disable react/no-find-dom-node */
/* global expect, sinon */

import React from 'react';
import { render } from '../../src/render.js';

const ReactDOM = require('react-dom-polyfill')(React);

describe('INTEGRATION Render', () => {
  const children = [React.createElement('span', {
    key: '1',
    children: 'test child',
  })];

  let domContainer;
  let component;

  class Component extends React.Component {
    render() {
      return React.DOM.span();
    }
  }

  beforeEach(() => {
    domContainer = document.createElement('div');

    component = render({
      component: Component,
      snapshot: {
        foo: 'bar',
        children,
      },
      container: domContainer,
    });
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(domContainer);
  });

  it('should create component with correct props', () => {
    expect(component.props.foo).to.equal('bar');
  });

  it('should receive children through props', () => {
    expect(component.props.children).to.be.equal(children);
  });

  it('should render in given container', () => {
    expect(ReactDOM.findDOMNode(component).parentNode).to.equal(domContainer);
  });
});
