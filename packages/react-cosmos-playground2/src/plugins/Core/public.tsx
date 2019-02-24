import * as React from 'react';
import { Slot } from 'react-plugin';
import { ExcludeChildren, PlugProps } from '../../shared/slot';

export type CoreSpec = {
  name: 'core';
  config: {
    projectId: string;
    fixturesDir: string;
    fixtureFileSuffix: string;
  };
  methods: {
    getProjectId(): string;
    getFixtureFileVars(): { fixturesDir: string; fixtureFileSuffix: string };
  };
};

// TODO: Add support for array slots in react-plugin
export function createGlobalPlug<Props>(
  Component: React.ComponentType<ExcludeChildren<Props>>
): React.ComponentType<PlugProps<Props>> {
  return ({ children, ...otherProps }: PlugProps<Props>) => (
    <>
      {children}
      <Component {...otherProps} />
      <Slot name="global" />
    </>
  );
}
