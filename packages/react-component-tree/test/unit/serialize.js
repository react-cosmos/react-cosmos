import React from 'react';
import { renderIntoDocument } from 'react-dom/test-utils';
import { serialize } from '../../src/serialize';

describe('UNIT Serialize', () => {
  class ChildComponent extends React.Component {
    render() {
      return React.DOM.span();
    }
  }

  class ParentComponent extends React.Component {
    render() {
      return React.createElement(ChildComponent, { ref: 'child' });
    }
  }

  class GrandparentComponent extends React.Component {
    render() {
      return React.createElement(ParentComponent, { ref: 'child' });
    }
  }

  const render = (Component, props) =>
    renderIntoDocument(React.createElement(Component, props));

  it('should extract component props', () => {
    const component = render(ChildComponent, { foo: 'bar' });

    expect(serialize(component).foo).to.equal('bar');
  });

  it('should extract component state', () => {
    const component = render(ChildComponent);
    component.setState({ foo: 'bar' });

    expect(serialize(component).state.foo).to.equal('bar');
  });

  it('should not add .state key on empty state', () => {
    const component = render(ChildComponent, { foo: 'bar' });

    expect(serialize(component).state).to.be.undefined;
  });

  it('should extract child component state', () => {
    const component = render(ParentComponent);
    component.refs.child.setState({ foo: 'bar' });

    expect(serialize(component).state.children.child.foo).to.equal('bar');
  });

  it('should not add .children key on children with empty state', () => {
    const component = render(ParentComponent);
    component.setState({ foo: 'bar' });

    expect(serialize(component).state.children).to.be.undefined;
  });

  it('should extract child state recursively', () => {
    const component = render(GrandparentComponent);
    component.refs.child.refs.child.setState({ foo: 'bar' });

    expect(serialize(component).state.children.child.children.child.foo)
          .to.equal('bar');
  });
});
