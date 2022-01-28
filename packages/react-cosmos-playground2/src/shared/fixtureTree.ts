import { isEqual } from 'lodash';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import {
  FixtureTreeNode,
  MultiFixtureTreeNodeData,
} from 'react-cosmos-shared2/fixtureTree';

export function multiFixtureContainsFixtureId(
  { fixturePath, fixtureIds }: MultiFixtureTreeNodeData,
  fixtureId: FixtureId
) {
  return (
    (fixtureId.path === fixturePath && fixtureId.name === undefined) ||
    Object.keys(fixtureIds).some(fixtureName =>
      isEqual(fixtureIds[fixtureName], fixtureId)
    )
  );
}

export function nodeContainsFixtureId(
  { data, children }: FixtureTreeNode,
  fixtureId: FixtureId
): boolean {
  if (data.type === 'fixture') return isEqual(data.fixtureId, fixtureId);

  if (data.type === 'multiFixture')
    return multiFixtureContainsFixtureId(data, fixtureId);

  return (
    children !== undefined &&
    Object.keys(children).some(childName =>
      nodeContainsFixtureId(children[childName], fixtureId)
    )
  );
}
