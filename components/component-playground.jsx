require('./component-playground.less');

var _ = require('lodash'),
    React = require('react/addons'),
    classSet = React.addons.classSet,
    ComponentTree = require('../mixins/component-tree.js'),
    RouterMixin = require('../mixins/router.js');

module.exports = React.createClass({
  /**
   * The Component Playground provides a minimal frame for loading React
   * components in isolation. It can either render the component full-screen or
   * with the navigation pane on the side.
   */
  displayName: 'ComponentPlayground',

  mixins: [ComponentTree, RouterMixin],

  propTypes: {
    fixtures: React.PropTypes.object.isRequired,
    fixturePath: React.PropTypes.string,
    fixtureEditor: React.PropTypes.bool,
    fullScreen: React.PropTypes.bool,
    containerClassName: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      fixtureEditor: false,
      fullScreen: false
    };
  },

  getInitialState: function() {
    return {
      expandedComponents: this._getInitialExpandedComponents(),
      fixtureContents: this._getInitialFixtureContents(),
      fixtureUserInput: this._getInitialFixtureUserInput(),
      isFixtureUserInputValid: true
    };
  },

  children: {
    preview: function() {
      var fixturePath = this.props.fixturePath;

      var props = {
        component: this._getComponentNameFromPath(fixturePath),
        // Child should re-render whenever fixture changes
        key: JSON.stringify(this.state.fixtureContents)
      };

      if (this.props.router) {
        props.router = this.props.router;
      }

      return _.merge(props, this.state.fixtureContents);
    }
  },

  render: function() {
    var classes = classSet({
      'component-playground': true,
      'full-screen': this.props.fullScreen
    });

    return (
      <div className={classes}>
        <div className="header">
          {this.props.fixturePath ? this._renderButtons() : null}
          <h1>
            <a href="?"
               className="home-link"
               onClick={this.routeLink}>
              <span className="react">React</span> Component Playground
            </a>
            <span className="cosmos-plug">
              {'powered by '}
              <a href="https://github.com/skidding/cosmos">Cosmos</a>
            </span>
          </h1>
        </div>
        <div className="fixtures">
          {this._renderFixtures()}
        </div>
        {this._renderContentFrame()}
      </div>
    );
  },

  _renderFixtures: function() {
    return <ul className="components">
      {_.map(this.props.fixtures, function(fixtures, componentName) {

        var classes = classSet({
          'component': true,
          'expanded':
            this.state.expandedComponents.indexOf(componentName) !== -1
        });

        return <li className={classes} key={componentName}>
          <p className="component-name">
            <a href="#toggle-component"
               onClick={_.partial(this.onComponentClick, componentName)}
               ref={componentName + 'Button'}>
              {componentName}
            </a>
          </p>
          {this._renderComponentFixtures(componentName, fixtures)}
        </li>;

      }.bind(this))}
    </ul>
  },

  _renderComponentFixtures: function(componentName, fixtures) {
    return <ul className="component-fixtures">
      {_.map(fixtures, function(props, fixtureName) {

        var fixtureProps = {
          fixturePath: componentName + '/' + fixtureName
        };

        if (this.props.fixtureEditor) {
          fixtureProps.fixtureEditor = true;
        }

        return <li className={this._getFixtureClasses(componentName,
                                                      fixtureName)}
                   key={fixtureName}>
          <a href={this.getUrlFromProps(fixtureProps)}
             onClick={this.routeLink}>
            {fixtureName.replace(/-/g, ' ')}
          </a>
        </li>;

      }.bind(this))}
    </ul>;
  },

  _renderContentFrame: function() {
    return <div className="content-frame">
      <div ref="previewContainer" className={this._getPreviewClasses()}>
        {this.props.fixturePath ? this.loadChild('preview') : null}
      </div>
      {this.props.fixtureEditor ? this._renderFixtureEditor() : null}
    </div>
  },

  _renderFixtureEditor: function() {
    var editorClasses = classSet({
      'fixture-editor': true,
      'invalid-syntax': !this.state.isFixtureUserInputValid
    });

    return <div className="fixture-editor-outer">
      <textarea ref="fixtureEditor"
                className={editorClasses}
                defaultValue={this.state.fixtureUserInput}
                onChange={this.onFixtureChange}>
      </textarea>
    </div>;
  },

  _renderButtons: function() {
    return <ul className="buttons">
      {this._renderFixtureEditorButton()}
      {this._renderFullScreenButton()}
    </ul>;
  },

  _renderFixtureEditorButton: function() {
    var classes = classSet({
      'fixture-editor-button': true,
      'selected-button': this.props.fixtureEditor
    });

    var fixtureEditorUrl = this.getUrlFromProps({
      fixturePath: this.props.fixturePath,
      fixtureEditor: !this.props.fixtureEditor
    });

    return <li className={classes}>
      <a href={fixtureEditorUrl}
         ref="fixtureEditorButton"
         onClick={this.routeLink}>Editor</a>
    </li>;
  },

  _renderFullScreenButton: function() {
    var fullScreenUrl = this.getUrlFromProps({
      fixturePath: this.props.fixturePath,
      fullScreen: true
    });

    return <li className="full-screen-button">
      <a href={fullScreenUrl}
         ref="fullScreenButton"
         onClick={this.routeLink}>Fullscreen</a>
    </li>;
  },

  onComponentClick: function(componentName, event) {
    event.preventDefault();

    var currentlyExpanded = this.state.expandedComponents,
        componentIndex = currentlyExpanded.indexOf(componentName),
        toBeExpanded;

    if (componentIndex !== -1) {
      toBeExpanded = _.clone(currentlyExpanded);
      toBeExpanded.splice(componentIndex, 1);
    } else {
      toBeExpanded = currentlyExpanded.concat(componentName);
    }

    this.setState({expandedComponents: toBeExpanded});
  },

  onFixtureChange: function(event) {
    var userInput = event.target.value,
        newState = {fixtureUserInput: userInput};

    try {
      newState.fixtureContents = JSON.parse(userInput);
      newState.isFixtureUserInputValid = true;
    } catch (e) {
      newState.isFixtureUserInputValid = false;
      console.error(e);
    }

    this.setState(newState);
  },

  _getInitialExpandedComponents: function() {
    var components = [];

    // Expand the relevant component when a fixture is selected
    if (this.props.fixturePath) {
      components.push(this._getComponentNameFromPath(this.props.fixturePath));
    }

    return components;
  },

  _getInitialFixtureContents: function() {
    if (!this.props.fixturePath) {
      return null;
    }

    return this._getFixtureContentsFromPath(this.props.fixturePath);
  },

  _getInitialFixtureUserInput: function() {
    if (!this.props.fixturePath) {
      return '';
    }

    var contents = this._getFixtureContentsFromPath(this.props.fixturePath);
    return JSON.stringify(contents, null, 2);
  },

  _getPreviewClasses: function() {
    var classes = {
      'preview': true,
      'aside-fixture-editor': this.props.fixtureEditor
    };

    if (this.props.containerClassName) {
      classes[this.props.containerClassName] = true;
    }

    return classSet(classes);
  },

  _getFixtureClasses: function(componentName, fixtureName) {
    var classes = {
      'component-fixture': true
    };

    var fixturePath = this.props.fixturePath;
    if (fixturePath) {
      var selectedComponentName = this._getComponentNameFromPath(fixturePath),
          selectedFixtureName = this._getFixtureNameFromPath(fixturePath);
      classes['selected'] = componentName === selectedComponentName &&
                            fixtureName === selectedFixtureName;
    }

    return classSet(classes);
  },

  _getFixtureContentsFromPath: function(fixturePath) {
    var componentName = this._getComponentNameFromPath(fixturePath),
        fixtureName = this._getFixtureNameFromPath(fixturePath);

    return this.props.fixtures[componentName][fixtureName];
  },

  _getComponentNameFromPath: function(fixturePath) {
    return fixturePath.split('/')[0];
  },

  _getFixtureNameFromPath: function(fixturePath) {
    return fixturePath.substr(fixturePath.indexOf('/') + 1);
  }
});
