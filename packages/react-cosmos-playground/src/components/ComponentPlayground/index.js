// @flow

import React, { Component } from 'react';
import classNames from 'classnames';
import omitBy from 'lodash.omitby';
import localForage from 'localforage';
import io from 'socket.io-client';
import { uri } from 'react-querystring-router';
import { Slot } from 'react-plugin';
import { UiContext } from '../../context';
import { HomeIcon, FullScreenIcon, CodeIcon } from '../SvgIcon';
import StarryBg from '../StarryBg';
import FixtureList from '../FixtureList';
import WelcomeScreen from '../screens/WelcomeScreen';
import MissingScreen from '../screens/MissingScreen';
import WebIndexErrorScreen from '../screens/WebIndexErrorScreen';
import WebBundlingScreen from '../screens/WebBundlingScreen';
import { NativePendingScreen } from '../screens/NativePendingScreen';
import { NativeSelectedScreen } from '../screens/NativeSelectedScreen';
import { FadeIn } from '../screens/shared/FadeIn';
import DragHandle from '../DragHandle';
import FixtureEditor from '../FixtureEditor';
import styles from './index.less';

import type { FixtureNames } from 'react-cosmos-flow/module';
import type {
  LoaderReadyMessage,
  FixtureListUpdateMessage,
  FixtureLoadMessage,
  FixtureUpdateMessage,
  LoaderMessage
} from 'react-cosmos-flow/loader';
import type {
  PlaygroundOpts,
  PlaygroundWebOpts,
  PlaygroundNativeOpts
} from 'react-cosmos-flow/playground';
import type { UrlParams } from '../../context';

export const LEFT_NAV_SIZE = '__cosmos__left-nav-size';
export const FIXTURE_EDITOR_PANE_SIZE = '__cosmos__fixture-editor-pane-size';

type LoaderStatus =
  | 'PENDING'
  | 'WEB_INDEX_ERROR'
  | 'WEB_INDEX_OK'
  // This occurs when a runtime error error in reported before the loaderReady
  // event
  | 'BOOT_RUNTIME_ERROR'
  | 'READY';

type Props = {
  router: Object,
  options: PlaygroundOpts
} & UrlParams;

export type State = {
  loaderStatus: LoaderStatus,
  isDragging: boolean,
  leftNavSize: number,
  fixtureEditorPaneSize: number,
  orientation: 'landscape' | 'portrait',
  fixtures: FixtureNames,
  fixtureLoaded: boolean,
  fixtureBody: Object,
  plugin: { [prop: string]: mixed }
};

let socket;

export const defaultState = {
  loaderStatus: 'PENDING',
  isDragging: false,
  leftNavSize: 250,
  fixtureEditorPaneSize: 250,
  orientation: 'landscape',
  fixtures: {},
  fixtureLoaded: false,
  fixtureBody: {},
  plugin: {}
};

export default class ComponentPlayground extends Component<Props, State> {
  static defaultProps = {
    editor: false,
    fullScreen: false
  };

  // Exclude params with default values
  static getCleanUrlParams = (params: {}) =>
    omitBy(params, (val, key) => ComponentPlayground.defaultProps[key] === val);

  contentEl: ?HTMLElement;
  previewIframeEl: ?window;

  unmounted: boolean = false;
  state = defaultState;

  componentDidMount() {
    const { options } = this.props;

    window.addEventListener('message', this.onMessage, false);
    window.addEventListener('resize', this.onResize, false);

    if (options.platform === 'web') {
      this.checkLoaderIframeStatus(options.loaderUri);
    } else {
      socket = io();
      socket.on('cosmos-cmd', msg => {
        // TODO: Log messages using debug package
        this.onMessage({ data: msg });
      });

      // This is required when the loader was opened before the UI.
      // The `uiReady` message is not relevant for the web platform because
      // the iframe loader always loads _after_ the parent UI frame.
      this.postMessage({ type: 'uiReady' });
    }
  }

