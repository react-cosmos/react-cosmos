/** @jsx React.DOM */

Cosmos.components.MovieCredits = React.createClass({
  mixins: [Cosmos.mixins.ClassName,
           Cosmos.mixins.PersistState],
  defaultClass: 'movie-credits',
  render: function() {
    var directors = this.getCrewFromDepartment('Directing'),
        writers = this.getCrewFromDepartment('Writing'),
        actors = this.getActors();
    return (
      <ul className="movie-credits">
        <li className="directors">
          {this.getItemPrefix('Director', directors.length)}:
          <strong>{directors.join(', ')}</strong>
        </li>
        <li className="writers">
          {this.getItemPrefix('Writer', writers.length)}:
          <strong>{writers.join(', ')}</strong>
        </li>
        <li className="actors">
          {this.getItemPrefix('Actor', actors.length)}:
          <strong>{actors.join(', ')}</strong>
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
    return _.map(this.props.cast.slice(0, 4), function(actor) {
      return actor.name;
    });
  },
  getItemPrefix: function(singular, itemLength) {
    return itemLength > 1 ? singular + 's' : singular;
  }
});
