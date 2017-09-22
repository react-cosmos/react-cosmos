// Adapted from https://github.com/alexcurtis/react-treebeard

// Helper functions for search filtering
export const defaultMatcher = (filterText, node) => {
  return node.name.toLowerCase().indexOf(filterText.toLowerCase()) !== -1;
};

export const findNode = (node, filter, matcher) => {
  return (
    matcher(filter, node) || // i match
    (node.children && // or i have decendents and one of them match
      node.children.length &&
      Boolean(node.children.find(child => findNode(child, filter, matcher))))
  );
};

export const filterTree = (node, filter, matcher = defaultMatcher) => {
  // The root object can be an array
  if (node.constructor === Array) {
    const filtered = node
      .filter(child => findNode(child, filter, matcher))
      .map(child => filterTree(child, filter, matcher));
    return filtered;
  }
  // If im an exact match then all my children get to stay
  if (matcher(filter, node) || !node.children) {
    return { ...node, expanded: true };
  }
  // If not then only keep the ones that match or have matching descendants
  const filtered = node.children
    .filter(child => findNode(child, filter, matcher))
    .map(child => filterTree(child, filter, matcher));
  return { ...node, expanded: true, children: filtered };
};
