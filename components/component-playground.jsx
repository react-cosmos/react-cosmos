var classSet = React.addons.classSet;

Cosmos.components.ComponentPlayground = React.createClass({
  /**
   * The Component Playground provides a minimal frame for loading React
   * components in isolation. It can either render the component full-screen or
   * with the navigation pane on the side.
   */
  mixins: [Cosmos.mixins.ComponentTree,
           Cosmos.mixins.Url],

  displayName: 'ComponentPlayground',

  propTypes: {
    fixtures: React.PropTypes.object.isRequired,
    fixturePath: React.PropTypes.string,
    fullScreen: React.PropTypes.bool,
    containerClassName: React.PropTypes.string
  },

  getInitialState: function() {
    var expandedComponents = [];

    // Expand the relevant component when a fixture is selected
    if (this.props.fixturePath) {
      expandedComponents.push(
        this._getComponentNameFromPath(this.props.fixturePath));
    }

    return {
      expandedComponents: expandedComponents
    };
  },

  children: {
    preview: function() {
      var fixturePath = this.props.fixturePath;

      var props = {
        component: this._getComponentNameFromPath(fixturePath),
        key: fixturePath
      };

      if (this.props.router) {
        props.router = this.props.router;
      }

      var fixture = this._getFixtureContentsFromPath(fixturePath);
      return _.merge(props, fixture);
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
          {this.renderFullScreenButton()}
          <h1>
            <a href="?"
               className="home-link"
               onClick={this.routeLink}>
              <span className="react">React</span> Component Playground
            </a>
            <span className="cosmos-plug">
              {"powered by "}
              <a href="https://github.com/skidding/cosmos">Cosmos</a>
            </span>
          </h1>
        </div>
        <div className="fixtures">
          {this.renderFixtures()}
        </div>
        <div ref="preview" className={this._getPreviewClasses()}>
          {this.props.fixturePath ? this.loadChild('preview') : null}
        </div>
      </div>
    );
  },

  renderFixtures: function() {
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
               onClick={_.partial(this.handleComponentClick, componentName)}
               ref={componentName + "Button"}>
              {componentName}
            </a>
          </p>
          {this.renderComponentFixtures(componentName, fixtures)}
        </li>;

      }.bind(this))}
    </ul>
  },

  renderComponentFixtures: function(componentName, fixtures) {
    return <ul className="component-fixtures">
      {_.map(fixtures, function(props, fixtureName) {

        var url = this.getUrlFromProps({
          fixturePath: componentName + '/' + fixtureName
        });

        return <li className={this._getFixtureClasses(fixtureName)}
                   key={fixtureName}>
          <a href={url} onClick={this.routeLink}>
            {fixtureName.replace(/-/g, ' ')}
          </a>
        </li>;

      }.bind(this))}
    </ul>;
  },

  renderFullScreenButton: function() {
    if (!this.props.fixturePath) {
      return;
    }

    var fullScreenUrl = this.getUrlFromProps({
      fixturePath: this.props.fixturePath,
      fullScreen: true
    });

    return <a href={fullScreenUrl}
              className="full-screen-button"
              ref="fullScreenButton">Fullscreen</a>;
  },

  handleComponentClick: function(componentName, event) {
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

  _getPreviewClasses: function() {
    var classes = {
      'preview': true
    };

    if (this.props.containerClassName) {
      classes[this.props.containerClassName] = true;
    }

    return classSet(classes);
  },

  _getFixtureClasses: function(fixtureName) {
    var classes = {
      'component-fixture': true
    };

    var fixturePath = this.props.fixturePath;
    if (fixturePath) {
      var selectedFixtureName = this._getFixtureNameFromPath(fixturePath);
      classes['selected'] = fixtureName === selectedFixtureName;
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
