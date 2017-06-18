import React, { Component } from 'react';
import { string, bool, object } from 'prop-types';
import classNames from 'classnames';
import omitBy from 'lodash.omitby';
import { uri } from 'react-querystring-router';
import { HomeIcon, FullScreenIcon, CodeIcon } from '../SvgIcon';
import StarryBg from '../StarryBg';
import FixtureList from '../FixtureList';
import WelcomeScreen from '../WelcomeScreen';
import MissingScreen from '../MissingScreen';
import styles from './index.less';

const fixtureExists = (fixtures, component, fixture) =>
  fixtures[component] && fixtures[component].indexOf(fixture) !== -1;

export default class ComponentPlayground extends Component {
  static defaultProps = {};

  // Exclude params with default values
  static getCleanUrlParams = params =>
    omitBy(params, (val, key) => ComponentPlayground.defaultProps[key] === val);

  state = {
    waitingForLoader: true,
  };

  componentDidMount() {
    window.addEventListener('message', this.onMessage, false);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.onMessage);
  }

  componentWillReceiveProps({ component, fixture }) {
    const { waitingForLoader, fixtures } = this.state;

    if (!waitingForLoader) {
      const fixtureChanged =
        component !== this.props.component || fixture !== this.props.fixture;

      if (fixtureChanged && fixtureExists(fixtures, component, fixture)) {
        this.loaderFrame.contentWindow.postMessage(
          {
            type: 'fixtureSelect',
            component,
            fixture,
          },
          '*'
        );
      }
    }
  }

  onMessage = ({ data }) => {
    const { type } = data;

    if (type === 'loaderReady') {
      this.onLoaderReady(data);
    } else if (type === 'fixtureListUpdate') {
      this.onFixtureListUpdate(data);
    }
  };

  onLoaderReady({ fixtures }) {
    const { loaderFrame } = this;

    this.setState({
      waitingForLoader: false,
      fixtures,
    });

    const { component, fixture } = this.props;
    if (component && fixture && fixtureExists(fixtures, component, fixture)) {
      loaderFrame.contentWindow.postMessage(
        {
          type: 'fixtureSelect',
          component,
          fixture,
        },
        '*'
      );
    }
  }

  onFixtureListUpdate({ fixtures }) {
    this.setState({
      fixtures,
    });
  }

  onUrlChange = location => {
    this.props.router.goTo(location);
  };

  render() {
    return (
      <div className={styles.root}>
        {this.renderInner()}
      </div>
    );
  }

  renderInner() {
    const { fullScreen } = this.props;
    const { waitingForLoader } = this.state;

    if (waitingForLoader || fullScreen) {
      return this.renderContent();
    }

    return [this.renderLeftNav(), this.renderContent()];
  }

  renderContent() {
    const { loaderUri, component, fixture } = this.props;
    const { waitingForLoader, fixtures } = this.state;
    const isFixtureSelected = !waitingForLoader && Boolean(fixture);
    const isMissingFixtureSelected =
      isFixtureSelected && !fixtureExists(fixtures, component, fixture);

    return (
      <div key="loader" className={styles.loader}>
        <StarryBg>
          {!waitingForLoader &&
            !isFixtureSelected &&
            <WelcomeScreen fixtures={fixtures} />}
          {isMissingFixtureSelected &&
            <MissingScreen componentName={component} fixtureName={fixture} />}
        </StarryBg>
        <iframe
          className={styles.loaderFrame}
          style={{
            display: isFixtureSelected && !isMissingFixtureSelected
              ? 'block'
              : 'none',
          }}
          ref={node => {
            this.loaderFrame = node;
          }}
          src={loaderUri}
        />
      </div>
    );
  }

  renderLeftNav() {
    const { router, component, fixture, editor, fullScreen } = this.props;
    const { fixtures } = this.state;
    const urlParams = ComponentPlayground.getCleanUrlParams({
      component,
      fixture,
      editor,
      fullScreen,
    });
    const isFixtureSelected = Boolean(fixture);
    const homeClassNames = classNames(styles.button, {
      [styles.selectedButton]: !isFixtureSelected,
    });
    const fixtureEditorUrl = uri.stringifyParams({
      component,
      fixture,
      editor: true,
    });
    const fullScreenUrl = uri.stringifyParams({
      component,
      fixture,
      fullScreen: true,
    });

    return (
      <div key="leftNav" className={styles.leftNav}>
        <div className={styles.header}>
          <div className={styles.buttons}>
            <a
              ref="homeButton"
              className={homeClassNames}
              href="/"
              onClick={router.routeLink}
            >
              <HomeIcon />
            </a>
          </div>
          <div className={styles.buttons}>
            {isFixtureSelected &&
              <a
                ref="fixtureEditorButton"
                className={styles.button}
                href={`/${fixtureEditorUrl}`}
                onClick={router.routeLink}
              >
                <CodeIcon />
              </a>}
            {isFixtureSelected &&
              <a
                ref="fullScreenButton"
                className={styles.button}
                href={`/${fullScreenUrl}`}
                onClick={router.routeLink}
              >
                <FullScreenIcon />
              </a>}
          </div>
        </div>
        <FixtureList
          fixtures={fixtures}
          urlParams={urlParams}
          onUrlChange={this.onUrlChange}
        />
      </div>
    );
  }
}

ComponentPlayground.propTypes = {
  router: object.isRequired,
  loaderUri: string.isRequired,
  component: string,
  fixture: string,
  editor: bool,
  fullScreen: bool,
};
