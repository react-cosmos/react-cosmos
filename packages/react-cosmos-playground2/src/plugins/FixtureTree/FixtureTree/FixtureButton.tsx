import { isEqual } from 'lodash';
import React, { MouseEvent, RefObject, useCallback } from 'react';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import styled from 'styled-components';
import { blue } from '../../../shared/colors';
import { createRelativePlaygroundUrl } from '../../../shared/url';
import { stringifyFixtureId } from '../../../shared/valueInputTree';
import { Label, ListItem } from './shared';

type Props = {
  name: string;
  fixtureId: FixtureId;
  indentLevel: number;
  selectedFixtureId: null | FixtureId;
  selectedRef: RefObject<HTMLElement>;
  onSelect: (path: FixtureId) => unknown;
};

export function FixtureButton({
  name,
  fixtureId,
  indentLevel,
  selectedFixtureId,
  selectedRef,
  onSelect,
}: Props) {
  const onClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (e.metaKey) openAnchorInNewTab(e.currentTarget);
      else onSelect(fixtureId);
    },
    [fixtureId, onSelect]
  );

  const itemKey = stringifyFixtureId(fixtureId);
  const selected = isEqual(fixtureId, selectedFixtureId);
  return (
    <FixtureLink
      key={itemKey}
      href={createRelativePlaygroundUrl({ fixtureId })}
      onClick={onClick}
    >
      <ListItem
        ref={selected ? selectedRef : undefined}
        indentLevel={indentLevel}
        selected={selected}
      >
        <FixtureLabel>{name}</FixtureLabel>
      </ListItem>
    </FixtureLink>
  );
}

function openAnchorInNewTab(anchorEl: HTMLAnchorElement) {
  // Allow users to cmd+click to open fixtures in new tab
  window.open(anchorEl.href, '_blank');
}

const FixtureLink = styled.a`
  display: block;
  width: 100%;
  font-size: 14px;
  text-decoration: none;

  :focus {
    outline: none;
    > span {
      box-shadow: inset 2px 0px 0 0 ${blue};
    }
  }

  ::-moz-focus-inner {
    border: 0;
  }
`;

const FixtureLabel = styled(Label)`
  padding-left: 16px;
`;
