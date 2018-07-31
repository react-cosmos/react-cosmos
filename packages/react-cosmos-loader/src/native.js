// @flow

import React, { Component } from 'react';
// https://github.com/facebook/react-native/issues/19797
// $FlowFixMe
import { View, Text, NativeModules } from 'react-native';
import io from 'socket.io-client';
import parse from 'url-parse';
import {
  importModule,
  getNormalizedFixtureModules,
  getOldSchoolFixturesFromNewStyleComponents
} from 'react-cosmos-shared';
import { getComponents } from 'react-cosmos-voyager2/client';
import { connectLoader } from './connect-loader';

import type { Element } from 'react';
import type { Modules, FixtureFile } from 'react-cosmos-flow/module';
import type { Proxy } from 'react-cosmos-flow/proxy';
import type { LoaderNativeOpts, LoaderMessage } from 'react-cosmos-flow/loader';

type EsModule<DefaultExport> = {
  __esModule: true,
  default: DefaultExport
};

type Props = {
  options: LoaderNativeOpts,
  modules: {
    fixtureModules: Modules,
    fixtureFiles: Array<FixtureFile>,
    proxies: Array<Proxy> | EsModule<Array<Proxy>>
  }
};

type State = {
  element: ?Element<any>
};

let socket;
let destroyLoader;

export class CosmosNativeLoader extends Component<Props, State> {
  state = {
    element: null
  };

  unmounted = false;

  componentDidMount() {
    this.initLoader();
  }

  componentWillUnmount() {
    this.unmounted = true;

    if (destroyLoader) {
      destroyLoader();
    }
  }

  render() {
    const { element } = this.state;

    return (
      element || (
        <View>
          <Text>No fixture selected</Text>
        </View>
      )
    );
  }

  initLoader = async () => {
    const {
      options: { port },
      modules: { fixtureFiles, fixtureModules, proxies }
    } = this.props;

    const components = getComponents({
      fixtureFiles,
      fixtureModules: getNormalizedFixtureModules(fixtureModules, fixtureFiles)
    });
    const fixtures = getOldSchoolFixturesFromNewStyleComponents(components);

    socket = io(getSocketUrl(port));

    destroyLoader = await connectLoader({
      renderer: this.loaderRenderer,
      proxies: importModule(proxies),
      fixtures,
      subscribe,
      unsubscribe,
      sendMessage
    });
  };

  loaderRenderer = (element: Element<*>) => {
    this.setState({
      element
    });

    return {
      unmount: () => {
        if (!this.unmounted) {
          this.setState({
            element: null
          });
        }
      }
    };
  };
}

function subscribe(msgHandler) {
  socket.on('cosmos-cmd', msgHandler);
}

function unsubscribe() {
  socket.off('cosmos-cmd');
}

function sendMessage(msg: LoaderMessage) {
  socket.emit('cosmos-cmd', msg);
}

function getSocketUrl(port: number) {
  const host = parse(NativeModules.SourceCode.scriptURL).hostname;

  return `ws://${host}:${port}`;
}
