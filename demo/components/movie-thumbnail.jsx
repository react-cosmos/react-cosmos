/** @jsx React.DOM */

Cosmos.components.MovieThumbnail = React.createClass({
  mixins: [Cosmos.mixins.ClassName,
           Cosmos.mixins.PersistState,
           Cosmos.mixins.Url],
  defaultClass: 'movie-thumbnail',
  render: function() {
    return (
      <a className={this.getClassName()}
         href={this.getUrlFromProps(this.getPropsForMovie())}
         onClick={this.routeLink}
         style={{
           backgroundImage: 'url(' + this.getUrlForPosterImage() + ')'
         }}>
      </a>
    );
  },
  getPropsForMovie: function() {
    return {
      component: 'Movie',
      posterPath: this.props.poster_path,
      dataUrl: App.MOVIEDB_API_ROOT + '/movie/' + this.props.id +
               '?append_to_response=credits,similar_movies' +
               '&api_key=' + App.MOVIEDB_API_KEY
    };
  },
  getUrlForPosterImage: function() {
    return App.MOVIEDB_IMG_ROOT + '/w154' + this.props.poster_path;
  }
});
