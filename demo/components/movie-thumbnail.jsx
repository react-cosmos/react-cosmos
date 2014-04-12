/** @jsx React.DOM */

Cosmos.components.MovieThumbnail = React.createClass({
  /**
   * Expected input:
   * {
   *   component: "MovieThumbnail",
   *   title: "The Dark Knight",
   *   year: 2008,
   *   posterPath: "http://image.tmdb.org/t/p/w342/1hRoyzDtpgMU7Dz4JF22RANzQO7.jpg,
   *   movieProps: {
   *     component: "Movie",
   *     id: 155
   *   }
   * }
   */
  mixins: [Cosmos.mixins.PersistState,
           Cosmos.mixins.Url],
  render: function() {
    return (
      <a className="thumbnail"
         href={this.getUrlFromProps(this.props.movieProps)}
         onClick={this.routeLink}>
        <img src={this.props.posterPath}
             alt="" />
        {this.props.title + ' (' + this.props.year + ')'}
      </a>
    );
  }
});
