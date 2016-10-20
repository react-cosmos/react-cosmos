import React from 'react';
import { renderIntoDocument } from 'react-addons-test-utils';
import { render } from '../../src/render.js';

const ReactDOM = require('react-dom-polyfill')(React);

describe('UNIT Render and inject state', () => {
  let component;

  class ChildComponent extends React.Component {
    render() {
      return React.DOM.span();
    }
  }

  // eslint-disable-next-line react/no-multi-comp
  class ParentComponent extends React.Component {
    render() {
      return React.createElement(ChildComponent, { ref: 'child' });
    }
  }

  // eslint-disable-next-line react/no-multi-comp
  class GrandparentComponent extends React.Component {
    render() {
      return React.createElement(ParentComponent, { ref: 'child' });
    }
  }

  beforeEach(() => {
    component = renderIntoDocument(React.createElement(GrandparentComponent));

    sinon.spy(component, 'setState');
    sinon.spy(component.refs.child, 'setState');
    sinon.spy(component.refs.child.refs.child, 'setState');

    sinon.stub(ReactDOM, 'render').returns(component);
  });

  afterEach(() => {
    ReactDOM.render.restore();
  });

  it('should set state on root component', () => {
    render({
      component: GrandparentComponent,
      snapshot: {
        state: { foo: 'bar' },
      },
    });

    const stateSet = component.setState.lastCall.args[0];
    expect(stateSet.foo).to.equal('bar');
  });

  it('should set state on child component', () => {
    render({
      component: GrandparentComponent,
      snapshot: {
        state: {
          children: {
            child: { foo: 'bar' },
          },
        },
      },
    });

    const stateSet = component.refs.child.setState.lastCall.args[0];
    expect(stateSet.foo).to.equal('bar');
  });

  it('should set state on grandchild component', () => {
    render({
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
    });

    const stateSet = component.refs.child.refs.child.setState.lastCall.args[0];
    expect(stateSet.foo).to.equal('bar');
  });
});
