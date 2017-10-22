import localForage from 'localforage';
import flatMapDeep from 'lodash.flatmapdeep';

const TREE_EXPANSION_STATE = '__cosmos__tree-expansion-state';

export function getSavedExpansionState(projectKey) {
  return localForage.getItem(`${TREE_EXPANSION_STATE}-${projectKey}`);
}

function setSavedExpansionState(projectKey, value) {
  return localForage.setItem(`${TREE_EXPANSION_STATE}-${projectKey}`, value);
}

export function updateLocalToggleState(projectKey, path, expanded) {
  getSavedExpansionState(projectKey).then(state => {
    const currentState = state || {};
    setSavedExpansionState(projectKey, {
      ...currentState,
      [path]: expanded
    });
  });
}

function fixtureTreeToPathArray(fixtureTree) {
  return flatMapDeep(fixtureTree, node => {
    const result = [];
    if (node.path) {
      result.push(node.path);
    }
    if (node.children) {
      result.push(fixtureTreeToPathArray(node.children));
    }
    return result;
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
