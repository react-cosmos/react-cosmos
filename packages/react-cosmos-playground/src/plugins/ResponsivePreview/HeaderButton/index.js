// @flow

import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import { ResponsiveIcon } from '../../../components/SvgIcon';
import {
  getPluginState,
  setPluginState,
  getFixtureViewport,
  getLastViewportFromBrowserHistory
} from '../shared';
import styles from '../../../components/ComponentPlayground/index.less';

import type { Node } from 'react';
import type { UiContextParams } from '../../../context';

type Props = {
  children: Node,
  uiContext: UiContextParams
};

export class HeaderButton extends Component<Props> {
  static defaultProps = {
    // React Nodes can be undefined, but render methods cannot return undefined.
    children: null
  };

  handleButtonClick = async () => {
    const { uiContext } = this.props;
    const { state, editFixture } = this.props.uiContext;
    const pluginState = getPluginState(uiContext);
    const fixtureViewport = getFixtureViewport(uiContext);

    if (fixtureViewport || pluginState.enabled) {
      // Untoggling previously enabled responsive mode, or a fixture with
      // viewport inside
      editFixture({
        ...state.fixtureBody,
        viewport: undefined
      });

      // From here on responsive controls will not be shown for fixtures
      // without a viewport defined
      setPluginState(uiContext, {
        enabled: false
      });
    } else {
      const viewport =
        pluginState.viewport || (await getLastViewportFromBrowserHistory());

      editFixture({
        ...state.fixtureBody,
        viewport
      });

      setPluginState(uiContext, {
        enabled: true,
        viewport
      });
    }
  };

  render() {
    const { children, uiContext } = this.props;
    const { options, urlParams } = uiContext;

    if (options.platform !== 'web') {
      return children;
    }

    const { fixture } = urlParams;
    const pluginState = getPluginState(uiContext);
    const fixtureViewport = getFixtureViewport(uiContext);

    const responsiveClassNames = classNames(styles.button, {
      [styles.selectedButton]: pluginState.enabled || fixtureViewport
    });

    return (
      <Fragment>
        {children}
        {fixture && (
          <button
            className={responsiveClassNames}
            onClick={this.handleButtonClick}
          >
            <ResponsiveIcon />
          </button>
        )}
      </Fragment>
    );
  }
}
