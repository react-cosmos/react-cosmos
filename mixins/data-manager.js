Fresh.mixins.DataManager = {
  fetchDataFromServer: function(url) {
    this.xhrRequest = $.ajax({
      url: url,
      dataType: 'json',
      complete: function() {
        this.xhrRequest = null;
      }.bind(this),
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
  getInitialData: function() {
    // The default data object is an empty Object. A List Component would
    // override initialData with an empty Array and other Components might want
    // some defaults inside the initial data
    return this.initialData !== undefined ? this.initialData : {};
  },
  resetData: function(props) {
    // Previous data must be cleared before new one arrives
    this.setState({data: this.getInitialData()});
    // Clear any on-going polling when data is reset. Even if polling is still
    // enabled, we need to reset the interval to start from now
    this.clearDataRequests();
    if (props.data) {
      this.fetchDataFromServer(props.data);
      if (props.pollInterval) {
        this.pollInterval = setInterval(function() {
          this.fetchDataFromServer(props.data);
        }.bind(this), props.pollInterval);
      }
    }
  },
  clearDataRequests: function() {
    // Cancel any on-going request and future polling
    if (this.xhrRequest) {
      this.xhrRequest.abort();
    }
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
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
    this.resetData(this.props);
  },
  componentWillReceiveProps: function(nextProps) {
    // A DataManager Component can have its configuration replaced at any time
    if (nextProps.data != this.props.data) {
      this.resetData(nextProps);
    }
  },
  componentWillUnmount: function() {
    this.clearDataRequests();
  }
};
