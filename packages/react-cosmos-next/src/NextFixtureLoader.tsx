import React from 'react';
import {
  RendererConfig,
  StringRendererSearchParams,
  UserModuleWrappers,
} from 'react-cosmos-core';
import { ServerFixtureLoader } from 'react-cosmos-renderer';
import { NextRendererProvider } from './NextRendererProvider.js';

type Props = {
  rendererConfig: RendererConfig;
  moduleWrappers: UserModuleWrappers;
  searchParams: StringRendererSearchParams;
};
export function NextFixtureLoader({
  rendererConfig,
  moduleWrappers,
  searchParams,
}: Props) {
  return (
    <NextRendererProvider
      rendererConfig={rendererConfig}
      searchParams={searchParams}
    >
      <ServerFixtureLoader
        searchParams={searchParams}
        moduleWrappers={moduleWrappers}
      />
    </NextRendererProvider>
  );
}
