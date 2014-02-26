Fresh.mixins.DataManager = {
  fetchDataFromServer: function() {
    var url = this.props.data;
    $.ajax({
      url: url,
      dataType: 'json',
      success: function(data) {
        this.receiveDataFromServer(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
    });
  },
  receiveDataFromServer: function(data) {
    this.setState({data: data});
  },
  getDefaultProps: function() {
    return {
      // Enable polling by setting a value bigger than zero, in ms
      pollInterval: 0
    };
  },
  componentWillMount: function() {
    // The data prop points to a source of data than will extend the initial
    // state of the component, once it will be fetched
    // TODO: Fetch data again when props change at componentWillReceiveProps
    if (!this.props.data) {
      return;
    }
    this.fetchDataFromServer();
    if (this.props.pollInterval) {
      this.pollInterval =
        setInterval(this.fetchDataFromServer, this.props.pollInterval);
    }
  },
  componentWillUnmount: function() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
  }
};
