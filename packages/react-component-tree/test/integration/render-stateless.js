/* eslint-env node, mocha, browser */
/* global expect, sinon */

import React from 'react';
import { render } from '../../src/render.js';

const ReactDOM = require('react-dom-polyfill')(React);

describe('INTEGRATION Render stateless component', () => {
  const children = [React.createElement('span', {
    key: '1',
    children: 'test child',
  })];

  let domContainer;

  const StatelessComponent = (props) =>
    // eslint-disable-next-line react/jsx-filename-extension, react/prop-types
    <div>{props.children ? props.children : props.foo}</div>;

  beforeEach(() => {
    domContainer = document.createElement('div');
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(domContainer);
  });

  it('should render component using correct props', () => {
    render({
      component: StatelessComponent,
      snapshot: {
        foo: 'bar',
      },
      container: domContainer,
    });

    expect(domContainer.innerText).to.equal('bar');
  });

  it('should receive children through props', () => {
    render({
      component: StatelessComponent,
      snapshot: {
        children,
      },
      container: domContainer,
    });

    expect(domContainer.innerText).to.equal('test child');
  });
});
