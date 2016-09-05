/* eslint-env node, mocha, browser */
/* global expect, sinon */

import React from 'react';
import { render } from '../../src/render.js';

const ReactDOM = require('react-dom-polyfill')(React);

describe('INTEGRATION Render and inject state', () => {
  let domContainer;
  let component;

  class ChildComponent extends React.Component {
    render() {
      return React.DOM.span();
    }
  }

  // eslint-disable-next-line react/prefer-stateless-function, react/no-multi-comp
  class ParentComponent extends React.Component {
    render() {
      return React.createElement(ChildComponent, { ref: 'child' });
    }
  }

  // eslint-disable-next-line react/prefer-stateless-function, react/no-multi-comp
  class GrandparentComponent extends React.Component {
    render() {
      return React.createElement(ParentComponent, { ref: 'child' });
    }
  }

  beforeEach(() => {
    domContainer = document.createElement('div');
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(domContainer);
  });

  it('should set state on root component', () => {
    component = render({
      component: GrandparentComponent,
      snapshot: {
        state: { foo: 'bar' },
      },
      container: domContainer,
    });

    expect(component.state.foo).to.equal('bar');
  });

  it('should set state on child component', () => {
    component = render({
      component: GrandparentComponent,
      snapshot: {
        state: {
          children: {
            child: { foo: 'bar' },
          },
        },
      },
      container: domContainer,
    });

    expect(component.refs.child.state.foo).to.equal('bar');
  });

  it('should set state on grandchild component', () => {
    component = render({
      component: GrandparentComponent,
      snapshot: {
        state: {
          children: {
            child: {
              children: {
                child: { foo: 'bar' },
              },
            },
          },
        },
      },
      container: domContainer,
    });

    expect(component.refs.child.refs.child.state.foo).to.equal('bar');
  });
});
