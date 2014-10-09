Cosmos.mixins.DataFetch = {
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
   * Context methods:
   *  - getDataUrl: The data URL can be generated dynamically by composing it
   *                using other props, inside a custom method that receives
   *                the next props as arguments and returns the data URL. The
   *                expected method name is "getDataUrl" and overrides the
   *                dataUrl prop when implemented.
   */
  fetchDataFromServer: function(url, onSuccess) {
    this.setState({
      fetchingData: true
    });

    var request = $.ajax({
      url: url,
      // Even though not recommended, some $.ajaxSettings might default to POST
      // requests. See http://api.jquery.com/jquery.ajaxsetup/
      type: 'GET',
      dataType: 'json',
      complete: function() {
        this.xhrRequests = _.without(this.xhrRequests, request);
      }.bind(this),
      success: onSuccess,
      error: function(xhr, status, err) {
        this.setState({
          fetchingData: false
        });
        console.error(url, status, err.toString());
      }.bind(this)
    });
    this.xhrRequests.push(request);
  },
  receiveDataFromServer: function(data) {
    this.setState({
      fetchingData: false,
      data: data
    });
  },
  _resetData: function(props) {
    /**
     * Hit the dataUrl and fetch data.
     *
     * Before starting to fetch data we reset any ongoing requests. We also
     * reset the polling interval.
     *
     * @param {Object} props
     * @param {String} props.dataUrl The URL that will be hit for data. The URL
     *     can be generated dynamically by composing it through other props,
     *     inside a custom method that receives the next props as arguments and
     *     returns the data URL. The expected method name is "getDataUrl" and
     *     overrides the dataUrl prop when implemented
     */

    var dataUrl = typeof(this.getDataUrl) == 'function' ?
                  this.getDataUrl(props) : props.dataUrl;

    // Clear any on-going polling when data is reset. Even if polling is still
    // enabled, we need to reset the interval to start from now
    this.clearDataRequests();
    if (dataUrl) {
      this.fetchDataFromServer(dataUrl, this.receiveDataFromServer);
      if (props.pollInterval) {
        this.pollInterval = setInterval(function() {
          this.fetchDataFromServer(dataUrl, this.receiveDataFromServer);
        }.bind(this), props.pollInterval);
      }
    }
  },
  refreshData: function() {
    /**
     * Hit the same data URL again.
     */

    this._resetData(this.props);
  },
  clearDataRequests: function() {
    // Cancel any on-going request and future polling
    while (!_.isEmpty(this.xhrRequests)) {
      this.xhrRequests.pop().abort();
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
    this.xhrRequests = [];
    // The dataUrl prop points to a source of data than will extend the initial
    // state of the component, once it will be fetched
    this._resetData(this.props);
  },
  componentWillReceiveProps: function(nextProps) {
    /**
     * A Component can have its configuration replaced at any time so we need to
     * fetch data again.
     *
     * Only fetch data if the dataUrl has changed.
     */

    if (this.props.dataUrl !== nextProps.dataUrl) {
      this._resetData(nextProps);
    }
  },
  componentWillUnmount: function() {
    this.clearDataRequests();
  }
};
