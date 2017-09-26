import React, { Component } from 'react';
import { objectOf, arrayOf, shape, string, func, bool } from 'prop-types';
import { uri } from 'react-querystring-router';
import { SearchIcon } from '../SvgIcon';
import styles from './index.less';
import fixturesToTreeData from './dataMapper';
import * as filters from './filter';
import Tree from '../Tree';

const KEY_S = 83;
const KEY_ESC = 27;

const isExistingFixtureSelected = (fixtures, component, fixture) => {
  return (
    component &&
    fixture &&
    fixtures[component] &&
    fixtures[component].indexOf(fixture) !== -1
  );
};

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
    const { fixtures, urlParams: { component, fixture } } = this.props;

    if (isExistingFixtureSelected(fixtures, component, fixture)) {
      const node = this.refs[`componentName-${component}`];
      // scrollIntoView doesn't seem to exist in Jest/jsdom
      // if (node.scrollIntoView) {
      //   node.scrollIntoView({
      //     behavior: 'smooth'
      //   });
      // }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onWindowKey);
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

  onChange = e => {
    this.setState({ searchText: e.target.value });
  };

  onSelect = (node, expanded) => {
    if (node.children) {
      // Mutates state. The world won't explode, just be aware. Hugely simplifies things.
      node.expanded = expanded;
      this.forceUpdate();
    }
    if (node.urlParams) {
      const href = uri.stringifyParams(node.urlParams);
      this.props.onUrlChange(href);
    }
  };

  render() {
    const { urlParams } = this.props;
    const { fixtureTree, searchText } = this.state;

    const trimmedSearchText = searchText.trim();
    let filteredFixtureTree = fixtureTree;
    if (trimmedSearchText !== '') {
      filteredFixtureTree = filters.filterTree(fixtureTree, trimmedSearchText);
    }

    return (
      <div className={styles.root}>
        <div className={styles.searchInputContainer}>
          <input
            className={styles.searchInput}
            placeholder="Search..."
            value={searchText}
            onChange={this.onChange}
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
            searchText={searchText}
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
