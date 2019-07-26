import React from 'react';
import styled from 'styled-components';
import { SearchIcon, ChevronLeftIcon } from '../../shared/icons';
import { KEY_K, KEY_P } from '../../shared/keys';
import { DarkIconButton } from '../../shared/ui/buttons';

type Props = {
  onOpen: () => unknown;
  onMinimizeNav: () => unknown;
};

export function FixtureSearchHeader({ onOpen, onMinimizeNav }: Props) {
  React.useEffect(() => {
    function handleWindowKeyDown(e: KeyboardEvent) {
      const metaKey = e.metaKey || e.ctrlKey;
      if (metaKey && (e.keyCode === KEY_P || e.keyCode === KEY_K)) {
        e.preventDefault();
        onOpen();
      }
    }
    window.addEventListener('keydown', handleWindowKeyDown);
    return () => window.removeEventListener('keydown', handleWindowKeyDown);
  }, [onOpen]);

  return (
    <Container>
      <SearchButton onClick={onOpen}>
        <SearchIconContainer>
          <SearchIcon />
        </SearchIconContainer>
        <SearchLabel>Search fixtures</SearchLabel>
      </SearchButton>
      <MinimizeButtonContainer>
        <DarkIconButton
          title="Minimize nav bar"
          icon={<ChevronLeftIcon />}
          onClick={onMinimizeNav}
        />
      </MinimizeButtonContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  height: 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: var(--grey1);
`;

const SearchButton = styled.button`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border: none;
  background: transparent;
  color: var(--grey3);
  padding: 0 16px;
  cursor: text;

  :focus {
    outline: none;
    box-shadow: inset 4px 0px 0 0 var(--primary3);
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

const MinimizeButtonContainer = styled.div`
  width: 32px;
  height: 32px;
  padding: 4px;
`;
