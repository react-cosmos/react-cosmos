// @flow

import React, { Component } from 'react';
import classNames from 'classnames';
import omitBy from 'lodash.omitby';
import localForage from 'localforage';
import { uri } from 'react-querystring-router';
import { HomeIcon, FullScreenIcon, CodeIcon, ResponsiveIcon } from '../SvgIcon';
import StarryBg from '../StarryBg';
import FixtureList from '../FixtureList';
import WelcomeScreen from '../screens/WelcomeScreen';
import MissingScreen from '../screens/MissingScreen';
import NoLoaderScreen from '../screens/NoLoaderScreen';
import LoadingScreen from '../screens/LoadingScreen';
import DragHandle from '../DragHandle';
import FixtureEditor from '../FixtureEditor';
import styles from './index.less';
import ResponsiveLoader from '../ResponsiveLoader';

import type {
  LoaderReadyMessageData,
  FixtureListUpdateMessageData,
  FixtureLoadMessageData,
  FixtureUpdateMessageData,
  LoaderMessage
} from 'react-cosmos-flow/loader';
import type { PlaygroundWebOpts } from 'react-cosmos-flow/playground';

export const LEFT_NAV_SIZE = '__cosmos__left-nav-size';
export const FIXTURE_EDITOR_PANE_SIZE = '__cosmos__fixture-editor-pane-size';

export const PENDING = 0;
export const BUILD_ERROR = 1;
export const OK = 2;
export const RUNTIME_ERROR = 3;
export const READY = 4;

type Props = {
  router: Object,
  options: PlaygroundWebOpts,
  component?: string,
  fixture?: string,
  editor?: boolean,
  fullScreen?: boolean,
  responsive?: boolean
};

type State = {
  // There doesn't seem to be a way to use const values as types. Let me know
  // if you can think of a better way to express this!
  loaderStatus: 0 | 1 | 2 | 3 | 4,
  isDragging: boolean,
  leftNavSize: number,
  fixtureEditorPaneSize: number,
  orientation: 'landscape' | 'portrait',
  fixtureBody: Object,
  fixtures: Object
};

export default class ComponentPlayground extends Component<Props, State> {
  contentNode: ?HTMLElement;

  loaderFrame: ?HTMLElement;

  static defaultProps = {
    editor: false,
    fullScreen: false,
    responsive: false
  };

  // Exclude params with default values
  static getCleanUrlParams = (params: {}) =>
    omitBy(params, (val, key) => ComponentPlayground.defaultProps[key] === val);

  state = {
    loaderStatus: PENDING,
    isDragging: false,
    leftNavSize: 250,
    fixtureEditorPaneSize: 250,
    orientation: 'landscape',
    fixtureBody: {},
    fixtures: {}
  };

