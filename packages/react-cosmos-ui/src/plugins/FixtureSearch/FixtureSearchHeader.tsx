import React from 'react';
import styled from 'styled-components';
import { KeyBox } from '../../components/KeyBox.js';
import { IconButton32 } from '../../components/buttons/index.js';
import { ChevronLeftIcon, SearchIcon } from '../../components/icons/index.js';
import { blue, grey160, grey32, white10 } from '../../style/colors.js';

type Props = {
  fixtureSelected: boolean;
  onOpen: () => unknown;
  onCloseNav: () => unknown;
};

export function FixtureSearchHeader({
  fixtureSelected,
  onOpen,
  onCloseNav,
}: Props) {
  return (
    <Container>
      <SearchButton onClick={onOpen}>
        <SearchIconContainer>
          <SearchIcon />
        </SearchIconContainer>
        <SearchLabel>Search fixtures</SearchLabel>
        <KeyBox value={'⌘'} bgColor={white10} textColor={grey160} size={20} />
        <KeyBox value={'K'} bgColor={white10} textColor={grey160} size={20} />
      </SearchButton>
      <NavButtonContainer>
        <IconButton32
          icon={<ChevronLeftIcon />}
          title="Hide fixture list (L)"
          disabled={!fixtureSelected}
          selected={false}
          onClick={onCloseNav}
        />
      </NavButtonContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 40px;
  margin: 0 1px 0 0;
  background: ${grey32};
`;

const SearchButton = styled.button`
  flex: 1;
  height: 32px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border: none;
  background: transparent;
  color: ${grey160};
  padding: 0 0 0 16px;
  overflow: hidden;
  cursor: text;

  :focus {
    outline: none;
    box-shadow: inset 2px 0px 0 0 ${blue};
  }

  ::-moz-focus-inner {
    border: 0;
  }
`;

const SearchIconContainer = styled.span`
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  margin: 1px 8px 0 6px;
  opacity: 0.64;
`;

const SearchLabel = styled.span`
  padding: 0 3px 0 0;
  line-height: 24px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
`;

const NavButtonContainer = styled.div`
  padding: 0 4px;
`;
