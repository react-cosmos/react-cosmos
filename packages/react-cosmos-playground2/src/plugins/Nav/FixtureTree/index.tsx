import React from 'react';
import styled from 'styled-components';
import { isEqual } from 'lodash';
import { FixtureNamesByPath, FixtureId } from 'react-cosmos-shared2/renderer';
import { createUrl } from '../../../shared/url';
import {
  ChevronRightIcon,
  ChevronDownIcon,
  FolderIcon
} from '../../../shared/icons';
import { TreeExpansion, TreeView } from '../../../shared/ui';
import { getFixtureTree } from './fixtureTree';

type Props = {
  fixturesDir: string;
  fixtureFileSuffix: string;
  fixtures: FixtureNamesByPath;
  selectedFixtureId: null | FixtureId;
  treeExpansion: TreeExpansion;
  onSelect: (path: FixtureId) => unknown;
  setTreeExpansion: (treeExpansion: TreeExpansion) => unknown;
};

export const FixtureTree = React.memo(function FixtureTree({
  fixturesDir,
  fixtureFileSuffix,
  fixtures,
  selectedFixtureId,
  treeExpansion,
  onSelect,
  setTreeExpansion
}: Props) {
  const rootNode = React.useMemo(
    () => getFixtureTree({ fixtures, fixturesDir, fixtureFileSuffix }),
    [fixtures, fixturesDir, fixtureFileSuffix]
  );
  const handleToggleExpansion = React.useCallback(
    (nodePath: string, expanded: boolean) =>
      setTreeExpansion({ ...treeExpansion, [nodePath]: expanded }),
    [setTreeExpansion, treeExpansion]
  );
  return (
    <Container>
      <TreeView
        node={rootNode}
        parents={[]}
        treeExpansion={treeExpansion}
        renderDir={({ parents, isExpanded, onToggle }) => (
          <DirButton onClick={onToggle}>
            <ListItem indentLevel={parents.length - 1}>
              <CevronContainer>
                {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
              </CevronContainer>
              <FolderContainer>
                <FolderIcon />
              </FolderContainer>
              <Label>{parents[parents.length - 1]}</Label>
            </ListItem>
          </DirButton>
        )}
        renderItem={({ parents, item, itemName }) => (
          <FixtureLink
            key={`${item.path}-${itemName}`}
            href={createUrl({ fixtureId: item })}
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault();
              if (e.metaKey) {
                openAnchorInNewTab(e.currentTarget);
              } else {
                onSelect(item);
              }
            }}
          >
            <ListItem
              indentLevel={parents.length}
              selected={isEqual(item, selectedFixtureId)}
            >
              <FixtureLabel>{itemName}</FixtureLabel>
            </ListItem>
          </FixtureLink>
        )}
        onToggleExpansion={handleToggleExpansion}
      />
    </Container>
  );
});

function getLeftPadding(depth: number) {
  return 8 + depth * 16;
}

function openAnchorInNewTab(anchorEl: HTMLAnchorElement) {
  // Allow users to cmd+click to open fixtures in new tab
  window.open(anchorEl.href, '_blank');
}

// Reason for inline-block: https://stackoverflow.com/a/53895622/128816
const Container = styled.div`
  display: inline-block;
  min-width: 100%;
`;

const DirButton = styled.button`
  display: block;
  width: 100%;
  border: 0;
  background: transparent;

  :focus {
    outline: none;
    > span {
      box-shadow: inset 4px 0px 0 0 var(--primary3);
    }
  }

  ::-moz-focus-inner {
    border: 0;
  }
`;

const FixtureLink = styled.a`
  display: block;
  width: 100%;
  text-decoration: none;

  :focus {
    outline: none;
    > span {
      box-shadow: inset 4px 0px 0 0 var(--primary3);
    }
  }

  ::-moz-focus-inner {
    border: 0;
  }
`;

type ListItemProps = {
  indentLevel: number;
  selected?: boolean;
};

const ListItem = styled.span<ListItemProps>`
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

const FixtureLabel = styled(Label)`
  padding-left: 16px;
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
