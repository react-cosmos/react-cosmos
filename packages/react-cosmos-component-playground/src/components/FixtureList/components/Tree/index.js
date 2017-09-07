import React, { Component } from 'react';

import styles from './index.less';

import Node from './components/Node';
import TreeService from './service';

class Tree extends Component {
  service = new TreeService({
    selected: this.props.selectedPath ? [this.props.selectedPath] : undefined,
    tree: this.props.tree,
    paths: this.props.paths,
    fixtures: this.props.fixtures
  });

  render() {
    const { tree } = this.state;
    return (
      <div className={styles.nodeTree}>
        {this.renderTree(tree)}
      </div>
    );
  }

  renderTree = tree => {
    if (!tree) {
      return null;
    }
    let nodes = Object.values(tree);
    nodes = [...nodes.filter(isLeaf), ...nodes.filter(isNode)];
    return nodes.map(node =>
      <Node
        key={node.path}
        treeService={this.service}
        onLeafClick={this.props.onLeafClick}
        {...node}
      >
        {this.renderTree(node.children)}
      </Node>
    );
  };

  componentWillReceiveProps(nextProps) {
    if (!deepEqual(nextProps.fixtures, this.props.fixtures)) {
      this.service.rebuildFromFixtures(nextProps.fixtures);
    }
    if (!deepEqual(nextProps.paths, this.props.paths)) {
      this.service.rebuildFromPaths(nextProps.paths);
    }
    if (nextProps.tree !== this.props.tree) {
      const takeOnlyNewBranches = true;
      this.service.update(nextProps.tree, takeOnlyNewBranches);
    }
    if (this.props.selectedPath !== nextProps.selectedPath) {
      this.service.select(nextProps.selectedPath);
    }
  }

  componentWillMount() {
    this.setState(() => this.service.getState());
    this.unsubscribeService = this.service.subscribe(({ tree, selected }) => {
      this.setState(() => ({ tree, selected }));
    });
  }

  componentDidMount() {
    if (this.props.onReady) {
      this.props.onReady(this.service);
    }
  }

  componentWillUnmount() {
    this.unsubscribeService();
  }
}

export default Tree;

function isLeaf({ isLeaf }) {
  return isLeaf;
}
function isNode({ isLeaf }) {
  return !isLeaf;
}

function deepEqual(object1, object2) {
  return JSON.stringify(object1) === JSON.stringify(object2);
}
