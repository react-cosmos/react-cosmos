import React from 'react';
import {
  RendererConfig,
  RendererSearchParams,
  UserModuleWrappers,
} from 'react-cosmos-core';
import { NextFixtureLoader } from 'react-cosmos-next';

type NextCosmosRendererArgs = {
  rendererConfig: RendererConfig;
  moduleWrappers: UserModuleWrappers;
};

type NextCosmosRendererProps = {
  searchParams: RendererSearchParams;
};

export function nextCosmosRenderer({
  rendererConfig,
  moduleWrappers,
}: NextCosmosRendererArgs) {
  return function NextCosmosRenderer({
    searchParams,
  }: NextCosmosRendererProps) {
    return (
      <NextFixtureLoader
        rendererConfig={rendererConfig}
        moduleWrappers={moduleWrappers}
        searchParams={searchParams}
      />
    );
  };
}