  componentDidMount() {
    window.addEventListener('message', this.onMessage, false);
    window.addEventListener('resize', this.onResize, false);

    this.checkLoaderStatus();
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.onMessage);
    window.removeEventListener('resize', this.onResize);
  }

  componentWillReceiveProps({ component, fixture }: Props) {
    const { loaderStatus, fixtures } = this.state;

    if (loaderStatus === READY) {
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

  onMessage = ({ data }: LoaderMessage) => {
    if (data.type === 'runtimeError') {
      this.onRuntimeError();
    } else if (data.type === 'loaderReady') {
      this.onLoaderReady(data);
    } else if (data.type === 'fixtureListUpdate') {
      this.onFixtureListUpdate(data);
    } else if (data.type === 'fixtureLoad') {
      this.onFixtureLoad(data);
    } else if (data.type === 'fixtureUpdate') {
      this.onFixtureUpdate(data);
    }
  };

  onResize = () => {
    this.updateContentOrientation();
  };

  onRuntimeError() {
    // We only care about runtime errors before Loader is ready. Once
    // initialized, the Loader will safely capture and display runtime errors
    // when they occur
    if (this.state.loaderStatus < READY) {
      this.setState({ loaderStatus: RUNTIME_ERROR });
    }
  }

  onLoaderReady({ fixtures }: LoaderReadyMessageData) {
    const { loaderFrame } = this;

    this.setState(
      {
        loaderStatus: READY,
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

  onFixtureListUpdate({ fixtures }: FixtureListUpdateMessageData) {
    this.setState({
      fixtures
    });
  }

  onFixtureLoad({ fixtureBody }: FixtureLoadMessageData) {
    this.setState({
      fixtureBody
    });
  }

  onFixtureUpdate({ fixtureBody }: FixtureUpdateMessageData) {
    this.setState({
      // Fixture updates are partial
      fixtureBody: {
        ...this.state.fixtureBody,
        ...fixtureBody
      }
    });
  }

  onUrlChange = (location: string) => {
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

  onLeftNavDrag = (leftNavSize: number) => {
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

  onFixtureEditorPaneDrag = (fixtureEditorPaneSize: number) => {
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

  onFixtureEditorChange = (fixtureBody: Object) => {
    this.setState({
      fixtureBody
    });

    postMessageToFrame(this.loaderFrame, {
      type: 'fixtureEdit',
      fixtureBody
    });
  };

  handleContentRef = (node: ?HTMLElement) => {
    this.contentNode = node;
  };

  handleIframeRef = (node: ?HTMLElement) => {
    this.loaderFrame = node;
  };

  async checkLoaderStatus() {
    // We can't do fetch requests when Cosmos exports are opened without a
    // web server (ie. via file:/// protocol), so we might as well be optimistic
    // and assume the Loader iframe responds 200
    if (location.protocol === 'file:') {
      this.restoreUserSettings(() => {
        this.setState({
          loaderStatus: OK
        });
      });
    } else {
      // Check if Loader is working
      const { status } = await fetch(this.props.options.loaderUri, {
        credentials: 'same-origin'
      });
      if (status === 200) {
        // Wait until all session settings are read before rendering
        this.restoreUserSettings(() => {
          this.setState({
            loaderStatus: OK
          });
        });
      } else {
        this.setState({
          loaderStatus: BUILD_ERROR
        });
      }
    }
  }

  restoreUserSettings = async (cb?: Function) => {
    // Remember the resizable pane offsets between sessions
    const [leftNavSize, fixtureEditorPaneSize] = await Promise.all([
      localForage.getItem(LEFT_NAV_SIZE),
      localForage.getItem(FIXTURE_EDITOR_PANE_SIZE)
    ]);

    // Only override default values when cache values are present
    const state = omitBy(
      {
        leftNavSize,
        fixtureEditorPaneSize
      },
      isNumber
    );

    this.setState(state, () => {
      this.updateContentOrientation(cb);
    });
  };

  updateContentOrientation(cb?: Function) {
    if (!this.contentNode) {
      return;
    }

    const { offsetHeight, offsetWidth } = this.contentNode;
    const state = {
      orientation: offsetHeight > offsetWidth ? 'portrait' : 'landscape'
    };

    this.setState(state, cb);
  }

  render() {
    return <div className={styles.root}>{this.renderInner()}</div>;
  }

  renderInner() {
    const { fullScreen } = this.props;
    const { loaderStatus } = this.state;

    // Can't show left nav until we receive fixture list with READY event
    if (loaderStatus < READY || fullScreen) {
      return this.renderContent();
    }

    return [this.renderLeftNav(), this.renderContent()];
  }

  renderContent() {
    const { component, fixture, editor, options } = this.props;
    const { loaderStatus, fixtures, orientation } = this.state;
    // We can only check if a fixture exists once loader is READY and fixture
    // list has been received
    const isFixtureSelected = loaderStatus === READY && Boolean(fixture);
    const isMissingFixtureSelected =
      isFixtureSelected && !fixtureExists(fixtures, component, fixture);
    const isLoaderVisible =
      (isFixtureSelected && !isMissingFixtureSelected) ||
      // Show loader when it crashes during initializing
      loaderStatus === RUNTIME_ERROR;
    const classes = classNames(styles.content, {
      [styles.contentPortrait]: orientation === 'portrait',
      [styles.contentLandscape]: orientation === 'landscape'
    });

    return (
      <div key="content" ref={this.handleContentRef} className={classes}>
        {!isLoaderVisible && (
          <StarryBg>
            {loaderStatus === PENDING && <LoadingScreen />}
            {loaderStatus === BUILD_ERROR && (
              <NoLoaderScreen options={options} />
            )}
            {loaderStatus === READY &&
              !isFixtureSelected && <WelcomeScreen fixtures={fixtures} />}
            {isMissingFixtureSelected && (
              <MissingScreen componentName={component} fixtureName={fixture} />
            )}
          </StarryBg>
        )}
        {editor && isLoaderVisible && this.renderFixtureEditor()}
        {loaderStatus >= OK && this.renderLoader(isLoaderVisible)}
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
      responsive,
      options
    } = this.props;
    const { fixtures, fixtureBody, leftNavSize } = this.state;

    const urlParams = getCleanUrlParams({
      component,
      fixture,
      editor,
      fullScreen,
      // We don't persist the `forceHide` value when changing fixturess
      responsive: responsive === 'forceHide' ? false : responsive
    });

    const showResponsiveControls =
      responsive === 'forceHide' ? false : fixtureBody.viewport || responsive;

    const nextResponsive =
      responsive === 'forceHide'
        ? true
        : fixtureBody.viewport
          ? 'forceHide'
          : !responsive;

    const isFixtureSelected = Boolean(fixture);
    const homeClassNames = classNames(styles.button, {
      [styles.selectedButton]: !isFixtureSelected
    });
    const fixtureEditorClassNames = classNames(styles.button, {
      [styles.selectedButton]: editor
    });
    const responsiveClassNames = classNames(styles.button, {
      [styles.selectedButton]: showResponsiveControls
    });
    const fixtureEditorUrl = uri.stringifyParams(
      getCleanUrlParams({
        component,
        fixture,
        editor: !editor,
        responsive
      })
    );
    const fullScreenUrl = uri.stringifyParams({
      component,
      fixture,
      fullScreen: true
    });

    const responsiveUrl = uri.stringifyParams(
      getCleanUrlParams({
        component,
        fixture,
        editor,
        responsive: nextResponsive
      })
    );
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
              {isFixtureSelected && (
                <a
                  ref="responsiveButton"
                  className={responsiveClassNames}
                  href={responsiveUrl}
                  onClick={router.routeLink}
                >
                  <ResponsiveIcon />
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

  renderLoader(isLoaderVisible: boolean) {
    const {
      options: { loaderUri, responsiveDevices },
      responsive
    } = this.props;
    const { isDragging, fixtureBody } = this.state;
    const loaderStyle = {
      display: isLoaderVisible ? 'flex' : 'none'
    };
    const loaderFrameOverlayStyle = {
      display: isDragging ? 'block' : 'none'
    };
    const showResponsiveControls =
      responsive === 'forceHide'
        ? false
        : fixtureBody.viewport || responsive || false;

    return (
      <div className={styles.loaderFrame} style={loaderStyle}>
        <ResponsiveLoader
          showResponsiveControls={showResponsiveControls}
          inputRef={this.handleIframeRef}
          src={loaderUri}
          devices={responsiveDevices || []}
          onFixtureUpdate={updatedFields =>
            this.onFixtureEditorChange({
              ...fixtureBody,
              ...updatedFields
            })
          }
          fixture={fixtureBody.name ? fixtureBody : null}
        />
        <div
          className={styles.loaderFrameOverlay}
          style={loaderFrameOverlayStyle}
        />
      </div>
    );
  }
}

function isNumber(val) {
  return typeof val !== 'number';
}

function fixtureExists(fixtures, component, fixture) {
  return (
    component &&
    fixture &&
    fixtures[component] &&
    fixtures[component].indexOf(fixture) !== -1
  );
}

function postMessageToFrame(frame: window, data) {
  return frame.contentWindow.postMessage(data, '*');
}
