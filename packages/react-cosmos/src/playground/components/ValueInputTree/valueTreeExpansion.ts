import { clone, setWith } from 'lodash';
import { FixtureElementId } from '../../../core/fixtureState/types';
import { FixtureId } from '../../../core/types';
import { TreeExpansion } from '../../shared/treeExpansion';
import { stringifyElementId, stringifyFixtureId } from './shared';

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
  const valuePath = createElementExpansionPath(fixtureId, elementId);
  // Inspired by https://github.com/lodash/lodash/issues/1696#issuecomment-328335502
  return setWith(clone(groupExpansion), valuePath, treeExpansion, clone);
}

function createElementExpansionPath(
  fixtureId: FixtureId,
  elementId: FixtureElementId
): string[] {
  const strFixtureId = stringifyFixtureId(fixtureId);
  const strElementId = stringifyElementId(elementId);
  return [strFixtureId, strElementId];
}
