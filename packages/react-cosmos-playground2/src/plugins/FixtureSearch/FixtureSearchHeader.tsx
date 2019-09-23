import React from 'react';
import styled from 'styled-components';
import { SearchIcon } from '../../shared/icons';
import { blue, grey160, grey32, white10 } from '../../shared/ui/colors';

type Props = {
  onOpen: () => unknown;
};

export function FixtureSearchHeader({ onOpen }: Props) {
  return (
    <Container>
      <SearchButton onClick={onOpen}>
        <SearchIconContainer>
          <SearchIcon />
        </SearchIconContainer>
        <SearchLabel>Search fixtures</SearchLabel>
      </SearchButton>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  height: 40px;
  margin: 0 1px 0 0;
  border-bottom: 1px solid ${white10};
  background: ${grey32};
`;

const SearchButton = styled.button`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border: none;
  background: transparent;
  color: ${grey160};
  padding: 0 16px;
  cursor: text;

  :focus {
    outline: none;
    box-shadow: inset 3px 0px 0 0 ${blue};
  }

  ::-moz-focus-inner {
    border: 0;
  }
`;

const SearchIconContainer = styled.span`
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  margin: 1px 8px 0 8px;
  opacity: 0.64;
`;

const SearchLabel = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
`;
