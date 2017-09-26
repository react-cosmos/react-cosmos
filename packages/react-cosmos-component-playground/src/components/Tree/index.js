import React from 'react';
import { arrayOf, shape, number, string, func, bool } from 'prop-types';
import { FolderIcon, RightArrowIcon, DownArrowIcon } from '../SvgIcon';
import Highlighter from 'react-highlight-words';
import styles from './index.less';
import classNames from 'classnames';

const CONTAINER_LEFT_PADDING = 10;
const INDENT_PADDING = 20;

const TreeFolder = ({ node, onSelect, selected, nestingLevel, searchText }) => {
  return (
    <div
      className={styles.component}
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        onSelect(node, !node.expanded);
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
        <Highlighter
          searchWords={[searchText]}
          textToHighlight={node.name}
          highlightClassName={styles.searchHighlight}
        />
      </div>
      {node.expanded && (
        <Tree
          nodeArray={node.children}
          onSelect={onSelect}
          selected={selected}
          nestingLevel={nestingLevel + 1}
          searchText={searchText}
        />
      )}
    </div>
  );
};

const TreeItem = ({ node, onSelect, selected, nestingLevel, searchText }) => {
  const fixtureClassNames = classNames(styles.fixture, {
    [styles.fixtureSelected]:
      node.component === selected.component && node.name === selected.fixture
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
        onSelect(node, true);
      }}
    >
      <Highlighter
        searchWords={[searchText]}
        textToHighlight={node.name}
        highlightClassName={styles.searchHighlight}
      />
    </a>
  );
};

const Tree = ({
  nodeArray,
  onSelect,
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
  selected: shape({
    component: string,
    fixture: string
  }).isRequired,
  searchText: string,
  nestingLevel: number
};

export default Tree;
