import React from 'react';
import { arrayOf, shape, number, string, func, bool } from 'prop-types';
import { FolderIcon, RightArrowIcon, DownArrowIcon } from '../SvgIcon';
import styles from './index.less';
import classNames from 'classnames';
import { match } from 'fuzzaldrin-plus';

const CONTAINER_LEFT_PADDING = 10;
const INDENT_PADDING = 20;

const FuzzyHighligher = ({ searchText, textToHighlight }) => {
  if (!searchText) {
    return <span>{textToHighlight}</span>;
  }

  const fuzzyMatch = match(textToHighlight, searchText);
  if (fuzzyMatch.length === 0) {
    return <span>{textToHighlight}</span>;
  }

  const highlighted = [];
  fuzzyMatch.forEach((highlightIndex, index) => {
    const highlightChar = textToHighlight.slice(
      highlightIndex,
      highlightIndex + 1
    );
    highlighted.push(
      <mark key={`highlight-${index}`} className={styles.searchHighlight}>
        {highlightChar}
      </mark>
    );
    const nextHighlightIndex = fuzzyMatch[index + 1];
    if (nextHighlightIndex !== highlightIndex + 1) {
      const unhighlightedChars = textToHighlight.slice(
        highlightIndex + 1,
        nextHighlightIndex
      );
      highlighted.push(<span key={index}>{unhighlightedChars}</span>);
    }
  });

  return <span>{highlighted}</span>;
};

const TreeFolder = ({
  node,
  onSelect,
  onToggle,
  selected,
  nestingLevel,
  searchText
}) => {
  return (
    <div
      className={styles.component}
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        onToggle(node, !node.expanded);
      }}
    >
      <div
        className={styles.componentName}
        style={{
          paddingLeft: CONTAINER_LEFT_PADDING + nestingLevel * INDENT_PADDING
        }}
        // ref={`componentName-${node.component}`}
      >
        {node.expanded ? <DownArrowIcon /> : <RightArrowIcon />}
        <FolderIcon />
        <FuzzyHighligher searchText={searchText} textToHighlight={node.name} />
      </div>
      {node.expanded && (
        <Tree
          nodeArray={node.children}
          onToggle={onToggle}
          onSelect={onSelect}
          selected={selected}
          nestingLevel={nestingLevel + 1}
          searchText={searchText}
        />
      )}
    </div>
  );
};

const nodeIsSelected = (node, selected) => {
  if (!node.urlParams) {
    return false;
  }
  return (
    node.urlParams.component === selected.component &&
    node.urlParams.fixture === selected.fixture
  );
};

const TreeItem = ({ node, onSelect, selected, nestingLevel, searchText }) => {
  const fixtureClassNames = classNames(styles.fixture, {
    [styles.fixtureSelected]: nodeIsSelected(node, selected)
  });
  return (
    <a
      className={fixtureClassNames}
      style={{
        paddingLeft:
          CONTAINER_LEFT_PADDING + (1 + nestingLevel) * INDENT_PADDING
      }}
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        onSelect(node);
      }}
    >
      <FuzzyHighligher searchText={searchText} textToHighlight={node.name} />
    </a>
  );
};

const Tree = ({
  nodeArray,
  onSelect,
  onToggle,
  selected,
  searchText,
  nestingLevel = 0
}) => {
  const treeStyle = {};
  if (process.env.NODE_ENV === 'development') {
    treeStyle.backgroundColor = 'black';
  }
  return (
    <div style={treeStyle}>
      {nodeArray.map((node, index) => {
        if (node.children) {
          return (
            <TreeFolder
              key={index}
              node={node}
              onToggle={onToggle}
              onSelect={onSelect}
              selected={selected}
              nestingLevel={nestingLevel}
              searchText={searchText}
            />
          );
        }
        return (
          <TreeItem
            key={index}
            node={node}
            onSelect={onSelect}
            selected={selected}
            nestingLevel={nestingLevel}
            searchText={searchText}
          />
        );
      })}
    </div>
  );
};

const nodeShape = shape({
  name: string.isRequired,
  expanded: bool,
  urlParams: shape({
    component: string.isRequired,
    fixture: string.isRequired
  })
});
nodeShape.children = arrayOf(nodeShape);

Tree.propTypes = {
  nodeArray: arrayOf(nodeShape).isRequired,
  onSelect: func.isRequired,
  onToggle: func.isRequired,
  selected: shape({
    component: string,
    fixture: string
  }).isRequired,
  searchText: string,
  nestingLevel: number
};

export default Tree;
