import React, { Component } from 'react';
import { string, bool, object, shape, oneOf } from 'prop-types';
import classNames from 'classnames';
import omitBy from 'lodash.omitby';
import localForage from 'localforage';
import { uri } from 'react-querystring-router';
import { HomeIcon, FullScreenIcon, CodeIcon } from '../SvgIcon';
import StarryBg from '../StarryBg';
import FixtureList from '../FixtureList';
import WelcomeScreen from '../screens/WelcomeScreen';
import MissingScreen from '../screens/MissingScreen';
import NoLoaderScreen from '../screens/NoLoaderScreen';
import LoadingScreen from '../screens/LoadingScreen';
import DragHandle from '../DragHandle';
import FixtureEditor from '../FixtureEditor';
import styles from './index.less';

export const LEFT_NAV_SIZE = '__cosmos__left-nav-size';
export const FIXTURE_EDITOR_PANE_SIZE = '__cosmos__fixture-editor-pane-size';

const fixtureExists = (fixtures, component, fixture) =>
  fixtures[component] && fixtures[component].indexOf(fixture) !== -1;

const postMessageToFrame = (frame, data) =>
  frame.contentWindow.postMessage(data, '*');

export default class ComponentPlayground extends Component {
  static defaultProps = {
    editor: false,
    fullScreen: false
  };

  // Exclude params with default values
  static getCleanUrlParams = params =>
    omitBy(params, (val, key) => ComponentPlayground.defaultProps[key] === val);

  state = {
    waitingForLoader: true,
    isLoaderResponding: false,
    isDragging: false,
    leftNavSize: 250,
    fixtureEditorPaneSize: 250,
    orientation: 'landscape',
    fixtureBody: {}
  };

