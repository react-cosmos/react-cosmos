// @flow

import {
  importModule,
  getNormalizedFixtureModules,
  getOldSchoolFixturesFromNewStyleComponents
} from 'react-cosmos-shared';
import { getComponents } from 'react-cosmos-voyager2/client';
import getUserModules from './user-modules';
import { mount } from 'react-cosmos-loader/dom';
import { dismissRuntimeErrors } from 'react-error-overlay';

import type { LoaderWebOpts } from 'react-cosmos-flow/loader';

declare var COSMOS_CONFIG: LoaderWebOpts;

const loaderOpts: LoaderWebOpts = COSMOS_CONFIG;

export default function({ isDev }: { isDev: boolean } = {}) {
  const {
    fixtureModules,
    fixtureFiles,
    deprecatedComponentModules,
    proxies
  } = getUserModules();

  const newStyleComponents = getComponents({
    fixtureModules: getNormalizedFixtureModules(
      fixtureModules,
      fixtureFiles,
      deprecatedComponentModules
    ),
    fixtureFiles
  });
  const fixtures = getOldSchoolFixturesFromNewStyleComponents(
    newStyleComponents
  );

  mount({
    proxies: importModule(proxies),
    fixtures,
    loaderOpts,
    // Send a noop callback for `dismissRuntimeErrors` when exporting, because
    // react-error-overlay is only initialized in `development` env
    dismissRuntimeErrors: isDev ? dismissRuntimeErrors : () => {}
  });
}
