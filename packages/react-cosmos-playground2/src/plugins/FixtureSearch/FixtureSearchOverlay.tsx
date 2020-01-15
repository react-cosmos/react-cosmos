import { filter } from 'fuzzaldrin-plus';
import { isEqual } from 'lodash';
import React from 'react';
import { FixtureId, FixtureNamesByPath } from 'react-cosmos-shared2/renderer';
import styled from 'styled-components';
import { createFixtureTree } from '../../shared/fixtureTree';
import { SearchIcon } from '../../shared/icons';
import {
  KEY_DOWN,
  KEY_ENTER,
  KEY_ESC,
  KEY_TAB,
  KEY_UP
} from '../../shared/keys';
import {
  black60,
  grey128,
  grey160,
  grey176,
  grey208,
  grey224,
  grey248,
  grey64
} from '../../shared/ui/colors';
import { FixtureSearchResult } from './FixtureSearchResult';
import { FixtureIdsByPath, flattenFixtureTree } from './flattenFixtureTree';

type Props = {
  searchText: string;
  fixturesDir: string;
  fixtureFileSuffix: string;
  fixtures: FixtureNamesByPath;
  selectedFixtureId: null | FixtureId;
  onSetSearchText: (searchText: string) => unknown;
  onClose: () => unknown;
  onSelect: (fixtureId: FixtureId, revealFixture: boolean) => unknown;
};

type ActiveFixturePath = null | string;

export function FixtureSearchOverlay({
  searchText,
  fixturesDir,
  fixtureFileSuffix,
  fixtures,
  selectedFixtureId,
  onSetSearchText,
  onClose,
  onSelect
}: Props) {
  // Flattened fixture IDs are memoized purely to minimize computation
  const fixtureIds = React.useMemo(() => {
    const fixtureTree = createFixtureTree({
      fixtures,
      fixturesDir,
      fixtureFileSuffix
    });
    return flattenFixtureTree(fixtureTree);
  }, [fixtures, fixturesDir, fixtureFileSuffix]);

  const onInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSetSearchText(e.currentTarget.value);
    },
    [onSetSearchText]
  );

  const [matchingFixturePaths, setMatchingFixturePaths] = React.useState(
    getMatchingFixturePaths(fixtureIds, searchText)
  );

  const [activeFixturePath, setActiveFixturePath] = React.useState<
    ActiveFixturePath
  >(() => {
    const selectedFixturePath =
      selectedFixtureId && getFixturePath(fixtureIds, selectedFixtureId);
    return selectedFixturePath || getFirstFixturePath(matchingFixturePaths);
  });

  React.useEffect(() => {
    const newMatchingFixturePaths = getMatchingFixturePaths(
      fixtureIds,
      searchText
    );

    if (!isEqual(newMatchingFixturePaths, matchingFixturePaths)) {
      setMatchingFixturePaths(newMatchingFixturePaths);
      // Reset active fixture to first matching fixture when search changes
      // WARNING: Putting this in a separate effect with only matchingFixturePaths
      // as a dependency looks nicer, but creates a flicker between some renders.
      // On searchText change, the component would first render a new list of
      // matching fixture paths (which may or may not contain the activeFixturePath),
      // and only in the (albeit almost instant) 2nd render would activeFixturePath
      // be updated to equal the first of the new list of matching fixture paths.
      setActiveFixturePath(getFirstFixturePath(newMatchingFixturePaths));
    }
  }, [fixtureIds, matchingFixturePaths, searchText]);

  const onInputKeyDown = React.useMemo(() => {
    function handleEscape() {
      onClose();
    }

    function handleEnter(revealFixture: boolean) {
      if (activeFixturePath !== null) {
        const fixtureId = fixtureIds[activeFixturePath];
        onSelect(fixtureId, revealFixture);
      }
    }

    function handleUp() {
      if (activeFixturePath) {
        const fixtureIndex = matchingFixturePaths.indexOf(activeFixturePath);
        if (fixtureIndex > 0) {
          setActiveFixturePath(matchingFixturePaths[fixtureIndex - 1]);
        }
      }
    }

    function handleDown() {
      if (activeFixturePath) {
        const fixtureIndex = matchingFixturePaths.indexOf(activeFixturePath);
        if (fixtureIndex < matchingFixturePaths.length - 1) {
          setActiveFixturePath(matchingFixturePaths[fixtureIndex + 1]);
        }
      }
    }

    function handleTab() {
      const matchingFixtureCount = matchingFixturePaths.length;
      if (matchingFixtureCount > 0) {
        if (!activeFixturePath) {
          setActiveFixturePath(matchingFixturePaths[0]);
        } else {
          const fixtureIndex = matchingFixturePaths.indexOf(activeFixturePath);
          const lastMatch = fixtureIndex === matchingFixtureCount - 1;
          if (lastMatch) {
            setActiveFixturePath(matchingFixturePaths[0]);
          } else {
            setActiveFixturePath(matchingFixturePaths[fixtureIndex + 1]);
          }
        }
      }
    }

    function handleTabReverse() {
      const matchingFixtureCount = matchingFixturePaths.length;
      if (matchingFixtureCount > 0) {
        if (!activeFixturePath) {
          setActiveFixturePath(matchingFixturePaths[matchingFixtureCount - 1]);
        } else {
          const fixtureIndex = matchingFixturePaths.indexOf(activeFixturePath);
          const lastMatch = fixtureIndex === 0;
          if (lastMatch) {
            setActiveFixturePath(
              matchingFixturePaths[matchingFixtureCount - 1]
            );
          } else {
            setActiveFixturePath(matchingFixturePaths[fixtureIndex - 1]);
          }
        }
      }
    }

    return (e: React.KeyboardEvent) => {
      switch (e.keyCode) {
        case KEY_ESC:
          e.preventDefault();
          return handleEscape();
        case KEY_ENTER:
          e.preventDefault();
          return handleEnter(e.shiftKey);
        case KEY_UP:
          e.preventDefault();
          return handleUp();
        case KEY_DOWN:
          e.preventDefault();
          return handleDown();
        case KEY_TAB:
          e.preventDefault();
          return e.shiftKey ? handleTabReverse() : handleTab();
        default:
        // Nada
      }
    };
  }, [onClose, activeFixturePath, fixtureIds, onSelect, matchingFixturePaths]);

  const inputRef = React.useRef<HTMLInputElement>(null);

  // Auto focus when search input is created
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  // 1. Prevent click propagation to overlay element (which calls onClose)
  // 2. Keep user focused on search input while search is open
  const onContentClick = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <OverlayIE11 data-testid="fixtureSearchOverlay" onClick={onClose}>
      <Content data-testid="fixtureSearchContent" onClick={onContentClick}>
        <InputContainer>
          <SearchIconContainer>
            <SearchIcon />
          </SearchIconContainer>
          <SearchInput
            ref={inputRef}
            type="text"
            placeholder="Fixture search"
            value={searchText}
            onChange={onInputChange}
            onKeyDown={onInputKeyDown}
          />
        </InputContainer>
        <ResultsViewport>
          <ResultsContainer>
            {matchingFixturePaths.map(cleanFixturePath => (
              <FixtureSearchResult
                key={cleanFixturePath}
                cleanFixturePath={cleanFixturePath}
                fixtureId={fixtureIds[cleanFixturePath]}
                active={cleanFixturePath === activeFixturePath}
                onSelect={onSelect}
              />
            ))}
            {matchingFixturePaths.length === 0 && (
              <NoResults>No results</NoResults>
            )}
          </ResultsContainer>
        </ResultsViewport>
      </Content>
    </OverlayIE11>
  );
}

