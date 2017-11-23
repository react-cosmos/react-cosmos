// @flow

import React, { Component } from 'react';

import type { ElementRef } from 'react';
import type { ProxyProps } from 'react-cosmos-shared/src/react/types';

// Returning a class creator to be consistent with the other proxies and to be
// able to add options in the future without breaking API
export default function createInitCallbackProxy() {
  class InitCallbackProxy extends Component<ProxyProps> {
    onComponentRef = async (compInstance: ?ElementRef<typeof Component>) => {
      const { fixture, onComponentRef } = this.props;

      if (compInstance && fixture.init) {
        await fixture.init(compInstance);
      }

      onComponentRef(compInstance);
    };

    render() {
      const { nextProxy, ...rest } = this.props;
      return (
        <nextProxy.value
          {...rest}
          nextProxy={nextProxy.next()}
          onComponentRef={this.onComponentRef}
        />
      );
    }
  }

  return InitCallbackProxy;
}
