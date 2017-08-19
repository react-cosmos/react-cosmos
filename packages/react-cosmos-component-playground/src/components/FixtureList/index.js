import React, { Component } from 'react';
import { objectOf, arrayOf, shape, string, func, bool } from 'prop-types';
import { match } from 'fuzzaldrin-plus';
import classNames from 'classnames';
import { uri } from 'react-querystring-router';
import { FolderIcon, SearchIcon } from '../SvgIcon';
import styles from './index.less';

const KEY_S = 83;
const KEY_ESC = 27;

const getFilteredFixtures = (fixtures, searchText) => {
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
};

export default class FixtureList extends Component {
  state = {
    searchText: '',
  };

  componentDidMount() {
    window.addEventListener('keydown', this.onWindowKey);
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
        searchText: '',
      });

      this.searchInput.blur();
    }
  };

  onChange = e => {
    this.setState({
      searchText: e.target.value,
    });
  };

  onFixtureClick = e => {
    e.preventDefault();

    this.props.onUrlChange(e.currentTarget.href);
  };

  render() {
    const { fixtures, urlParams } = this.props;
    const { searchText } = this.state;
    const filteredFixtures = getFilteredFixtures(fixtures, searchText);
    const components = Object.keys(filteredFixtures);

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
          {components.map((component, i) => {
            return (
              <div key={i} className={styles.component}>
                <div className={styles.componentName}>
                  <FolderIcon />
                  <span>
                    {component}
                  </span>
                </div>
                <div>
                  {filteredFixtures[component].map((fixture, j) => {
                    const fixtureClassNames = classNames(styles.fixture, {
                      [styles.fixtureSelected]:
                        component === urlParams.component &&
                        fixture === urlParams.fixture,
                    });
                    const nextUrlParams = {
                      ...urlParams,
                      component,
                      fixture,
                    };

                    return (
                      <a
                        key={j}
                        className={fixtureClassNames}
                        href={uri.stringifyParams(nextUrlParams)}
                        onClick={this.onFixtureClick}
                      >
                        {fixture}
                      </a>
                    );
                  })}
                </div>
              </div>
            );
          })}
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
    fullScreen: bool,
  }).isRequired,
  onUrlChange: func.isRequired,
};
