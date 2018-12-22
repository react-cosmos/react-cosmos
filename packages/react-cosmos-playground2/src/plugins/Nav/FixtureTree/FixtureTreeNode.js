// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import {
  ChevronRightIcon,
  ChevronDownIcon,
  FolderIcon
} from '../../../shared/icons';

import type { TreeNode, TreeExpansion } from './shared';

type Props = {
  node: TreeNode,
  parents: string[],
  treeExpansion: TreeExpansion,
  selectedFixturePath: null | string,
  onSelect: (path: string) => mixed,
  onToggleExpansion: (nodePath: string, expanded: boolean) => mixed
};

export class FixtureTreeNode extends Component<Props> {
  render() {
    const {
      node,
      parents,
      treeExpansion,
      selectedFixturePath,
      onSelect,
      onToggleExpansion
    } = this.props;
    const { fixtures = [], dirs } = node;
    const dirNames = Object.keys(dirs);
    const nodePath = getNodePath(parents);
    const isRootNode = parents.length === 0;
    const isExpanded = isRootNode || treeExpansion[nodePath];

    return (
      <>
        {!isRootNode && (
          <ListItem
            indentLevel={parents.length - 1}
            onClick={() => {
              onToggleExpansion(nodePath, !isExpanded);
            }}
          >
            <CevronContainer>
              {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
            </CevronContainer>
            <FolderContainer>
              <FolderIcon />
            </FolderContainer>
            <Label>{parents[parents.length - 1]}</Label>
          </ListItem>
        )}
        {isExpanded && (
          <>
            {fixtures.map(fixturePath => (
              <ListItem
                key={fixturePath}
                indentLevel={parents.length}
                selected={fixturePath === selectedFixturePath}
                onClick={this.createSelectHandler(fixturePath)}
              >
                <Label>{getCleanFixtureName(fixturePath)}</Label>
              </ListItem>
            ))}
            {dirNames.map(dirName => {
              const nextParents = [...parents, dirName];

              return (
                <FixtureTreeNode
                  key={getNodePath(nextParents)}
                  node={dirs[dirName]}
                  parents={nextParents}
                  treeExpansion={treeExpansion}
                  selectedFixturePath={selectedFixturePath}
                  onSelect={onSelect}
                  onToggleExpansion={onToggleExpansion}
                />
              );
            })}
          </>
        )}
      </>
    );
  }

  createSelectHandler = (path: string) => (
    e: SyntheticEvent<HTMLAnchorElement>
  ) => {
    e.preventDefault();
    this.props.onSelect(path);
  };
}

const ListItem = styled.div`
  --height: 28px;
  --selected-bg: rgba(0, 0, 0, 0.3);

  display: flex;
  flex-direction: row;
  align-items: center;
  height: var(--height);
  padding: 0 16px 0 ${props => getLeftPadding(props.indentLevel)}px;
  background: ${props =>
    props.selected ? 'var(--selected-bg)' : 'transparent'};
  color: ${props => (props.selected ? 'var(--grey6)' : 'var(--grey4)')};
  line-height: var(--height);
  user-select: none;
  cursor: default;
  transition: background var(--quick), color var(--quick);

  :hover {
    background: ${props =>
      props.selected ? 'var(--selected-bg)' : 'var(--grey1b)'};
  }
`;

const Unshirinkable = styled.span`
  flex-shrink: 0;
`;

const Label = styled(Unshirinkable)`
  white-space: nowrap;
`;

const IconContainer = styled(Unshirinkable)`
  --size: 16px;
  width: var(--size);
  height: var(--size);
  color: var(--grey3);
`;

const CevronContainer = styled(IconContainer)`
  padding-right: 2px;
  margin-left: -2px;
`;

const FolderContainer = styled(IconContainer)`
  padding-right: 6px;
`;

function getLeftPadding(depth) {
  return 8 + depth * 16;
}

function getNodePath(nodeParents: string[]) {
  return nodeParents.join('/');
}

function getCleanFixtureName(fixturePath) {
  return fixturePath
    .split('/')
    .pop()
    .replace(/\.(j|t)sx?$/, '');
}
