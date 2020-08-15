import { isEqual } from 'lodash';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import { FixtureTreeNode } from 'react-cosmos-shared2/fixtureTree';

export function recordContainsFixtureId(
  fixtureIds: Record<string, FixtureId>,
  fixtureId: FixtureId
) {
  return Object.keys(fixtureIds).some(fixtureName =>
    isEqual(fixtureIds[fixtureName], fixtureId)
  );
}

export function nodeContainsFixtureId(
  { data, children }: FixtureTreeNode,
  fixtureId: FixtureId
): boolean {
  if (data.type === 'fixture') return isEqual(data.fixtureId, fixtureId);

  if (data.type === 'multiFixture')
    return recordContainsFixtureId(data.fixtureIds, fixtureId);

  return (
    children !== undefined &&
    Object.keys(children).some(childName =>
      nodeContainsFixtureId(children[childName], fixtureId)
    )
  );
}
