import React, { Component } from 'react';
import { func, object, array } from 'prop-types';
import createLinkedList from 'react-cosmos-utils/lib/linked-list';
import PropsProxy from '../PropsProxy';

const noope = () => {};

class Loader extends Component {
  /**
   * Loader for rendering React components in isolation.
   *
   * Renders components using fixtures and Proxy middleware. Initialized via
   * props.
   */
  render() {
    const { proxies, component, fixture, onComponentRef } = this.props;

    const firstProxy = createLinkedList([...proxies, PropsProxy]);

    return (
      <firstProxy.value
        nextProxy={firstProxy.next()}
        component={component}
        fixture={fixture}
        onComponentRef={onComponentRef || noope}
        onFixtureUpdate={noope}
      />
    );
  }
}

Loader.propTypes = {
  component: func.isRequired,
  fixture: object.isRequired,
  proxies: array,
  onComponentRef: func,
};

Loader.defaultProps = {
  proxies: [],
};

export default Loader;
