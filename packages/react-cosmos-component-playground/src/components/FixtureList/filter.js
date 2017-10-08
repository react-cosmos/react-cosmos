// Adapted from https://github.com/alexcurtis/react-treebeard
import { match } from 'fuzzaldrin-plus';

// Helper functions for search filtering
const matcher = (filterText, node) => {
  const matchText = node.urlParams
    ? `${node.urlParams.component}${node.urlParams.fixture}`
    : node.name;
  return match(matchText, filterText).length > 0;
};

const findNode = (node, filter) =>
  matcher(filter, node) || // i match
  (node.children && // or i have decendents and one of them match
    node.children.length &&
    Boolean(node.children.find(child => findNode(child, filter, matcher))));

const filterNode = (node, filter) => {
  // If im an exact match then all my children get to stay
  if (matcher(filter, node) || !node.children) {
    return { ...node, expanded: true };
  }
  // If not then only keep the ones that match or have matching descendants
  // eslint-disable-next-line no-use-before-define
  const filtered = filterNodeArray(node.children, filter);
  return { ...node, expanded: true, children: filtered };
};

const filterNodeArray = (nodeArray, filter) =>
  nodeArray
    .filter(child => findNode(child, filter))
    .map(child => filterNode(child, filter));

export default filterNodeArray;
