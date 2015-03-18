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
    selectedComponent: React.PropTypes.string,
    selectedFixture: React.PropTypes.string,
    fixtureEditor: React.PropTypes.bool,
    fullScreen: React.PropTypes.bool,
    containerClassName: React.PropTypes.string
  },

  statics: {
    getExpandedComponents: function(props, alreadyExpanded) {
      if (!props.selectedComponent ||
          _.contains(alreadyExpanded, props.selectedComponent)) {
        return alreadyExpanded;
      }

      return alreadyExpanded.concat(props.selectedComponent);
    },

    isFixtureSelected: function(props) {
      return props.selectedComponent && props.selectedFixture;
    },

    getSelectedFixtureContents: function(props) {
      if (!this.isFixtureSelected(props)) {
        return {};
      }

      var fixture = props.fixtures[props.selectedComponent]
                                  [props.selectedFixture];

      return _.extend({
        component: props.selectedComponent
      }, fixture);
    },

    getSelectedFixtureUserInput: function(props) {
      if (!this.isFixtureSelected(props)) {
        return '{}';
      }

      return JSON.stringify(this.getSelectedFixtureContents(props), null, 2);
    },

    getFixtureState: function(props, expandedComponents) {
      return {
        expandedComponents: this.getExpandedComponents(props,
                                                       expandedComponents),
        fixtureContents: this.getSelectedFixtureContents(props),
        fixtureUserInput: this.getSelectedFixtureUserInput(props),
        isFixtureUserInputValid: true
      };
    }
  },

  getDefaultProps: function() {
    return {
      fixtureEditor: false,
      fullScreen: false
    };
  },

  getInitialState: function() {
    return this.constructor.getFixtureState(this.props, []);
  },

  children: {
    preview: function() {
      var props = {
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

    var homeUrlProps = {
      fixtureEditor: this.props.fixtureEditor
    };

    return (
      <div className={classes}>
        <div className="header">
          {this._renderButtons()}
          <h1>
            <a href={this.getUrlFromProps(homeUrlProps)}
               className="home-link"
               onClick={this.routeLink}>
              <span className="react">React</span> Component Playground
            </a>
            {_.isEmpty(this.state.fixtureContents) ? this._renderCosmosPlug()
                                                   : null}
          </h1>
        </div>
        <div className="fixtures">
          {this._renderFixtures()}
        </div>
        {this._renderContentFrame()}
      </div>
    );
  },

  _renderCosmosPlug: function() {
    return <span ref="cosmosPlug" className="cosmos-plug">
      {'powered by '}
      <a href="https://github.com/skidding/cosmos">Cosmos</a>
    </span>;
  },

  _renderFixtures: function() {
    return <ul className="components">
      {_.map(this.props.fixtures, function(fixtures, componentName) {

        var classes = classSet({
          'component': true,
          'expanded': _.contains(this.state.expandedComponents, componentName)
        });

        return <li className={classes} key={componentName}>
          <p className="component-name">
            <a ref={componentName + 'Button'}
               href="#toggle-component"
               title={componentName}
               onClick={_.partial(this.onComponentClick, componentName)}>
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
          selectedComponent: componentName,
          selectedFixture: fixtureName,
          fixtureEditor: this.props.fixtureEditor
        };

        return <li className={this._getFixtureClasses(componentName,
                                                      fixtureName)}
                   key={fixtureName}>
          <a href={this.getUrlFromProps(fixtureProps)}
             title={fixtureName}
             onClick={this.routeLink}>
            {fixtureName}
          </a>
        </li>;

      }.bind(this))}
    </ul>;
  },

  _renderContentFrame: function() {
    return <div className="content-frame">
      <div ref="previewContainer" className={this._getPreviewClasses()}>
        {!_.isEmpty(this.state.fixtureContents) ? this.loadChild('preview')
                                                : null}
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
                value={this.state.fixtureUserInput}
                onChange={this.onFixtureChange}>
      </textarea>
    </div>;
  },

  _renderButtons: function() {
    var isFixtureSelected = this.constructor.isFixtureSelected(this.props);

    return <ul className="buttons">
      {this._renderFixtureEditorButton()}
      {isFixtureSelected ? this._renderFullScreenButton() : null}
    </ul>;
  },

  _renderFixtureEditorButton: function() {
    var classes = classSet({
      'fixture-editor-button': true,
      'selected-button': this.props.fixtureEditor
    });

    var fixtureEditorUrlProps = {
      fixtureEditor: !this.props.fixtureEditor
    };

    if (this.constructor.isFixtureSelected(this.props)) {
      _.extend(fixtureEditorUrlProps, {
        selectedComponent: this.props.selectedComponent,
        selectedFixture: this.props.selectedFixture
      });
    }

    return <li className={classes}>
      <a href={this.getUrlFromProps(fixtureEditorUrlProps)}
         ref="fixtureEditorButton"
         onClick={this.routeLink}>Editor</a>
    </li>;
  },

  _renderFullScreenButton: function() {
    var fullScreenUrl = this.getUrlFromProps({
      selectedComponent: this.props.selectedComponent,
      selectedFixture: this.props.selectedFixture,
      fullScreen: true
    });

    return <li className="full-screen-button">
      <a href={fullScreenUrl}
         ref="fullScreenButton"
         onClick={this.routeLink}>Fullscreen</a>
    </li>;
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.selectedComponent !== this.props.selectedComponent ||
        nextProps.selectedFixture !== this.props.selectedFixture) {
      this.setState(this.constructor.getFixtureState(
          nextProps, this.state.expandedComponents));
    }
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
      newState.fixtureContents = userInput ? JSON.parse(userInput) : {};
      newState.isFixtureUserInputValid = true;
    } catch (e) {
      newState.isFixtureUserInputValid = false;
      console.error(e);
    }

    this.setState(newState);
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

    classes['selected'] = componentName === this.props.selectedComponent &&
                          fixtureName === this.props.selectedFixture;

    return classSet(classes);
  }
});
