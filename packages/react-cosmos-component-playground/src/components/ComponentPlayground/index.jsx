import React, { Component } from 'react';
import { string, bool, object } from 'prop-types';
import classNames from 'classnames';
import omitBy from 'lodash.omitby';
import localForage from 'localforage';
import { uri } from 'react-querystring-router';
import { HomeIcon, FullScreenIcon, CodeIcon } from '../SvgIcon';
import StarryBg from '../StarryBg';
import FixtureList from '../FixtureList';
import WelcomeScreen from '../WelcomeScreen';
import MissingScreen from '../MissingScreen';
import DragHandle from '../DragHandle';
import styles from './index.less';

export const LEFT_NAV_SIZE = '__cosmos__left-nav-size';
export const FIXTURE_EDITOR_PANE_SIZE = '__cosmos__fixture-editor-pane-size';

const fixtureExists = (fixtures, component, fixture) =>
  fixtures[component] && fixtures[component].indexOf(fixture) !== -1;

export default class ComponentPlayground extends Component {
  static defaultProps = {
    editor: false,
    fullScreen: false,
  };

  // Exclude params with default values
  static getCleanUrlParams = params =>
    omitBy(params, (val, key) => ComponentPlayground.defaultProps[key] === val);

  state = {
    waitingForLoader: true,
    isDragging: false,
    leftNavSize: 250,
    fixtureEditorPaneSize: 250,
    orientation: 'landscape',
  };

  componentDidMount() {
    window.addEventListener('message', this.onMessage, false);
    window.addEventListener('resize', this.onResize, false);

    // Remember the resizable pane offsets between sessions
    Promise.all([
      localForage.getItem(LEFT_NAV_SIZE),
      localForage.getItem(FIXTURE_EDITOR_PANE_SIZE),
    ]).then(([leftNavSize, fixtureEditorPaneSize]) => {
      const state = {
        leftNavSize,
        fixtureEditorPaneSize,
      };
      this.setState(
        // Only override default values when cache values are present
        omitBy(state, val => typeof val !== 'number'),
        this.updateOrientation
      );
    });
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.onMessage);
    window.removeEventListener('resize', this.onResize);
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

  // TODO: Debounce resize handler for better perf
  onResize = () => {
    this.updateOrientation();
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

  onLeftNavDrag = leftNavSize => {
    this.setState({
      leftNavSize,
    });

    localForage.setItem(LEFT_NAV_SIZE, leftNavSize);
  };

  onFixtureEditorPaneDrag = fixtureEditorPaneSize => {
    this.setState({
      fixtureEditorPaneSize,
    });

    localForage.setItem(FIXTURE_EDITOR_PANE_SIZE, fixtureEditorPaneSize);
  };

  onDragStart = () => {
    this.setState({ isDragging: true });
  };

  onDragEnd = () => {
    this.setState({ isDragging: false });
  };

  handleContentRef = node => {
    this.contentNode = node;
  };

  handleIframeRef = node => {
    this.loaderFrame = node;
  };

  updateOrientation() {
    const { offsetHeight, offsetWidth } = this.contentNode;
    this.setState({
      orientation: offsetHeight > offsetWidth ? 'portrait' : 'landscape',
    });
  }

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
    const { component, fixture, editor } = this.props;
    const { waitingForLoader, fixtures, orientation } = this.state;
    const isFixtureSelected = !waitingForLoader && Boolean(fixture);
    const isMissingFixtureSelected =
      isFixtureSelected && !fixtureExists(fixtures, component, fixture);
    const isLoaderVisible = isFixtureSelected && !isMissingFixtureSelected;
    const classes = classNames(styles.content, {
      [styles.contentPortrait]: orientation === 'portrait',
      [styles.contentLandscape]: orientation === 'landscape',
    });

    return (
      <div key="content" ref={this.handleContentRef} className={classes}>
        {!isLoaderVisible &&
          <StarryBg>
            {!waitingForLoader &&
              !isFixtureSelected &&
              <WelcomeScreen fixtures={fixtures} />}
            {isMissingFixtureSelected &&
              <MissingScreen componentName={component} fixtureName={fixture} />}
          </StarryBg>}
        {editor && this.renderFixtureEditor()}
        {this.renderLoader(isLoaderVisible)}
      </div>
    );
  }

  renderLeftNav() {
    const { getCleanUrlParams } = ComponentPlayground;
    const { router, component, fixture, editor, fullScreen } = this.props;
    const { fixtures, leftNavSize } = this.state;
    const urlParams = getCleanUrlParams({
      component,
      fixture,
      editor,
      fullScreen,
    });
    const isFixtureSelected = Boolean(fixture);
    const homeClassNames = classNames(styles.button, {
      [styles.selectedButton]: !isFixtureSelected,
    });
    const fixtureEditorClassNames = classNames(styles.button, {
      [styles.selectedButton]: editor,
    });
    const fixtureEditorUrl = uri.stringifyParams(
      getCleanUrlParams({
        component,
        fixture,
        editor: !editor,
      })
    );
    const fullScreenUrl = uri.stringifyParams({
      component,
      fixture,
      fullScreen: true,
    });

    return (
      <div
        key="leftNav"
        className={styles.leftNav}
        style={{
          width: leftNavSize,
        }}
      >
        <div className={styles.leftNavInner}>
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
                  className={fixtureEditorClassNames}
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
        <DragHandle
          onDrag={this.onLeftNavDrag}
          onDragStart={this.onDragStart}
          onDragEnd={this.onDragEnd}
        />
      </div>
    );
  }

  renderFixtureEditor() {
    const { orientation, fixtureEditorPaneSize } = this.state;
    const style = {
      [orientation === 'landscape' ? 'width' : 'height']: fixtureEditorPaneSize,
    };

    return (
      <div className={styles.fixtureEditorPane} style={style}>
        <div className={styles.fixtureEditor} />
        <DragHandle
          vertical={orientation === 'portrait'}
          onDrag={this.onFixtureEditorPaneDrag}
          onDragStart={this.onDragStart}
          onDragEnd={this.onDragEnd}
        />
      </div>
    );
  }

  renderLoader(isLoaderVisible) {
    const { loaderUri } = this.props;
    const { isDragging } = this.state;
    const loaderStyle = {
      display: isLoaderVisible ? 'block' : 'none',
    };
    const loaderFrameOverlayStyle = {
      display: isDragging ? 'block' : 'none',
    };

    return (
      <div className={styles.loaderFrame} style={loaderStyle}>
        <iframe ref={this.handleIframeRef} src={loaderUri} />
        <div
          className={styles.loaderFrameOverlay}
          style={loaderFrameOverlayStyle}
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
