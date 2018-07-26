// @flow

import React, { Component, Fragment } from 'react';
import { Slot } from 'react-plugin';
import classNames from 'classnames';
import { UiContext } from '../../../context';
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
  children: Node
};

export function HeaderButtonsSlot({ children }: Props) {
  return (
    <Slot name="header-buttons">
      <UiContext.Consumer>
        {(uiContext: UiContextParams) => (
          <HeaderButton uiContext={uiContext}>{children}</HeaderButton>
        )}
      </UiContext.Consumer>
    </Slot>
  );
}

type HeaderButtonProps = {
  children: Node,
  uiContext: UiContextParams
};

class HeaderButton extends Component<HeaderButtonProps> {
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
    } else if (pluginState.viewport) {
      setPluginState(uiContext, {
        enabled: true,
        viewport: pluginState.viewport
      });
    } else {
      setPluginState(uiContext, {
        enabled: true,
        viewport: await getLastViewportFromBrowserHistory()
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
