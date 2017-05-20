import _ from 'lodash';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import React from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import isEqual from 'lodash.isequal';
import CodeMirror from '@skidding/react-codemirror';
import fuzzaldrinPlus from 'fuzzaldrin-plus';
import SplitPane from 'react-split-pane';
import localStorageLib from '../lib/local-storage';
import WelcomeScreen from './welcome-screen';
import ErrorScreen from './error-screen';
import ComponentTree from 'react-component-tree';
import { uri } from 'react-querystring-router';
import splitUnserializableParts from 'react-cosmos-utils/lib/unserializable-parts';

const style = require('./component-playground.less');

require('codemirror/lib/codemirror.css');
require('codemirror/addon/fold/foldgutter.css');
require('codemirror/theme/solarized.css');
require('./codemirror.css');

require('codemirror/mode/javascript/javascript');
require('codemirror/addon/fold/foldcode');
require('codemirror/addon/fold/foldgutter');
require('codemirror/addon/fold/brace-fold');

const { stringifyParams, parseLocation } = uri;

const SvgIcon = ({ children }) => (
  <svg viewBox="0 0 24 24">
    {children}
  </svg>
);

const FolderIcon = () => (
  <SvgIcon>
    <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
  </SvgIcon>
);

const SearchIcon = () => (
  <SvgIcon>
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
  </SvgIcon>
);

const HomeIcon = () => (
  <SvgIcon>
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
  </SvgIcon>
);

const CodeIcon = () => (
  <SvgIcon>
    <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
  </SvgIcon>
);

const FullScreenIcon = () => (
  <SvgIcon>
    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
  </SvgIcon>
);

