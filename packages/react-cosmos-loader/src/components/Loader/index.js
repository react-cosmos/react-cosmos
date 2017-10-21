import React, { Component } from 'react';
import { func, object, arrayOf } from 'prop-types';
import createLinkedList from 'react-cosmos-utils/lib/linked-list';
import createModuleType from '../../utils/module-type';
import PropsProxy from '../PropsProxy';

const noope = () => {};

const createProxyLinkedList = userProxies =>
  createLinkedList([...userProxies, PropsProxy]);

class Loader extends Component {
  /**
   * Loader for rendering React components in isolation.
   *
   * Renders components using fixtures and Proxy middleware. Initialized via
   * props.
   */
  constructor(props) {
    super(props);

    this.firstProxy = createProxyLinkedList(props.proxies);
  }

  componentWillReceiveProps({ proxies }) {
    if (proxies !== this.props.proxies) {
      this.firstProxy = createProxyLinkedList(proxies);
    }
  }

  render() {
    const { firstProxy } = this;
    const { fixture, onComponentRef, onFixtureUpdate } = this.props;

    return (
      <firstProxy.value
        nextProxy={firstProxy.next()}
        fixture={fixture}
        onComponentRef={onComponentRef || noope}
        onFixtureUpdate={onFixtureUpdate || noope}
      />
    );
  }
}

Loader.propTypes = {
  fixture: createModuleType(object).isRequired,
  proxies: arrayOf(createModuleType(func)),
  onComponentRef: func
};

Loader.defaultProps = {
  proxies: []
};

export default Loader;
