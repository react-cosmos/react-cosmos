Fresh.mixins.DataFetch = {
  /**
   * Bare functionality for fetching server-side JSON data inside a Component.
   *
   * Props:
   *   - dataUrl: A URL to fetch data from. Once data is received it will be
   *              set inside the Component's state, under the data key, and
   *              will cause a reactive re-render.
   *   - pollInterval: An interval in milliseconds for polling the data URL.
   *                   Defaults to 0, which means no polling.
   *
   * Context properties:
   *  - initialData: The initial value of state.data, before receiving and data
   *                 from the server (see dataUrl prop.) Defaults to an empty
   *                 object `{}`
   */
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
    if (props.dataUrl) {
      this.fetchDataFromServer(props.dataUrl);
      if (props.pollInterval) {
        this.pollInterval = setInterval(function() {
          this.fetchDataFromServer(props.dataUrl);
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
    // The dataUrl prop points to a source of data than will extend the initial
    // state of the component, once it will be fetched
    this.resetData(this.props);
  },
  componentWillReceiveProps: function(nextProps) {
    // A DataFetch Component can have its configuration replaced at any time
    if (nextProps.dataUrl != this.props.dataUrl) {
      this.resetData(nextProps);
    }
  },
  componentWillUnmount: function() {
    this.clearDataRequests();
  }
};
