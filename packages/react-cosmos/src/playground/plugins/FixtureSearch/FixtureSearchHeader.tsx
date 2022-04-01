import React from 'react';
import styled from 'styled-components';
import { KeyBox } from '../../shared/KeyBox';
import { blue, grey160, grey32, white10 } from '../../ui/colors';
import { IconButton32 } from '../../ui/components/buttons';
import { ChevronLeftIcon, SearchIcon } from '../../ui/components/icons';

type Props = {
  validFixtureSelected: boolean;
  onOpen: () => unknown;
  onCloseNav: () => unknown;
};

export function FixtureSearchHeader({
  validFixtureSelected,
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
        <KeyBox value={'P'} bgColor={white10} textColor={grey160} size={20} />
      </SearchButton>
      <NavButtonContainer>
        <IconButton32
          icon={<ChevronLeftIcon />}
          title="Hide fixture list"
          disabled={!validFixtureSelected}
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
