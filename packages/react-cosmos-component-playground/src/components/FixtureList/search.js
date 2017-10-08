// Adapted from https://github.com/alexcurtis/react-treebeard
import { match } from 'fuzzaldrin-plus';

// Helper functions for search filtering
const matcher = (filterText, node) => {
  const matchText = node.urlParams
    ? `${node.urlParams.component}${node.urlParams.fixture}`
    : node.name;
  return match(matchText, filterText).length > 0;
};

const nodeOrChildrenMatch = (node, filterText) =>
  matcher(filterText, node) || // i match
  (node.children && // or i have decendents and one of them match
    node.children.length &&
    Boolean(
      node.children.find(childNode =>
        nodeOrChildrenMatch(childNode, filterText)
      )
    ));

const filterNode = (node, filterText) => {
  if (nodeOrChildrenMatch(node, filterText)) {
    const updatedNode = { ...node, expanded: true };
    if (updatedNode.children) {
      // eslint-disable-next-line no-use-before-define
      updatedNode.children = filterNodeArray(node.children, filterText);
    }
    return updatedNode;
  }
  return { ...node, expanded: false };
};

const filterNodeArray = (nodeArray, filterText) =>
  nodeArray.map(node => filterNode(node, filterText));

export default filterNodeArray;