  async componentDidMount() {
    window.addEventListener('message', this.onMessage, false);
    window.addEventListener('resize', this.onResize, false);

    // Check if Loader is working
    const { status } = await fetch(this.props.options.loaderUri);
    if (status === 200) {
      this.setState(
        {
          isLoaderResponding: true
        },
        this.restoreUserSettings
      );
    } else {
      this.setState({
        waitingForLoader: false,
        isLoaderResponding: false
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.onMessage);
    window.removeEventListener('resize', this.onResize);
  }

  componentWillReceiveProps({ component, fixture }) {
    const { waitingForLoader, isLoaderResponding, fixtures } = this.state;

    if (!waitingForLoader && isLoaderResponding) {
      const fixtureChanged =
        component !== this.props.component || fixture !== this.props.fixture;

      if (fixtureChanged && fixtureExists(fixtures, component, fixture)) {
        postMessageToFrame(this.loaderFrame, {
          type: 'fixtureSelect',
          component,
          fixture
        });
      }
    }
  }

  onMessage = ({ data }) => {
    const { type } = data;

    if (type === 'loaderReady') {
      this.onLoaderReady(data);
    } else if (type === 'fixtureListUpdate') {
      this.onFixtureListUpdate(data);
    } else if (type === 'fixtureLoad') {
      this.onFixtureLoad(data);
    } else if (type === 'fixtureUpdate') {
      this.onFixtureUpdate(data);
    }
  };

  onResize = () => {
    this.updateContentOrientation();
  };

  onLoaderReady({ fixtures }) {
    const { loaderFrame } = this;

    this.setState(
      {
        waitingForLoader: false,
        fixtures
      },
      // We update the content orientation because the content width decreases
      // when the left nav becomes visible
      this.updateContentOrientation
    );

    const { component, fixture } = this.props;
    if (component && fixture && fixtureExists(fixtures, component, fixture)) {
      postMessageToFrame(loaderFrame, {
        type: 'fixtureSelect',
        component,
        fixture
      });
    }
  }

  onFixtureListUpdate({ fixtures }) {
    this.setState({
      fixtures
    });
  }

  onFixtureLoad({ fixtureBody }) {
    this.setState({
      fixtureBody
    });
  }

  onFixtureUpdate({ fixtureBody }) {
    this.setState({
      // Fixture updates are partial
      fixtureBody: {
        ...this.state.fixtureBody,
        ...fixtureBody
      }
    });
  }

  onUrlChange = location => {
    if (location === window.location.href) {
      const { component, fixture } = this.props;
      postMessageToFrame(this.loaderFrame, {
        type: 'fixtureSelect',
        component,
        fixture
      });
    } else {
      this.props.router.goTo(location);
    }
  };

  onLeftNavDrag = leftNavSize => {
    this.setState(
      {
        leftNavSize
      },
      // We update the content orientation because the content width changes
      // when the width of left nav changes
      this.updateContentOrientation
    );

    localForage.setItem(LEFT_NAV_SIZE, leftNavSize);
  };

  onFixtureEditorPaneDrag = fixtureEditorPaneSize => {
    this.setState({
      fixtureEditorPaneSize
    });

    localForage.setItem(FIXTURE_EDITOR_PANE_SIZE, fixtureEditorPaneSize);
  };

  onDragStart = () => {
    this.setState({ isDragging: true });
  };

  onDragEnd = () => {
    this.setState({ isDragging: false });
  };

  onFixtureEditorChange = fixtureBody => {
    this.setState({
      fixtureBody
    });

    postMessageToFrame(this.loaderFrame, {
      type: 'fixtureEdit',
      fixtureBody
    });
  };

  handleContentRef = node => {
    this.contentNode = node;
  };

  handleIframeRef = node => {
    this.loaderFrame = node;
  };

  restoreUserSettings = async () => {
    // Remember the resizable pane offsets between sessions
    const [leftNavSize, fixtureEditorPaneSize] = await Promise.all([
      localForage.getItem(LEFT_NAV_SIZE),
      localForage.getItem(FIXTURE_EDITOR_PANE_SIZE)
    ]);

    this.setState(
      // Only override default values when cache values are present
      omitBy(
        {
          leftNavSize,
          fixtureEditorPaneSize
        },
        val => typeof val !== 'number'
      ),
      this.updateContentOrientation
    );
  };

  updateContentOrientation() {
    const { offsetHeight, offsetWidth } = this.contentNode;
    this.setState({
      orientation: offsetHeight > offsetWidth ? 'portrait' : 'landscape'
    });
  }

  render() {
    return <div className={styles.root}>{this.renderInner()}</div>;
  }

  renderInner() {
    const { fullScreen } = this.props;
    const { waitingForLoader, isLoaderResponding } = this.state;

    if (waitingForLoader || !isLoaderResponding || fullScreen) {
      return this.renderContent();
    }

    return [this.renderLeftNav(), this.renderContent()];
  }

  renderContent() {
    const { component, fixture, editor, options } = this.props;
    const {
      waitingForLoader,
      isLoaderResponding,
      fixtures,
      orientation
    } = this.state;
    const isLoaderReady = !waitingForLoader && isLoaderResponding;
    const isFixtureSelected = isLoaderReady && Boolean(fixture);
    const isMissingFixtureSelected =
      isFixtureSelected && !fixtureExists(fixtures, component, fixture);
    const isLoaderVisible = isFixtureSelected && !isMissingFixtureSelected;
    const classes = classNames(styles.content, {
      [styles.contentPortrait]: orientation === 'portrait',
      [styles.contentLandscape]: orientation === 'landscape'
    });

    return (
      <div key="content" ref={this.handleContentRef} className={classes}>
        {!isLoaderVisible && (
          <StarryBg>
            {waitingForLoader && <LoadingScreen />}
            {!isLoaderResponding &&
              !waitingForLoader && <NoLoaderScreen options={options} />}
            {isLoaderReady &&
              !isFixtureSelected && <WelcomeScreen fixtures={fixtures} />}
            {isMissingFixtureSelected && (
              <MissingScreen componentName={component} fixtureName={fixture} />
            )}
          </StarryBg>
        )}
        {editor && isLoaderReady && this.renderFixtureEditor()}
        {isLoaderResponding && this.renderLoader(isLoaderVisible)}
      </div>
    );
  }

  renderLeftNav() {
    const { getCleanUrlParams } = ComponentPlayground;
    const {
      router,
      component,
      fixture,
      editor,
      fullScreen,
      options
    } = this.props;
    const { fixtures, leftNavSize } = this.state;
    const urlParams = getCleanUrlParams({
      component,
      fixture,
      editor,
      fullScreen
    });
    const isFixtureSelected = Boolean(fixture);
    const homeClassNames = classNames(styles.button, {
      [styles.selectedButton]: !isFixtureSelected
    });
    const fixtureEditorClassNames = classNames(styles.button, {
      [styles.selectedButton]: editor
    });
    const fixtureEditorUrl = uri.stringifyParams(
      getCleanUrlParams({
        component,
        fixture,
        editor: !editor
      })
    );
    const fullScreenUrl = uri.stringifyParams({
      component,
      fixture,
      fullScreen: true
    });

    return (
      <div
        key="leftNav"
        className={styles.leftNav}
        style={{
          width: leftNavSize
        }}
      >
        <div className={styles.leftNavInner}>
          <div className={styles.header}>
            <div className={styles.buttons}>
              <a
                ref="homeButton"
                className={homeClassNames}
                href="?"
                onClick={router.routeLink}
              >
                <HomeIcon />
              </a>
            </div>
            <div className={styles.buttons}>
              {isFixtureSelected && (
                <a
                  ref="fixtureEditorButton"
                  className={fixtureEditorClassNames}
                  href={fixtureEditorUrl}
                  onClick={router.routeLink}
                >
                  <CodeIcon />
                </a>
              )}
              {isFixtureSelected && (
                <a
                  ref="fullScreenButton"
                  className={styles.button}
                  href={fullScreenUrl}
                  onClick={router.routeLink}
                >
                  <FullScreenIcon />
                </a>
              )}
            </div>
          </div>
          <FixtureList
            options={options}
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
    const { orientation, fixtureEditorPaneSize, fixtureBody } = this.state;
    const style = {
      [orientation === 'landscape' ? 'width' : 'height']: fixtureEditorPaneSize
    };

    return (
      <div className={styles.fixtureEditorPane} style={style}>
        <div className={styles.fixtureEditor}>
          <FixtureEditor
            value={fixtureBody}
            onChange={this.onFixtureEditorChange}
          />
        </div>
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
    const { options: { loaderUri } } = this.props;
    const { isDragging } = this.state;
    const loaderStyle = {
      display: isLoaderVisible ? 'block' : 'none'
    };
    const loaderFrameOverlayStyle = {
      display: isDragging ? 'block' : 'none'
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
  options: shape({
    loaderUri: string.isRequired,
    projectKey: string.isRequired,
    webpackConfigType: oneOf(['default', 'custom'])
  }).isRequired,
  component: string,
  fixture: string,
  editor: bool,
  fullScreen: bool
};
