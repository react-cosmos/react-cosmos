import React from 'react';
import { RendererConfig, UserModuleWrappers } from 'react-cosmos-core';
import { NextFixtureLoader } from './NextFixtureLoader.js';
import { NextCosmosParams } from './nextTypes.js';

export function nextCosmosPage(args: {
  rendererConfig: RendererConfig;
  moduleWrappers: UserModuleWrappers;
  readSearchParams?: boolean;
}) {
  return async function NextCosmosPage(props: {
    params: Promise<NextCosmosParams>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  }) {
    // Accessing searchParams opts the route into dynamic rendering in Next.js.
    // Only read them when explicitly opted in.
    // https://github.com/react-cosmos/react-cosmos/issues/1750
    const searchParams = args.readSearchParams
      ? await props.searchParams
      : {};

    return (
      <NextFixtureLoader
        rendererConfig={args.rendererConfig}
        moduleWrappers={args.moduleWrappers}
        params={await props.params}
        searchParams={searchParams}
      />
    );
  };
}