function getFixturePath(fixtureIds: FixtureIdsByPath, fixtureId: FixtureId) {
  const fixturePaths = Object.keys(fixtureIds);
  return fixturePaths.find(fixturePath =>
    isEqual(fixtureIds[fixturePath], fixtureId)
  );
}

function getFirstFixturePath(fixturePaths: string[]): null | string {
  return fixturePaths.length > 0 ? fixturePaths[0] : null;
}

function getMatchingFixturePaths(
  fixtureIds: FixtureIdsByPath,
  searchText: string
): string[] {
  const fixturePaths = Object.keys(fixtureIds);

  if (searchText === '') {
    return fixturePaths;
  }

  const fixtureSearchTexts: string[] = [];
  fixturePaths.forEach(cleanFixturePath => {
    const fixtureId = fixtureIds[cleanFixturePath];
    const { path, name } = fixtureId;
    // Allow fixtures to be searched by their entire file path, suffixed by
    // their name in the case of named fixtures.
    fixtureSearchTexts.push(name !== null ? `${path} ${name}` : path);
  });

  const machingFixtureSearchTexts = filter(fixtureSearchTexts, searchText);
  return machingFixtureSearchTexts.map(fixtureSearchText => {
    const fixtureIndex = fixtureSearchTexts.indexOf(fixtureSearchText);
    return fixturePaths[fixtureIndex];
  });
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${black60};
`;

const OverlayIE11 = styled(Overlay)`
  z-index: 1;
`;

const Content = styled.div`
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, 0);
  width: 80%;
  max-width: 512px;
  border-radius: 3px;
  background: ${grey248};
  box-shadow: rgba(15, 15, 15, 0.05) 0px 0px 0px 1px,
    rgba(15, 15, 15, 0.1) 0px 5px 10px, rgba(15, 15, 15, 0.2) 0px 15px 40px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const InputContainer = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  height: 48px;
  padding: 8px 16px;
  cursor: text;
`;

const SearchIconContainer = styled.div`
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  padding: 7px 12px 0 2px;
  color: ${grey176};
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  color: ${grey64};
  outline: none;
  font-size: 16px;
  line-height: 32px;

  ::placeholder {
    color: ${grey160};
  }
`;

const ResultsViewport = styled.div`
  max-height: 336px;
  border-top: 1px solid ${grey208};
  background: ${grey224};
  overflow-x: hidden;
  overflow-y: auto;
`;

const ResultsContainer = styled.div`
  padding: 8px 0;
`;

const NoResults = styled.div`
  padding: 0 24px 0 48px;
  line-height: 32px;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
  color: ${grey128};
`;
