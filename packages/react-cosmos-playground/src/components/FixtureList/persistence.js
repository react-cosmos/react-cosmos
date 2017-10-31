import localForage from 'localforage';
import flatMapDeep from 'lodash.flatmapdeep';

const TREE_EXPANSION_STATE = '__cosmos__tree-expansion-state';

export async function getSavedExpansionState(projectKey) {
  const value = await localForage.getItem(
    `${TREE_EXPANSION_STATE}-${projectKey}`
  );
  return value !== null ? value : {};
}

function setSavedExpansionState(projectKey, value) {
  return localForage.setItem(`${TREE_EXPANSION_STATE}-${projectKey}`, value);
}

export function updateLocalToggleState(projectKey, path, expanded) {
  getSavedExpansionState(projectKey).then(currentState => {
    setSavedExpansionState(projectKey, {
      ...currentState,
      [path]: expanded
    });
  });
}

function fixtureTreeToPathArray(fixtureTree) {
  return flatMapDeep(fixtureTree, node => {
    // Leaf nodes (fixtures) don't have a path because they don't have an
    // expanded state
    if (!node.path) {
      return [];
    }

    const paths = [node.path];

    if (node.children) {
      // Get all paths from current node's subtree
      paths.push(fixtureTreeToPathArray(node.children));
    }

    return paths;
  });
}

export function pruneUnusedExpansionState(
  projectKey,
  savedExpansionState,
  fixtureTree
) {
  const pathArray = fixtureTreeToPathArray(fixtureTree);
  const prunedExpansionState = { ...savedExpansionState };
  const paths = Object.keys(savedExpansionState);
  paths.forEach(path => {
    if (pathArray.indexOf(path) === -1) {
      delete prunedExpansionState[path];
    }
  });
  setSavedExpansionState(projectKey, prunedExpansionState);
}
