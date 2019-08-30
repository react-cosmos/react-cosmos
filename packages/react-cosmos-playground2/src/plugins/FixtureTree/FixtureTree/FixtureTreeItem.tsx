import React from 'react';
import styled from 'styled-components';
import { isEqual } from 'lodash';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import { createRelativePlaygroundUrl } from '../../../shared/url';
import { ListItem, Label } from './shared';

type Props = {
  parents: string[];
  item: FixtureId;
  itemName: string;
  selectedFixtureId: null | FixtureId;
  onSelect: (path: FixtureId) => unknown;
};

export function FixtureTreeItem({
  parents,
  item,
  itemName,
  selectedFixtureId,
  onSelect
}: Props) {
  const onClick = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (e.metaKey) {
        openAnchorInNewTab(e.currentTarget);
      } else {
        onSelect(item);
      }
    },
    [item, onSelect]
  );

  const itemKey = stringifyFixtureId(item);
  return (
    <FixtureLink
      key={itemKey}
      href={createRelativePlaygroundUrl({ fixtureId: item })}
      onClick={onClick}
    >
      <ListItem
        indentLevel={parents.length}
        selected={isEqual(item, selectedFixtureId)}
      >
        <FixtureLabel>{itemName}</FixtureLabel>
      </ListItem>
    </FixtureLink>
  );
}

function stringifyFixtureId(fixtureId: FixtureId) {
  return fixtureId.name
    ? `${fixtureId.path}-${fixtureId.name}`
    : fixtureId.path;
}

function openAnchorInNewTab(anchorEl: HTMLAnchorElement) {
  // Allow users to cmd+click to open fixtures in new tab
  window.open(anchorEl.href, '_blank');
}

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

const FixtureLabel = styled(Label)`
  padding-left: 16px;
`;
