var DataManagerMixin = {
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
      // Set pollInterval to 0 to disable polling
      pollInterval: 2000
    };
  },
  getInitialState: function() {
    return {data: []};
  },
  componentWillMount: function() {
    this.loadCommentsFromServer();
    if (this.props.pollInterval) {
      this.setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    }
  }
};
