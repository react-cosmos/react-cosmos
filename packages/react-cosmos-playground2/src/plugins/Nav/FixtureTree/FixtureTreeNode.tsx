import * as React from 'react';
import { map, isEqual } from 'lodash';
import styled from 'styled-components';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import {
  ChevronRightIcon,
  ChevronDownIcon,
  FolderIcon
} from '../../../shared/icons';
import { FixtureNode, TreeExpansion } from './shared';

type Props = {
  node: FixtureNode;
  parents: string[];
  treeExpansion: TreeExpansion;
  selectedFixtureId: null | FixtureId;
  onSelect: (fixtureId: FixtureId) => unknown;
  onToggleExpansion: (nodePath: string, expanded: boolean) => unknown;
};

// TODO: Make fixture buttons <a>nchors to enable "open in new tab" clicks
export class FixtureTreeNode extends React.Component<Props> {
  render() {
    const {
      node,
      parents,
      treeExpansion,
      selectedFixtureId,
      onSelect,
      onToggleExpansion
    } = this.props;
    const { items, dirs } = node;
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
            {dirNames.map(dirName => {
              const nextParents = [...parents, dirName];

              return (
                <FixtureTreeNode
                  key={getNodePath(nextParents)}
                  node={dirs[dirName]}
                  parents={nextParents}
                  treeExpansion={treeExpansion}
                  selectedFixtureId={selectedFixtureId}
                  onSelect={onSelect}
                  onToggleExpansion={onToggleExpansion}
                />
              );
            })}
            {map(items, (fixtureId, fixtureName) => (
              <ListItem
                key={`${fixtureId.path}-${fixtureName}`}
                indentLevel={parents.length}
                selected={isEqual(fixtureId, selectedFixtureId)}
                onClick={this.createSelectHandler(fixtureId)}
              >
                <Label>{fixtureName}</Label>
              </ListItem>
            ))}
          </>
        )}
      </>
    );
  }

  createSelectHandler = (fixtureId: FixtureId) => (e: React.SyntheticEvent) => {
    e.preventDefault();
    this.props.onSelect(fixtureId);
  };
}

type ListItemProps = {
  indentLevel: number;
  selected?: boolean;
  onClick: (e: React.SyntheticEvent) => void;
};

const ListItem = styled.div<ListItemProps>`
  --height: 28px;
  --hover-bg: hsl(var(--hue-primary), 19%, 21%);

  display: flex;
  flex-direction: row;
  align-items: center;
  height: var(--height);
  padding: 0 16px 0 ${props => getLeftPadding(props.indentLevel)}px;
  background: ${props => (props.selected ? 'var(--darkest)' : 'transparent')};
  color: ${props => (props.selected ? 'var(--grey6)' : 'var(--grey4)')};
  line-height: var(--height);
  user-select: none;
  cursor: default;
  transition: background var(--quick), color var(--quick);

  :hover {
    background: ${props =>
      props.selected ? 'var(--darkest)' : 'var(--hover-bg)'};
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

function getLeftPadding(depth: number) {
  return 8 + depth * 16;
}

function getNodePath(nodeParents: string[]) {
  return nodeParents.join('/');
}
