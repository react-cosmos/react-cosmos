import { FixtureElementId } from 'react-cosmos-shared2/fixtureState';
import { TreeExpansion } from '../../shared/ui';

export type TreeExpansionGroup = Record<string, void | TreeExpansion>;

export type OnElementTreeExpansion = (
  elementId: FixtureElementId,
  treeExpansion: TreeExpansion
) => unknown;

export function stringifyElementId(elementId: FixtureElementId) {
  const { decoratorId, elPath } = elementId;
  return elPath ? `${decoratorId}-${elPath}` : decoratorId;
}
