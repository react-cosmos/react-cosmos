import React from 'react';
import { arrayOf, shape, number, string, func, bool } from 'prop-types';
import { FolderIcon, RightArrowIcon, DownArrowIcon } from '../SvgIcon';
import styles from './index.less';
import classNames from 'classnames';
import { match } from 'fuzzaldrin-plus';
import { uri } from 'react-querystring-router';

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
    // If the first character isn't highlighted, push the initial
    // unhighlighted characters
    if (index === 0 && highlightIndex !== 0) {
      highlighted.push(
        <span key={'initial-unhighlighted'}>
          {textToHighlight.slice(0, highlightIndex)}
        </span>
      );
    }

    // Push the highlighted character
    const highlightChar = textToHighlight.slice(
      highlightIndex,
      highlightIndex + 1
    );
    highlighted.push(
      <mark key={`highlight-${index}`} className={styles.searchHighlight}>
        {highlightChar}
      </mark>
    );

    // If the next character isn't highlighted,
    // push the subsequent unhighlighted characters
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
  searchText,
  baseUrlParams
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
      >
        <span className={styles.arrowIcon}>
          {node.expanded ? <DownArrowIcon /> : <RightArrowIcon />}
        </span>
        <FolderIcon />
        <FuzzyHighligher searchText={searchText} textToHighlight={node.name} />
      </div>
      <Tree
        nodeArray={node.children}
        onToggle={onToggle}
        onSelect={onSelect}
        selected={selected}
        nestingLevel={nestingLevel + 1}
        searchText={searchText}
        isHidden={!node.expanded}
        baseUrlParams={baseUrlParams}
      />
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

const TreeItem = ({
  node,
  onSelect,
  isSelected,
  nestingLevel,
  searchText,
  baseUrlParams
}) => {
  const fixtureClassNames = classNames(styles.fixture, {
    [styles.fixtureSelected]: isSelected
  });

  const mergedUrlParams = {
    ...baseUrlParams,
    ...node.urlParams
  };

  return (
    <a
      className={fixtureClassNames}
      style={{
        paddingLeft:
          CONTAINER_LEFT_PADDING + (1 + nestingLevel) * INDENT_PADDING
      }}
      href={uri.stringifyParams(mergedUrlParams)}
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        onSelect(mergedUrlParams);
      }}
    >
      <FuzzyHighligher searchText={searchText} textToHighlight={node.name} />
    </a>
  );
};

class Tree extends React.Component {
  componentDidMount() {
    const el = this.selectedItem;
    // scrollIntoView doesn't seem to exist in Jest/jsdom
    if (el && el.scrollIntoView) {
      el.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }

  render() {
    const {
      nodeArray,
      onSelect,
      onToggle,
      selected,
      searchText,
      baseUrlParams,
      nestingLevel = 0,
      isHidden = false
    } = this.props;
    const treeStyle = {};
    if (process.env.NODE_ENV === 'development') {
      treeStyle.backgroundColor = 'black';
    }

    return (
      <div
        className={isHidden ? styles.componentCollapsed : ''}
        style={treeStyle}
      >
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
                baseUrlParams={baseUrlParams}
              />
            );
          }
          const isSelected = nodeIsSelected(node, selected);
          return (
            <div
              ref={el => {
                if (isSelected) {
                  this.selectedItem = el;
                }
              }}
              key={index}
            >
              <TreeItem
                node={node}
                onSelect={onSelect}
                isSelected={isSelected}
                nestingLevel={nestingLevel}
                searchText={searchText}
                baseUrlParams={baseUrlParams}
              />
            </div>
          );
        })}
      </div>
    );
  }
}

const TreeWrapper = props => {
  return (
    <div className={props.searchText === '' ? '' : styles.treeSearchActive}>
      <Tree {...props} />
    </div>
  );
};

const nodeShape = shape({
  name: string.isRequired,
  expanded: bool,
  isHidden: bool,
  urlParams: shape({
    component: string.isRequired,
    fixture: string.isRequired
  })
});
nodeShape.children = arrayOf(nodeShape);

TreeWrapper.propTypes = {
  nodeArray: arrayOf(nodeShape).isRequired,
  onSelect: func.isRequired,
  onToggle: func.isRequired,
  selected: shape({
    component: string,
    fixture: string
  }).isRequired,
  baseUrlParams: shape({
    editor: bool,
    fullScreen: bool
  }).isRequired,
  searchText: string,
  nestingLevel: number
};

export default TreeWrapper;
