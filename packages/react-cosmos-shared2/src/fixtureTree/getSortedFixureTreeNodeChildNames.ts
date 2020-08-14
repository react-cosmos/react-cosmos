import { FixtureTreeNode } from './shared/types';

// TODO: Use this in playground
export function getSortedFixureTreeNodeChildNames(
  nodeType: 'fileDir' | 'multiFixture',
  children: Record<string, FixtureTreeNode>
): string[] {
  const childNames = Object.keys(children);

  // Original fixture order is preserved in multi fixtures
  if (nodeType === 'multiFixture') return childNames;

  const dirChildNames = childNames.filter(
    childName => children[childName].data.type === 'fileDir'
  );
  const fixtureChildNames = childNames.filter(
    childName => children[childName].data.type !== 'fileDir'
  );

  // Group per dirs vs fixture & multi fuxtures, and sort alphabetically within
  // each group
  return [...dirChildNames.sort(), ...fixtureChildNames.sort()];
}
