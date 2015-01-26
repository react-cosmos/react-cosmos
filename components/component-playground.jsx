var classSet = React.addons.classSet;

Cosmos.components.ComponentPlayground = React.createClass({
  mixins: [Cosmos.mixins.PersistState,
           Cosmos.mixins.Url],

  displayName: 'ComponentPlayground',

  propTypes: {
    fixtures: React.PropTypes.object.isRequired,
    fixturePath: React.PropTypes.string
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
      var props = {
        component: this._getComponentNameFromPath(this.props.fixturePath)
      };

      if (this.props.router) {
        props.router = this.props.router;
      }

      var fixture = this._getFixtureContentsFromPath(this.props.fixturePath);
      return _.extend(props, fixture);
    }
  },

  render: function() {
    return (
      <div className="component-playground">
        <div className="fixtures">
          {this.renderFixtures()}
        </div>
        <div className="preview">
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
          'expanded-component':
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

        return <li key={fixtureName}>
          <a href={url} onClick={this.routeLink}>
            {fixtureName.replace(/-/g, ' ')}
          </a>
        </li>;

      }.bind(this))}
    </ul>;
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
