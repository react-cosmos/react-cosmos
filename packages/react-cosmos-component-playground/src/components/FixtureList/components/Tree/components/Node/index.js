import React, { Component } from 'react';

import FolderArrow from './icons/FolderArrow';
import DefaultFolderIcon from './icons/DefaultFolderIcon';
import DefaultFileIcon from './icons/DefaultFileIcon';

import styles from './index.less';

export default class TreeNode extends Component {
  render() {
    const { open, Icon, name, children, path, isLeaf, active } = this.props;
    return (
      <div className={styles.node}>
        <button
          data-path={`${path}`}
          className={[
            styles.nodeNameContainer,
            isLeaf ? styles.isLeaf : styles.isNode,
            active && styles.active
          ].join(' ')}
          title={path}
          onClick={isLeaf ? this.selectNode : this.toggleOpen}
        >
          <div className={styles.nodeArrow}>
            {children && <FolderArrow open={open} />}
          </div>
          <div className={styles.nodeIcon}>
            {Icon
              ? <Icon />
              : isLeaf ? <DefaultFileIcon /> : <DefaultFolderIcon />}
          </div>
          {name &&
            <div className={styles.nodeName}>
              {name}
            </div>}
        </button>
        {children &&
          open &&
          <div className={styles.nodeChildren}>
            {children}
          </div>}
      </div>
    );
  }

  toggleOpen = () => {
    if (this.props.treeService) {
      this.props.treeService.toggleOpen(this.props.path);
    }
    if (this.props.onNodeClick) {
      this.props.onNodeClick(this.props);
    }
  };

  selectNode = event => {
    if (this.props.treeService) {
      this.props.treeService.select(
        this.props.path,
        event.ctrlKey || event.shiftKey
      );
    }
    if (this.props.onLeafClick) {
      this.props.onLeafClick(this.props);
    }
  };
}
