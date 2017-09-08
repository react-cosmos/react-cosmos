export default class Tree {
  state = {
    selected: [],
    paths: {},
    tree: {}
  };
  subscribers = [];

  constructor({ tree, selected, paths, fixtures }) {
    this.state.selected = selected || [];
    this.state.paths = fixtures ? mapFixturestoPathsValues(fixtures) : paths;
    this.state.tree = tree || buildTreeFromState(this.state);
    if (selected) {
      this.state.tree = selectPaths(this.state.tree, selected);
    }
  }

  rebuildFromFixtures(fixtures) {
    const paths = mapFixturestoPathsValues(fixtures);
    this.rebuildFromPaths(paths);
  }

  rebuildFromPaths(paths) {
    this.state = {
      ...this.state,
      paths,
      tree: buildTreeFromState({ paths })
    };
    this.publish();
  }

  update(tree, onlyNew = false) {
    this.state.tree = updateTree(this.state.tree, tree, onlyNew);
    this.publish();
  }

  select(path, multiple = false) {
    let { selected, tree } = this.state;

    if (path && multiple) {
      const index = selected.findIndex(selectedPath => path === selectedPath);
      if (~index) {
        selected = [...selected.slice()];
        selected.splice(index, 1);
        tree = deselectPath(tree, path);
      } else {
        selected = [...selected, path];
        tree = selectPath(tree, path);
      }
    } else {
      tree = deselectPaths(tree, selected);
      selected = path ? [path] : [];
      tree = path ? selectPath(tree, path) : tree;
    }

    this.state = {
      ...this.state,
      selected,
      tree
    };

    this.publish();
  }

  toggleOpen(path) {
    this.state.tree = togglePath(this.state.tree, path);
    this.publish();
  }

  getState() {
    return this.state;
  }

  publish() {
    this.subscribers.forEach(sub => sub(this.state));
  }

  subscribe(subscriber) {
    this.subscribers.push(subscriber);
    return () => {
      const index = this.subscribers.findIndex(sub => sub === subscriber);
      if (~index) {
        this.subscribers.splice(index, 1);
      }
    };
  }
}

export function mapFixturestoPathsValues(fixtures = {}) {
  return Object.entries(fixtures).reduce(
    (paths, [component, files]) => ({
      ...paths,
      ...(files.length
        ? files.reduce(
            (fixtures, fixture) => ({
              ...fixtures,
              [`${component}/${fixture}`]: { component, fixture }
            }),
            {}
          )
        : { [`${component}`]: undefined })
    }),
    {}
  );
}

export function buildTreeFromState({ tree = {}, paths = {} }) {
  return Object.keys(paths).reduce(
    (tree, path) => buildTree({ tree, paths }, path.split('/')),
    tree
  );
}

export function buildTree(state, path, index = 0, pathSoFar = '') {
  const { tree = {}, paths = {} } = state;
  const pathFragment = path[index];
  if (!pathFragment) {
    return;
  }

  pathSoFar = pathSoFar ? `${pathSoFar}/${pathFragment}` : pathFragment;

  const node = tree[pathFragment]
    ? tree[pathFragment]
    : {
        path: pathSoFar,
        name: pathFragment,
        isLeaf: paths[pathSoFar] && path.length - 1 === index,
        value: paths[pathSoFar],
        open: true,
        children: {}
      };

  return {
    ...tree,
    [pathFragment]: {
      ...node,
      children: buildTree(
        { tree: node.children, paths },
        path,
        index + 1,
        pathSoFar
      )
    }
  };
}

export function updateTree(oldTree, newTree, onlyNew = false) {
  if (!newTree) {
    return oldTree;
  }
  if (!oldTree) {
    return newTree;
  }
  const allKeys = onlyNew
    ? Object.keys(newTree)
    : Array.from(new Set([...Object.keys(oldTree), ...Object.keys(newTree)]));
  return allKeys.reduce((tree, key) => {
    const oldBranch = oldTree[key];
    const newBranch = newTree[key];
    return {
      ...tree,
      [key]: {
        ...oldBranch,
        ...newBranch,
        children: updateTree(oldBranch.children, newBranch.children, onlyNew)
      }
    };
  }, {});
}

export function deselectPaths(tree, paths) {
  return paths.length === 0
    ? tree
    : paths.reduce((tree, path) => deselectPath(tree, path), tree);
}

export function selectPaths(tree, paths) {
  return paths.length === 0
    ? tree
    : paths.reduce((tree, path) => selectPath(tree, path), tree);
}

export function deselectPath(tree, path) {
  return updatePathToNode(tree, path.split('/'), deselectNode);
}

export function selectPath(tree, path) {
  return updatePathToNode(tree, path.split('/'), selectNode);
}

export function togglePath(tree, path) {
  return updatePathToNode(tree, path.split('/'), toggleOpenNode);
}

export function updatePathToNode(tree, path, nodeFn, index = 0) {
  const fragment = path[index];
  const node = tree[fragment];
  if (!node) {
    throw new Error(
      `path ${path.join('/')} does not exist in Tree starting ${fragment}`
    );
  }

  if (path.length - 1 === index) {
    return {
      ...tree,
      [fragment]: nodeFn(node)
    };
  }

  return {
    ...tree,
    [fragment]: {
      ...node,
      children: updatePathToNode(node.children, path, nodeFn, index + 1)
    }
  };
}

function deselectNode(node) {
  return {
    ...node,
    active: undefined
  };
}

function selectNode(node) {
  return {
    ...node,
    active: true
  };
}

function toggleOpenNode(node) {
  return {
    ...node,
    open: !node.open
  };
}
