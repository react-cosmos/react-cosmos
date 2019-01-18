// @flow

import type { IPluginContext } from 'react-plugin';
import type { FixtureState } from 'react-cosmos-shared2/fixtureState';
import type { RendererId, FixtureNames } from 'react-cosmos-shared2/renderer';
import type { RendererCoordinatorConfig } from '../../../index.js.flow';

export type RendererCoordinatorState = {
  connectedRendererIds: RendererId[],
  primaryRendererId: null | RendererId,
  fixtures: FixtureNames,
  fixtureState: null | FixtureState
};

export type RendererContext = IPluginContext<
  RendererCoordinatorConfig,
  RendererCoordinatorState
>;
