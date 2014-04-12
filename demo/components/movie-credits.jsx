/** @jsx React.DOM */

var departmentRoleMappings = {
  directing: 'Director',
  writing: 'Writer',
  production: 'Producer',
  acting: 'Actor'
};

Cosmos.components.MovieCredits = React.createClass({
  /**
   * Expected input:
   * {
   *   component: "MovieCredits",
   *   credits: {
   *     acting: [{
   *       id: 3894,
   *       name: "Christian Bale"
   *       order: 0
   *     }],
   *     directing: [{
   *       id: 525,
   *       name: "Christopher Nolan"
   *     }],
   *     production: [{
   *       id: 525,
   *       name: "Christopher Nolan"
   *     }],
   *     writing: [{
   *       id: 527,
   *       name: "Jonathan Nolan"
   *     }]
   *   }
   * }
   */
  mixins: [Cosmos.mixins.PersistState,
           Cosmos.mixins.Url],
  render: function() {
    return (
      <ul className="credits">
        {_.map(this.props.credits, function(people, department) {
          return this.renderPeopleLinksForDepartment(people, department);
        }.bind(this))}
      </ul>
    );
  },
  renderPeopleLinksForDepartment: function(people, department) {
    // Ignore empty departments and producers
    if (_.isEmpty(people) || department == 'production') {
      return;
    }
    // Only show first 4 actors
    if (department == 'acting') {
      people = _.sortBy(people, function(actor) {
        return actor.order;
      }).slice(0, 4);
    }
    // Add links around people's names
    var creditsWithLinks = _.map(people, function(person) {
      return (
        <li key={person.id}>
          <a href={this.getUrlFromProps({component: 'Person', id: person.id})}>
            {person.name}
          </a>
        </li>
      );
    }.bind(this));
    return (
      <li key={department}>
        <span className="credit-label">
          {this.getItemPrefix(departmentRoleMappings[department], people.length)}
        </span>
        <ul className="credit-value">
          {creditsWithLinks}
        </ul>
      </li>
    );
  },
  getItemPrefix: function(singular, itemLength) {
    return itemLength > 1 ? singular + 's' : singular;
  }
});
