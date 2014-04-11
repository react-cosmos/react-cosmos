/** @jsx React.DOM */

Cosmos.components.MovieCredits = React.createClass({
  /**
   * Expected input:
   * {
   *   component: "MovieCredits",
   *   crew: [{
   *     name: "Christopher Nolan",
   *     department: "Directing"
   *   }, {
   *     name: "Jonathan Nolan",
   *     department: "Writing"
   *   }],
   *   cast: [{
   *     name: "Christian Bale",
   *     order: 0
   *   }, {
   *     name: "Heath Ledger",
   *     order: 1
   *   }]
   * }
   */
  mixins: [Cosmos.mixins.PersistState],
  render: function() {
    var directors = this.getCrewFromDepartment('Directing'),
        writers = this.getCrewFromDepartment('Writing'),
        actors = this.getActors();
    return (
      <ul className="movie-credits">
        <li>
          <span className="movie-credit-label">
            {this.getItemPrefix('Director', directors.length)}
          </span>
          <span className="movie-credit-value">
            {directors.join(', ')}
          </span>
        </li>
        <li>
          <span className="movie-credit-label">
            {this.getItemPrefix('Writer', writers.length)}
          </span>
          <span className="movie-credit-value">
            {writers.join(', ')}
            </span>
        </li>
        <li>
          <span className="movie-credit-label">
            {this.getItemPrefix('Actor', actors.length)}
          </span>
          <span className="movie-credit-value">
            {actors.join(', ')}
          </span>
        </li>
      </ul>
    );
  },
  getCrewFromDepartment: function(department) {
    var crew = _.filter(this.props.crew, function(member) {
        return member.department == department;
    });
    return _.map(crew, function(member) {
      return member.name;
    });
  },
  getActors: function() {
    var actors = _.sortBy(this.props.cast, function(actor) {
      return actor.order;
    });
    return _.map(actors.slice(0, 4), function(actor) {
      return actor.name;
    });
  },
  getItemPrefix: function(singular, itemLength) {
    return itemLength > 1 ? singular + 's' : singular;
  }
});
