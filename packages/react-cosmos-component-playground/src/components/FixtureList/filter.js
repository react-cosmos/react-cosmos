// Adapted from https://github.com/alexcurtis/react-treebeard
import { match } from 'fuzzaldrin-plus';

// Helper functions for search filtering
function matcher(filterText, node) {
  const matchText = node.urlParams
    ? `${node.urlParams.component}${node.urlParams.fixture}`
    : node.name;
  return match(matchText, filterText).length > 0;
}

function findNode(node, filterText) {
  return (
    matcher(filterText, node) || // i match
    (node.children && // or i have decendents and one of them match
      node.children.length &&
      Boolean(node.children.find(childNode => findNode(childNode, filterText))))
  );
}

function filterNode(node, filterText) {
  // If im an exact match then all my children get to stay
  if (matcher(filterText, node) || !node.children) {
    return { ...node, expanded: true };
  }
  // If not then only keep the ones that match or have matching descendants
  const filteredChildren = filterNodeArray(node.children, filterText);
  return { ...node, expanded: true, children: filteredChildren };
}

export default function filterNodeArray(nodeList, filterText) {
  return nodeList
    .filter(node => findNode(node, filterText))
    .map(node => filterNode(node, filterText));
}
