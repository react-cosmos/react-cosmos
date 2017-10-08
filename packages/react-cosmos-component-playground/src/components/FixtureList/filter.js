// Adapted from https://github.com/alexcurtis/react-treebeard
import { match } from 'fuzzaldrin-plus';

// Helper functions for search filtering
const matcher = (filterText, node) => {
  const matchText = node.urlParams
    ? `${node.urlParams.component}${node.urlParams.fixture}`
    : node.name;
  return match(matchText, filterText).length > 0;
};

const findNode = (node, filterText) =>
  matcher(filterText, node) || // i match
  (node.children && // or i have decendents and one of them match
    node.children.length &&
    Boolean(node.children.find(childNode => findNode(childNode, filterText))));

const filterNode = (node, filterText) => {
  // If im an exact match then all my children get to stay
  if (matcher(filterText, node) || !node.children) {
    return { ...node, expanded: true };
  }
  // If not then only keep the ones that match or have matching descendants
  // eslint-disable-next-line no-use-before-define
  const filteredChildren = filterNodeArray(node.children, filterText);
  return { ...node, expanded: true, children: filteredChildren };
};

const filterNodeArray = (nodeArray, filterText) =>
  nodeArray
    .filter(node => findNode(node, filterText))
    .map(node => filterNode(node, filterText));

export default filterNodeArray;
