/** @jsx React.DOM */

Cosmos.components.MovieCredits = React.createClass({
  /**
   * Expected input:
   * {
   *   component: "MovieCredits",
   *   crew: [{
   *     name: "Christopher Nolan",
   *     department: "Directing",
   *     personProps: {
   *       component: "Person",
   *       id: 525
   *     }
   *   }, {
   *     name: "Jonathan Nolan",
   *     department: "Writing",
   *     personProps: {
   *       component: "Person",
   *       id: 527
   *     }
   *   }],
   *   cast: [{
   *     name: "Christian Bale",
   *     order: 0,
   *     personProps: {
   *       component: "Person",
   *       id: 3894
   *     }
   *   }, {
   *     name: "Heath Ledger",
   *     order: 1,
   *     personProps: {
   *       component: "Person",
   *       id: 1810
   *     }
   *   }]
   * }
   */
  mixins: [Cosmos.mixins.PersistState,
           Cosmos.mixins.Url],
  render: function() {
    var credits = {
      Director: this.getCrewFromDepartment('Directing'),
      Writer: this.getCrewFromDepartment('Writing'),
      Actor: this.getActors()
    };
    return (
      <ul className="credits">
        {_.map(credits, function(people, type) {
          if (!_.isEmpty(people)) {
            return this.renderPeopleLinksForDepartment(type, people);
          }
        }.bind(this))}
      </ul>
    );
  },
  renderPeopleLinksForDepartment: function(name, people) {
    // Add links around people's names
    var creditsWithLinks = _.map(people, function(person) {
      return (
        <li>
          <a href={this.getUrlFromProps(person.personProps)}>
            {person.name}
          </a>
        </li>
      );
    }.bind(this));
    return (
      <li>
        <span className="credit-label">
          {this.getItemPrefix(name, people.length)}
        </span>
        <ul className="credit-value">
          {creditsWithLinks}
        </ul>
      </li>
    );
  },
  getCrewFromDepartment: function(department) {
    var crew = _.filter(this.props.crew, function(member) {
        return member.department == department;
    });
    return _.map(crew, function(member) {
      return member;
    });
  },
  getActors: function() {
    var actors = _.sortBy(this.props.cast, function(actor) {
      return actor.order;
    });
    return _.map(actors.slice(0, 4), function(actor) {
      return actor;
    });
  },
  getItemPrefix: function(singular, itemLength) {
    return itemLength > 1 ? singular + 's' : singular;
  }
});
