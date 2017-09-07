import React, { Component } from 'react';
import { objectOf, arrayOf, shape, string, func, bool } from 'prop-types';
import { match } from 'fuzzaldrin-plus';
import { uri } from 'react-querystring-router';
import { SearchIcon } from '../SvgIcon';
import TreeView from './components/Tree';
import styles from './index.less';

const KEY_S = 83;
const KEY_ESC = 27;
export default class FixtureList extends Component {
  state = {
    searchText: '',
    selectedPath: '',
    filteredFixtures: {}
  };

  componentWillMount() {
    this.updateTreePropsWithText();
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onWindowKey);
  }

  componentWillReceiveProps(nextProps) {
    const { nextFixtures, nextUrlParams } = nextProps;
    const { fixtures, urlParams } = this.props;
    if (nextFixtures !== fixtures || nextUrlParams !== urlParams) {
      this.updateTreePropsWithText();
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
      const searchText = '';
      this.updateTreePropsWithText(searchText);

      this.searchInput.blur();
    }
  };

  onChange = e => {
    const searchText = e.target.value;
    this.updateTreePropsWithText(searchText);
  };

  onFixtureClick = ({ value }) => {
    const { component, fixture } = value;
    const href = uri.stringifyParams({
      ...this.props.urlParams,
      component,
      fixture
    });
    this.props.onUrlChange(href);
  };

  updateTreePropsWithText = (searchText = this.state.searchText) => {
    const { fixtures, urlParams } = this.props;
    console.log(urlParams, getSelectedPath(urlParams));
    this.setState(() => ({
      searchText,
      selectedPath: getSelectedPath(urlParams),
      filteredFixtures: getFilteredFixtures(fixtures, searchText)
    }));
  };

  render() {
    const { selectedPath, filteredFixtures, searchText } = this.state;
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
        <TreeView
          fixtures={filteredFixtures}
          selectedPath={selectedPath}
          onLeafClick={this.onFixtureClick}
        />
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

export function getSelectedPath(urlParams) {
  const { component, fixture } = urlParams;
  return component && fixture ? `${component}/${fixture}` : undefined;
}

export function getFilteredFixtures(fixtures, searchText) {
  if (searchText.length < 2) {
    return fixtures;
  }

  const components = Object.keys(fixtures);

  return components.reduce((acc, componentName) => {
    const matchingFixtures = fixtures[componentName].filter(
      fixtureName =>
        match(`${componentName}${fixtureName}`, searchText).length !== 0
    );

    // Do not render the component if it has no matching fixtures
    if (matchingFixtures.length === 0) {
      return acc;
    }

    acc[componentName] = matchingFixtures;

    return acc;
  }, {});
}
