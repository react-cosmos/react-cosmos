// @flow

import React, { Fragment } from 'react';
import { Plugin, Plug, Slot } from 'react-plugin';
import classNames from 'classnames';
import { uri } from 'react-querystring-router';
import { UiContext } from '../context';
import { ResponsiveIcon } from '../components/SvgIcon';
import ResponsivePreview from '../components/ResponsiveLoader';
// TODO: Refactor CP and export styled-components to use in plugins
import styles from '../components/ComponentPlayground/index.less';

import type { UiContextParams } from '../context';

export default (
  <Plugin name="Responsive Preview">
    <Plug slot="preview" render={PreviewSlot} />
    <Plug slot="header-buttons" render={RenderButtonsSlot} />
  </Plugin>
);

function RenderButtonsSlot({ children }) {
  return (
    <Slot name="header-buttons">
      <UiContext.Consumer>
        {({
          options,
          urlParams,
          state,
          router,
          getCleanUrlParams
        }: UiContextParams) => {
          if (options.platform !== 'web') {
            return children;
          }

          const { component, fixture, editor, responsive } = urlParams;
          const { fixtureBody } = state;

          const showResponsiveControls =
            responsive === 'forceHide'
              ? false
              : fixtureBody.viewport || responsive;

          const nextResponsive =
            responsive === 'forceHide'
              ? true
              : fixtureBody.viewport
                ? 'forceHide'
                : !responsive;

          const responsiveClassNames = classNames(styles.button, {
            [styles.selectedButton]: showResponsiveControls
          });

          const responsiveUrl = uri.stringifyParams(
            getCleanUrlParams({
              component,
              fixture,
              editor,
              responsive: nextResponsive
            })
          );

          return (
            <Fragment>
              {children}
              {fixture && (
                <a
                  className={responsiveClassNames}
                  href={responsiveUrl}
                  onClick={router.routeLink}
                >
                  <ResponsiveIcon />
                </a>
              )}
            </Fragment>
          );
        }}
      </UiContext.Consumer>
    </Slot>
  );
}

function PreviewSlot({ children }) {
  return (
    <Slot name="preview">
      <UiContext.Consumer>
        {({ options, urlParams, state, onFixtureEdit }: UiContextParams) => {
          if (options.platform !== 'web') {
            return children;
          }

          const { responsiveDevices } = options;
          const { responsive } = urlParams;
          const { fixtureBody } = state;

          const showResponsiveControls =
            responsive === 'forceHide'
              ? false
              : fixtureBody.viewport || responsive || false;

          return (
            <ResponsivePreview
              showResponsiveControls={showResponsiveControls}
              devices={responsiveDevices || []}
              onFixtureUpdate={updatedFields =>
                onFixtureEdit({
                  ...fixtureBody,
                  ...updatedFields
                })
              }
              fixture={fixtureBody.name ? fixtureBody : null}
            >
              {children}
            </ResponsivePreview>
          );
        }}
      </UiContext.Consumer>
    </Slot>
  );
}
