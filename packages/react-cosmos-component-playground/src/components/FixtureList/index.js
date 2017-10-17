import React, { Component } from 'react';
import { objectOf, arrayOf, shape, string, func, bool } from 'prop-types';
import { SearchIcon } from '../SvgIcon';
import styles from './index.less';
import fixturesToTreeData from './dataMapper';
import filterNodeArray from './filter';
import Tree from '../Tree';

const KEY_S = 83;
const KEY_ESC = 27;

export default class FixtureList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      fixtureTree: fixturesToTreeData(props.fixtures)
    };
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onWindowKey);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onWindowKey);
  }

  componentWillReceiveProps(nextProps) {
    if (
      JSON.stringify(nextProps.fixtures) !== JSON.stringify(this.props.fixtures)
    ) {
      this.setState({ fixtureTree: fixturesToTreeData(nextProps.fixtures) });
    }
  }

  onWindowKey = e => {
    const isFocused = this.searchInput === document.activeElement;

    if (e.keyCode === KEY_S && !isFocused) {
      // Prevent entering `s` in the search field along with focusing
      e.preventDefault();

      this.searchInput.focus();
    } else if (e.keyCode === KEY_ESC && isFocused) {
      this.setState({
        searchText: ''
      });

      this.searchInput.blur();
    }
  };

  onSearchChange = e => {
    this.setState({ searchText: e.target.value });
  };

  onToggle = (node, expanded) => {
    // Mutates state, specifically a node from state.fixtureTree
    node.expanded = expanded;
    this.forceUpdate();
  };

  onSelect = href => {
    this.props.onUrlChange(href);
  };

  render() {
    const { urlParams } = this.props;
    const { fixtureTree, searchText } = this.state;

    const trimmedSearchText = searchText.trim();
    let filteredFixtureTree = fixtureTree;
    if (trimmedSearchText !== '') {
      filteredFixtureTree = filterNodeArray(fixtureTree, trimmedSearchText);
    }

    return (
      <div className={styles.root}>
        <div className={styles.searchInputContainer}>
          <input
            className={styles.searchInput}
            placeholder="Search..."
            value={searchText}
            onChange={this.onSearchChange}
            ref={node => {
              this.searchInput = node;
            }}
          />
          <SearchIcon />
        </div>
        <div className={styles.list}>
          <Tree
            nodeArray={filteredFixtureTree}
            onSelect={this.onSelect}
            onToggle={this.onToggle}
            searchText={searchText}
            currentUrlParams={urlParams}
            selected={{
              component: urlParams.component,
              fixture: urlParams.fixture
            }}
          />
        </div>
      </div>
    );
  }
}

FixtureList.propTypes = {
  fixtures: objectOf(arrayOf(string)).isRequired,
  urlParams: shape({
    component: string,
    fixture: string,
    editor: bool,
    fullScreen: bool
  }).isRequired,
  onUrlChange: func.isRequired
};
