// @flow

import React, { Fragment } from 'react';
import { Slot } from 'react-plugin';
import classNames from 'classnames';
import { UiContext } from '../../../context';
import { ResponsiveIcon } from '../../../components/SvgIcon';
import { getLastViewportFromBrowserHistory } from '../shared';
// TODO: Refactor CP and export styled-components to use in plugins
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
        {({ options, urlParams, state, onFixtureEdit }: UiContextParams) => {
          if (options.platform !== 'web') {
            return children;
          }

          const isFixtureSelected = Boolean(urlParams.fixture);
          const isResponsiveFixture = Boolean(state.fixtureBody.viewport);

          const responsiveClassNames = classNames(styles.button, {
            [styles.selectedButton]: isResponsiveFixture
          });

          return (
            <Fragment>
              {children}
              {isFixtureSelected && (
                <button
                  className={responsiveClassNames}
                  onClick={async () => {
                    onFixtureEdit({
                      ...state.fixtureBody,
                      viewport: isResponsiveFixture
                        ? undefined
                        : await getLastViewportFromBrowserHistory()
                    });
                  }}
                >
                  <ResponsiveIcon />
                </button>
              )}
            </Fragment>
          );
        }}
      </UiContext.Consumer>
    </Slot>
  );
}