  componentWillUnmount() {
    this.unmounted = true;

    window.removeEventListener('message', this.onMessage);
    window.removeEventListener('resize', this.onResize);
  }

  componentWillReceiveProps({ component, fixture }: Props) {
    const { loaderStatus, fixtures } = this.state;

    if (loaderStatus === 'READY') {
      const fixtureChanged =
        component !== this.props.component || fixture !== this.props.fixture;

      if (fixtureChanged) {
        if (
          component &&
          fixture &&
          fixtureExists(fixtures, component, fixture)
        ) {
          this.selectFixture(component, fixture);
        } else {
          // Keep clean state when no fixture is selected. Helps plugins get the
          // right cue.
          this.clearFixtureState();
        }
      }
    }
  }

  onMessage = ({ data }: { data: LoaderMessage }) => {
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
    if (this.state.loaderStatus !== 'READY') {
      // TODO: Support BOOT_RUNTIME_ERROR for native
      this.setState({ loaderStatus: 'BOOT_RUNTIME_ERROR' });
    }
  }

  onLoaderReady({ fixtures }: LoaderReadyMessage) {
    this.setState(
      {
        loaderStatus: 'READY',
        fixtures
      },
      // We update the content orientation because the content width decreases
      // when the left nav becomes visible
      this.updateContentOrientation
    );

    const { component, fixture } = this.props;
    if (component && fixture && fixtureExists(fixtures, component, fixture)) {
      this.selectFixture(component, fixture);
    }
  }

  onFixtureListUpdate({ fixtures }: FixtureListUpdateMessage) {
    this.setState({
      fixtures
    });
  }

  onFixtureLoad({ fixtureBody }: FixtureLoadMessage) {
    this.setState({
      fixtureLoaded: true,
      fixtureBody
    });
  }

