Fresh.mixins.DataManagerMixin = {
  loadCommentsFromServer: function() {
    var url = this.props.data;
    $.ajax({
      url: url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
    });
  },
  getDefaultProps: function() {
    return {
      // Enable polling by setting a value bigger than zero, in ms
      pollInterval: 0
    };
  },
  getInitialState: function() {
    return {data: []};
  },
  componentWillMount: function() {
    // Allow passing a serialized snapshot of a state through the props
    if (this.props.state) {
      this.replaceState(this.props.state);
    }
    // The data prop points to a source of data than will extend the initial
    // state of the widget, once it will be fetched
    if (!this.props.data) {
      return;
    }
    this.loadCommentsFromServer();
    if (this.props.pollInterval) {
      this.setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    }
  }
};
