import React from 'react';
import { RendererConfig, UserModuleWrappers } from 'react-cosmos-core';
import { NextFixtureLoader } from './NextFixtureLoader.js';
import { NextCosmosParams } from './nextTypes.js';

export function nextCosmosPage(args: {
  rendererConfig: RendererConfig;
  moduleWrappers: UserModuleWrappers;
}) {
  return async function NextCosmosPage(props: {
    params: Promise<NextCosmosParams>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  }) {
    // Default to empty search param in static Next.js builds
    async function getSearchParams() {
      try {
        return await props.searchParams;
      } catch (err) {
        return {};
      }
    }

    return (
      <NextFixtureLoader
        rendererConfig={args.rendererConfig}
        moduleWrappers={args.moduleWrappers}
        params={await props.params}
        searchParams={await getSearchParams()}
      />
    );
  };
}