  onFixtureUpdate({ fixtureBody }: FixtureUpdateMessage) {
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
      if (component && fixture) {
        // Reset already selected fixture
        this.selectFixture(component, fixture);
      }
    } else {
      // Go to new URL and rely on componentWillReceiveProps flow
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

  onFixtureEdit = (fixtureBody: Object) => {
    this.setState({
      fixtureBody
    });

    this.postMessage({
      type: 'fixtureEdit',
      fixtureBody
    });
  };

  handleSetPluginState = (partialState: Object) => {
    this.setState({
      plugin: {
        ...this.state.plugin,
        ...partialState
      }
    });
  };

  handleContentRef = (node: ?HTMLElement) => {
    this.contentEl = node;
  };

  handleIframeRef = (node: ?window) => {
    this.previewIframeEl = node;
  };

  async checkLoaderIframeStatus(loaderUri: string) {
    // We can't do fetch requests when Cosmos exports are opened without a
    // web server (ie. via file:/// protocol), so we might as well be optimistic
    // and assume the Loader iframe responds 200
    if (location.protocol === 'file:') {
      this.restoreUserSettings(() => {
        this.setState({
          loaderStatus: 'WEB_INDEX_OK'
        });
      });
    } else {
      // Check if Loader is working
      const { status } = await fetch(loaderUri, {
        credentials: 'same-origin'
      });

      // At this point the component could be unmounted
      if (this.unmounted) {
        return;
      }

      if (status === 200) {
        // Wait until all session settings are read before rendering
        this.restoreUserSettings(() => {
          this.setState({
            loaderStatus: 'WEB_INDEX_OK'
          });
        });
      } else {
        this.setState({
          loaderStatus: 'WEB_INDEX_ERROR'
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
    if (!this.contentEl) {
      return;
    }

    const { offsetHeight, offsetWidth } = this.contentEl;
    const state = {
      orientation: offsetHeight > offsetWidth ? 'portrait' : 'landscape'
    };

    this.setState(state, cb);
  }

  render() {
    const {
      options,
      component,
      fixture,
      editor,
      fullScreen,
      router
    } = this.props;

    return (
      <UiContext.Provider
        value={{
          options,
          urlParams: { component, fixture, editor, fullScreen },
          state: this.state,
          setPluginState: this.handleSetPluginState,
          editFixture: this.onFixtureEdit,
          router,
          getCleanUrlParams: ComponentPlayground.getCleanUrlParams
        }}
      >
        <div className={styles.root}>{this.renderInner()}</div>
      </UiContext.Provider>
    );
  }

  renderInner() {
    const { fullScreen } = this.props;
    const { loaderStatus } = this.state;

    // Can't show left nav until we receive fixture list with READY event
    if (loaderStatus !== 'READY' || fullScreen) {
      return this.renderMainPane();
    }

    return [this.renderLeftNav(), this.renderMainPane()];
  }

  renderMainPane() {
    const { options, component, fixture, editor } = this.props;
    const { loaderStatus, fixtures, orientation } = this.state;

    // We can only check if a fixture exists once loader is READY and fixture
    // list has been received
    const isFixtureSelected =
      loaderStatus === 'READY' && Boolean(component && fixture);
    const isFixtureSelectedFound =
      isFixtureSelected && fixtureExists(fixtures, component, fixture);

    const classes = classNames(styles.content, {
      [styles.contentPortrait]: orientation === 'portrait',
      [styles.contentLandscape]: orientation === 'landscape'
    });

    return (
      <div key="content" ref={this.handleContentRef} className={classes}>
        {editor && isFixtureSelected && this.renderFixtureEditor()}
        <div className={styles.mainPane}>
          {options.platform === 'web'
            ? this.renderWebScreen({
                options,
                isFixtureSelected,
                isFixtureSelectedFound
              })
            : this.renderNativeScreen({
                options,
                isFixtureSelected,
                isFixtureSelectedFound
              })}
        </div>
      </div>
    );
  }

  renderWebScreen({
    options,
    isFixtureSelected,
    isFixtureSelectedFound
  }: {
    options: PlaygroundWebOpts,
    isFixtureSelected: boolean,
    isFixtureSelectedFound: boolean
  }) {
    const { component, fixture } = this.props;
    const { loaderStatus, fixtures } = this.state;
    const { loaderUri } = options;

    if (loaderStatus === 'PENDING') {
      return (
        <StarryBg>
          <FadeIn>
            <WebBundlingScreen delay={2} />
          </FadeIn>
        </StarryBg>
      );
    }

    if (loaderStatus === 'WEB_INDEX_ERROR') {
      return (
        <StarryBg>
          <FadeIn>
            <WebIndexErrorScreen options={options} />
          </FadeIn>
        </StarryBg>
      );
    }

    if (loaderStatus === 'WEB_INDEX_OK') {
      // Warning: Ensure <Fragment><Loader> node hierarchy in return value to
      // reuse iframe DOM element between renders
      return (
        <>
          <StarryBg />
          {this.renderLoader({
            loaderUri,
            showLoader: false
          })}
        </>
      );
    }

    if (loaderStatus === 'BOOT_RUNTIME_ERROR') {
      return (
        // Warning: Ensure <Fragment><Loader> node hierarchy in return value to
        // reuse iframe DOM element between renders
        <>
          {this.renderLoader({
            loaderUri,
            showLoader: true
          })}
        </>
      );
    }

    if (loaderStatus !== 'READY') {
      throw new Error(
        `Trying to load web loader with '${loaderStatus}' status`
      );
    }

    if (!isFixtureSelected) {
      // Warning: Ensure <Fragment><Loader> node hierarchy in return value to
      // reuse iframe DOM element between renders
      return (
        <>
          <StarryBg>
            <FadeIn>
              <WelcomeScreen fixtures={fixtures} />
            </FadeIn>
          </StarryBg>
          {this.renderLoader({
            loaderUri,
            showLoader: false
          })}
        </>
      );
    }

    if (!isFixtureSelectedFound) {
      // Warning: Ensure <Fragment><Loader> node hierarchy in return value to
      // reuse iframe DOM element between renders
      return (
        <>
          <StarryBg>
            <FadeIn>
              <MissingScreen componentName={component} fixtureName={fixture} />
            </FadeIn>
          </StarryBg>
          {this.renderLoader({
            loaderUri,
            showLoader: false
          })}
        </>
      );
    }

    return (
      // Warning: Ensure <Fragment><Loader> return value to preserve loader
      // instance between renders
      <>{this.renderLoader({ loaderUri, showLoader: true })}</>
    );
  }

  renderNativeScreen({
    isFixtureSelected,
    isFixtureSelectedFound
  }: {
    options: PlaygroundNativeOpts,
    isFixtureSelected: boolean,
    isFixtureSelectedFound: boolean
  }) {
    const { component, fixture } = this.props;
    const { loaderStatus, fixtures } = this.state;

    if (loaderStatus === 'PENDING') {
      return (
        <StarryBg>
          <FadeIn>
            <NativePendingScreen />
          </FadeIn>
        </StarryBg>
      );
    }

    if (loaderStatus !== 'READY') {
      throw new Error(
        `Trying to load native loader with '${loaderStatus}' status`
      );
    }

    if (!isFixtureSelected) {
      return (
        <StarryBg>
          <FadeIn>
            <WelcomeScreen fixtures={fixtures} />
          </FadeIn>
        </StarryBg>
      );
    }

    if (!isFixtureSelectedFound) {
      return (
        <StarryBg>
          <FadeIn>
            <MissingScreen componentName={component} fixtureName={fixture} />
          </FadeIn>
        </StarryBg>
      );
    }

    return (
      <StarryBg>
        <FadeIn>
          <NativeSelectedScreen />
        </FadeIn>
      </StarryBg>
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
              <Slot name="header-buttons" />
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
          <FixtureEditor value={fixtureBody} onChange={this.onFixtureEdit} />
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

  renderLoader({
    loaderUri,
    showLoader
  }: {
    loaderUri: string,
    showLoader: boolean
  }) {
    const { isDragging } = this.state;
    const previewStyle = {
      display: showLoader ? 'flex' : 'none'
    };
    const previewOverlayStyle = {
      display: isDragging ? 'block' : 'none'
    };

    return (
      <div key="preview" className={styles.preview} style={previewStyle}>
        <Slot name="preview">
          <iframe ref={this.handleIframeRef} src={loaderUri} frameBorder={0} />
        </Slot>
        <div className={styles.previewOverlay} style={previewOverlayStyle} />
      </div>
    );
  }

  postMessage(data: LoaderMessage) {
    // TODO: Log messages using debug package
    if (this.props.options.platform === 'web') {
      if (this.previewIframeEl) {
        this.previewIframeEl.contentWindow.postMessage(data, '*');
      }
    } else {
      socket.emit('cosmos-cmd', data);
    }
  }

  clearFixtureState() {
    // TODO: Message Loader to unselect current fixture
    // this.postMessage({
    //   type: 'fixtureClear'
    // });

    this.setState({
      fixtureLoaded: false
      // Allow plugins to use attributes from previous fixtureBody until next
      // fixture loads. Together with fixtureLoaded flag, invalidated states
      // with data from previous fixture can be created.
      // fixtureBody: {}
    });
  }

  selectFixture(component: string, fixture: string) {
    this.clearFixtureState();

    this.postMessage({
      type: 'fixtureSelect',
      component,
      fixture
    });
  }
}

function isNumber(val) {
  return typeof val !== 'number';
}

function fixtureExists(fixtures: FixtureNames, component, fixture): boolean {
  return component && fixture
    ? fixtures[component] && fixtures[component].indexOf(fixture) !== -1
    : false;
}
