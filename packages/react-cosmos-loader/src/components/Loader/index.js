import React, { Component } from 'react';
import { func, object, arrayOf } from 'prop-types';
import { createLinkedList } from 'react-cosmos-shared';
import { createModuleType } from '../../utils/module-type';
import { PropsProxy } from '../PropsProxy';

export class Loader extends Component {
  static propTypes = {
    fixture: createModuleType(object).isRequired,
    proxies: arrayOf(createModuleType(func)),
    onComponentRef: func
  };

  static defaultProps = {
    proxies: []
  };

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

function createProxyLinkedList(userProxies) {
  return createLinkedList([...userProxies, PropsProxy]);
}

function noope() {}
