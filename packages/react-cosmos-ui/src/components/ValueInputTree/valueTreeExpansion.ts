import {
  FixtureElementId,
  FixtureId,
  stringifyFixtureId,
} from 'react-cosmos-core';
import { TreeExpansion } from '../../shared/treeExpansion.js';
import { stringifyElementId } from './shared.js';

export type FixtureExpansion = Record<string, void | TreeExpansion>;

export type FixtureExpansionGroup = Record<string, void | FixtureExpansion>;

export type OnElementExpansionChange = (
  elementId: FixtureElementId,
  treeExpansion: TreeExpansion
) => unknown;

const DEFAULT_EXPANSION = {};

export function getFixtureExpansion(
  groupExpansion: FixtureExpansionGroup,
  fixtureId: FixtureId
): FixtureExpansion {
  return groupExpansion[stringifyFixtureId(fixtureId)] || DEFAULT_EXPANSION;
}

export function updateElementExpansion(
  groupExpansion: FixtureExpansionGroup,
  fixtureId: FixtureId,
  elementId: FixtureElementId,
  treeExpansion: TreeExpansion
): FixtureExpansionGroup {
  const strFixtureId = stringifyFixtureId(fixtureId);
  const strElementId = stringifyElementId(elementId);
  return {
    ...groupExpansion,
    [strFixtureId]: {
      ...(groupExpansion[strFixtureId] as FixtureExpansion | undefined),
      [strElementId]: treeExpansion,
    },
  };
}