module.exports = createReactClass({
  /**
   * ComponentPlayground provides a minimal frame for loading React components
   * in isolation. It can either render the component full-screen or with the
   * navigation pane on the side.
   */
  displayName: 'ComponentPlayground',

  propTypes: {
    component: PropTypes.string,
    editor: PropTypes.bool,
    fixture: PropTypes.string,
    fixtures: PropTypes.object.isRequired,
    fullScreen: PropTypes.bool,
    loaderUri: PropTypes.string.isRequired,
    router: PropTypes.object.isRequired,
  },

  mixins: [ComponentTree.Mixin],

  statics: {
    isFixtureSelected(props) {
      return Boolean(props.component && props.fixture);
    },

    didFixtureNavChange(prevProps, nextProps) {
      return prevProps.component !== nextProps.component ||
             prevProps.fixture !== nextProps.fixture;
    },

    getSelectedFixtureContents(props) {
      const { fixtures, component, fixture } = props;

      // This returns the fixture contents as it is initially defined, excluding any modifications.
      return component && fixture && fixtures[component] && fixtures[component][fixture];
    },

    doesSelectedFixtureExist(props) {
      const { fixtures, component, fixture } = props;

      return Boolean(fixtures[component] && fixtures[component][fixture]);
    },

    getStringifiedFixtureContents(fixtureContents) {
      return JSON.stringify(fixtureContents, null, 2);
    },

    getFixtureState(props) {
      const state = {
        fixtureContents: {},
        fixtureUnserializableProps: {},
        fixtureUserInput: '{}',
        isFixtureUserInputValid: true,
      };

      if (this.isFixtureSelected(props) && this.doesSelectedFixtureExist(props)) {
        const originalFixtureContents = this.getSelectedFixtureContents(props);

        // Unserializable props are stored separately from serializable ones
        // because the serializable props can be overriden by the user using
        // the editor, while the unserializable props are always attached
        // behind the scenes
        const {
          unserializable,
          serializable,
        } = splitUnserializableParts(originalFixtureContents);

        _.assign(state, {
          fixtureContents: serializable,
          fixtureUnserializableProps: unserializable,
          fixtureUserInput: this.getStringifiedFixtureContents(serializable),
        });
      }

      return state;
    },
  },

  getDefaultProps() {
    return {
      component: null,
      editor: false,
      fixture: null,
      fullScreen: false,
      proxies: [],
    };
  },

  getInitialState() {
    const defaultState = {
      isEditorFocused: false,
      orientation: 'landscape',
      searchText: '',
      isDraggingPane: false,
    };

    return _.assign(defaultState, this.constructor.getFixtureState(this.props));
  },

  children: {
    splitPane() {
      return {
        component: SplitPane,
        key: 'editorLoaderSplitPane',
        split: this.getOrientationDirection(),
        defaultSize: localStorageLib.get('splitPos'),
        onDragStarted: this.onPaneDragStart,
        onDragFinished: this.onPaneDragStop,
        onChange: (size => localStorageLib.set('splitPos', size)),
        minSize: 20,
        resizerClassName: this.getSplitPaneClasses('resizer'),
        children: [
          this.renderFixtureEditor(),
          this.renderLoader(),
        ],
      };
    },

    editor() {
      return {
        component: CodeMirror,
        key: 'editor',
        value: this.state.fixtureUserInput,
        preserveScrollPosition: true,
        onChange: this.onFixtureChange,
        onFocusChange: this.onEditorFocusChange,
        options: {
          mode: 'javascript',
          foldGutter: true,
          lineNumbers: true,
          theme: 'solarized light',
          gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        },
      };
    },

    welcome() {
      return {
        component: WelcomeScreen,
        key: 'welcome',
        hasComponents: this.userHasComponents(),
        hasFixtures: this.userHasFixtures(),
      };
    },

    error() {
      return {
        component: ErrorScreen,
        key: 'error',
        componentName: this.props.component,
        fixtureName: this.props.fixture,
      };
    },
  },

  render() {
    const isFixtureSelected = this.isFixtureSelected();

    const classes = classNames({
      [style['component-playground']]: true,
      [style['full-screen']]: this.props.fullScreen,
    });

    return (
      <div className={classes}>
        <div className={style['left-nav']}>
          <div className={style.header}>
            {this.renderHomeButton()}
            {isFixtureSelected &&
            this.doesSelectedFixtureExist() ? this.renderMenu() : null}
          </div>
          <div className={style['filter-input-container']}>
            <input
              ref="filterInput"
              className={style['filter-input']}
              placeholder="Search..."
              onChange={this.onSearchChange}
            />
            <SearchIcon />
          </div>
          <div className={style.fixtures}>
            {this.renderFixtures()}
          </div>
        </div>
        {this.renderContent()}
      </div>
    );
  },

  renderContent() {
    if (this.isFixtureSelected()) {
      return this.doesSelectedFixtureExist() ?
          this.renderContentFrame() :
          this.renderError();
    }

    return this.renderWelcomeScreen();
  },

  renderLoader() {
    return (
      <div
        key="loaderContainer"
        className={style.loader}
      >
        <iframe
          key="loaderFrame"
          className={style.frame}
          src={this.props.loaderUri}
          ref={this.onLoaderFrameRef}
        />
        {this.state.isDraggingPane ? <div className={style.frameOverlay} /> : null}
      </div>
    );
  },

  renderFixtures() {
    return (
      <ul className={style.components}>
        {_.map(this.getFilteredFixtures(), (componentFixtures, componentName) => (
          <li className={style.component} key={componentName}>
            <p
              ref={`componentName-${componentName}`}
              className={style['component-name']}
            >
              <FolderIcon /><span>{componentName}</span>
            </p>
            {this.renderComponentFixtures(componentName, componentFixtures)}
          </li>
        ))}
      </ul>
    );
  },

  renderComponentFixtures(componentName, fixtures) {
    return (
      <ul className={style['component-fixtures']}>
        {_.map(fixtures, (props, fixtureName) => {
          const fixtureProps = this.extendFixtureRoute({
            component: componentName,
            fixture: fixtureName,
          });

          return (
            <li
              className={this.getFixtureClasses(componentName, fixtureName)}
              key={fixtureName}
            >
              <a
                ref={`fixtureButton-${componentName}-${fixtureName}`}
                href={stringifyParams(fixtureProps)}
                title={fixtureName}
                onClick={this.onFixtureClick}
              >
                {fixtureName}
              </a>
            </li>
          );
        })}
      </ul>
    );
  },

  renderContentFrame() {
    return (
      <div ref="contentFrame" className={style['content-frame']}>
        {this.props.editor ? this.loadChild('splitPane') : this.renderLoader()}
      </div>
    );
  },

  renderFixtureEditor() {
    return (
      <div key="fixture-editor-outer" className={style['fixture-editor-outer']}>
        {this.loadChild('editor')}
      </div>
    );
  },

  renderHomeButton() {
    const classes = classNames({
      [style.button]: true,
      [style['home-button']]: true,
      [style['selected-button']]: !this.isFixtureSelected(),
    });

    return (
      <a
        ref="homeButton"
        className={classes}
        href={stringifyParams({})}
        onClick={this.props.router.routeLink}
      >
        <HomeIcon />
      </a>
    );
  },

  renderMenu() {
    return (
      <p className={style.menu}>
        {this.renderFixtureEditorButton()}
        {this.renderFullScreenButton()}
      </p>
    );
  },

  renderFixtureEditorButton() {
    const classes = classNames({
      [style.button]: true,
      [style['selected-button']]: this.props.editor,
    });

    const editorUrlProps = this.extendFixtureRoute({
      editor: !this.props.editor,
    });

    return (
      <a
        className={classes}
        href={stringifyParams(editorUrlProps)}
        ref="editorButton"
        onClick={this.props.router.routeLink}
        >
        <CodeIcon />
      </a>
    );
  },

  renderFullScreenButton() {
    const fullScreenProps = this.extendFixtureRoute({
      fullScreen: true,
      editor: false,
    });

    return (
      <a
        className={style.button}
        href={stringifyParams(fullScreenProps)}
        ref="fullScreenButton"
        onClick={this.props.router.routeLink}
        >
        <FullScreenIcon />
      </a>
    );
  },

  renderWelcomeScreen() {
    return (
      <div ref="contentFrame" className={style['content-frame']}>
        {this.loadChild('welcome')}
      </div>
    );
  },

  renderError() {
    return (
      <div ref="contentFrame" className={style['content-frame']}>
        {this.loadChild('error')}
      </div>
    );
  },

  componentWillMount() {
    this.onFixtureUpdate = _.throttle(this.onFixtureUpdate, 500);
  },

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize);
    window.addEventListener('message', this.onMessage, false);

    this.updateContentFrameOrientation();

    if (this.isFixtureSelected() && this.doesSelectedFixtureExist()) {
      findDOMNode(this.refs[`componentName-${this.props.component}`])
          .scrollIntoView({ behavior: 'smooth' });
    }
  },

  componentWillReceiveProps(nextProps) {
    const didFixtureNavChange = this.constructor.didFixtureNavChange(this.props, nextProps);

    // HMR might've rebuilt all fixtures
    const didSourcesChange = nextProps.fixtures !== this.props.fixtures;
    const didFixtureContentsChanged = didSourcesChange && !isEqual(
      this.constructor.getSelectedFixtureContents(this.props),
      this.constructor.getSelectedFixtureContents(nextProps),
    );

    if (didFixtureNavChange || didFixtureContentsChanged) {
      this.setState(
        this.constructor.getFixtureState(nextProps),
        this.sendFixtureToLoader,
      );
    } else if (didSourcesChange) {
      // Inject current fixture contents in newly loaded component
      this.sendFixtureToLoader();
    }
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('message', this.onMessage);
  },

  onMessage({ data }) {
    const { type, fixtureBody } = data;

    if (type === 'loaderReady') {
      this.sendFixtureToLoader();
    }

    if (type === 'fixtureUpdate') {
      this.onFixtureUpdate(fixtureBody);
    }
  },

  onLoaderFrameRef(domNode) {
    this.loaderFrame = domNode;
  },

  onFixtureClick(event) {
    event.preventDefault();

    const location = event.currentTarget.href;
    const params = parseLocation(location);

    if (this.constructor.didFixtureNavChange(this.props, params)) {
      this.props.router.goTo(location);
    } else {
      // This happens when we want to reset a fixture to its original state by
      // clicking on the fixture button while already selected
      this.setState(
        this.constructor.getFixtureState(this.props),
        this.sendFixtureToLoader,
      );
    }
  },

  onEditorFocusChange(isFocused) {
    this.setState({ isEditorFocused: isFocused });
  },

  onFixtureUpdate(fixtureBody) {
    const {
      isEditorFocused,
      fixtureContents,
    } = this.state;

    // Don't update fixture contents while the user is editing the fixture
    if (isEditorFocused) {
      return;
    }

    // We assume data received in this handler is serializable (& thus
    // part of state.fixtureContents)
    const newFixtureContents = {
      ...fixtureContents,
      ...fixtureBody,
    };

    this.setState({
      fixtureContents: newFixtureContents,
      fixtureUserInput:
          this.constructor.getStringifiedFixtureContents(newFixtureContents),
      isFixtureUserInputValid: true,
    });
  },

  onFixtureChange(editorValue) {
    const newState = { fixtureUserInput: editorValue };

    try {
      const fixtureContents = {};

      if (editorValue) {
        _.merge(fixtureContents, JSON.parse(editorValue));
      }

      _.assign(newState, {
        fixtureContents,
        isFixtureUserInputValid: true,
      });
    } catch (err) {
      newState.isFixtureUserInputValid = false;

      console.error(err);
    }

    this.setState(newState, () => {
      if (this.state.isFixtureUserInputValid) {
        this.sendFixtureContentsToLoader();
      }
    });
  },

  onWindowResize() {
    this.updateContentFrameOrientation();
  },

  onSearchChange(e) {
    this.setState({
      searchText: e.target.value,
    });
  },

  onPaneDragStart() {
    this.setState({
      isDraggingPane: true,
    });
  },

  onPaneDragStop() {
    this.setState({
      isDraggingPane: false,
    });
  },

  isFixtureSelected() {
    return this.constructor.isFixtureSelected(this.props);
  },

  doesSelectedFixtureExist() {
    return this.constructor.doesSelectedFixtureExist(this.props);
  },

  getFixtureClasses(componentName, fixtureName) {
    return classNames({
      [style['component-fixture']]: true,
      [style.selected]: this.isCurrentFixtureSelected(componentName, fixtureName),
    });
  },

  isCurrentFixtureSelected(componentName, fixtureName) {
    return componentName === this.props.component &&
           fixtureName === this.props.fixture;
  },

  userHasComponents() {
    return Object.keys(this.props.fixtures).length > 0;
  },

  userHasFixtures() {
    return _.reduce(this.props.fixtures, (acc, compFixtures) => {
      const fixtureNames = Object.keys(compFixtures);

      return acc || fixtureNames[0].indexOf('(auto)') === -1;
    }, false);
  },

  extendFixtureRoute(newProps) {
    const currentProps = {
      component: this.props.component,
      fixture: this.props.fixture,
      editor: this.props.editor,
      fullScreen: this.props.fullScreen,
    };

    const defaultProps = this.constructor.getDefaultProps();
    const props = _.assign(_.omit(currentProps, _.keys(newProps)), newProps);

    // No need to include props with default values
    return _.omitBy(props, (value, key) => value === defaultProps[key]);
  },

  sendFixtureToLoader() {
    // Maybe iframe has not been loaded yet, in which case it'll receive
    // the fixture to load when it triggers the `loaderReady` event
    if (!this.loaderFrame) {
      return;
    }

    const {
      component,
      fixture,
    } = this.props;

    this.loaderFrame.contentWindow.postMessage({
      type: 'fixtureLoad',
      component,
      fixture,
    }, '*');
  },

  sendFixtureContentsToLoader() {
    // Edge-case: User makes edit inside fixture editor and Loader frame isn't
    // ready yet. Edit will be lost unless repeated after Loader boots.
    if (!this.loaderFrame) {
      return;
    }

    const { fixtureContents } = this.state;

    this.loaderFrame.contentWindow.postMessage({
      type: 'fixtureChange',
      fixtureBody: fixtureContents,
    }, '*');
  },

  updateContentFrameOrientation() {
    if (!this.isFixtureSelected() || !this.doesSelectedFixtureExist()) {
      return;
    }

    const contentNode = this.getContentNode();
    this.setState({
      orientation: contentNode.offsetHeight > contentNode.offsetWidth ?
                   'portrait' : 'landscape',
    });
  },

  getOrientationDirection() {
    return this.state.orientation === 'landscape' ? 'vertical' : 'horizontal';
  },

  getSplitPaneClasses(type) {
    return classNames(style[this.getOrientationDirection()], style[type]);
  },

  getContentNode() {
    return findDOMNode(this.refs.contentFrame);
  },

  getFilteredFixtures() {
    const fixtures = this.props.fixtures;

    if (this.state.searchText.length < 2) {
      return fixtures;
    }

    return _.reduce(fixtures, (acc, componentFixtures, componentName) => {
      const fixtureNames = Object.keys(componentFixtures);
      const search = this.state.searchText;

      const filteredFixtureNames = _.filter(fixtureNames, fixtureName => {
        const componentAndFixture = componentName + fixtureName;
        const fixtureAndComponent = fixtureName + componentName;

        // Ensure that the fuzzy search is working in both direction.
        // component + fixture and fixture + component. That's because the user
        // can search for fixture name and afterwards for component name and
        // we want to show the correct result.
        return !_.isEmpty(fuzzaldrinPlus.match(componentAndFixture, search)) ||
               !_.isEmpty(fuzzaldrinPlus.match(fixtureAndComponent, search)) ||
               this.isCurrentFixtureSelected(componentName, fixtureName);
      });

      // Do not render the component if there are no fixtures
      if (filteredFixtureNames.length === 0) {
        return acc;
      }

      // Show only the fixtures that matched the search query
      const filteredFixtures = _.reduce(filteredFixtureNames, (acc2, fixture) => {
        acc2[fixture] = componentFixtures[fixture];

        return acc2;
      }, {});

      acc[componentName] = filteredFixtures;

      return acc;
    }, {});
  },
});
