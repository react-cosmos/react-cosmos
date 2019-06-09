import { FixtureElementId } from 'react-cosmos-shared2/fixtureState';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import { TreeExpansion } from '../../shared/ui';

export type FixtureExpansion = Record<string, void | TreeExpansion>;

export type PropsExpansion = Record<string, void | FixtureExpansion>;

export type OnElementExpansionChange = (
  elementId: FixtureElementId,
  treeExpansion: TreeExpansion
) => unknown;

export function stringifyElementId(elementId: FixtureElementId) {
  const { decoratorId, elPath } = elementId;
  return elPath ? `${decoratorId}-${elPath}` : decoratorId;
}

export function stringifyFixtureId(fixtureId: FixtureId) {
  const { path, name } = fixtureId;
  return name ? `${path}-${name}` : path;
}
