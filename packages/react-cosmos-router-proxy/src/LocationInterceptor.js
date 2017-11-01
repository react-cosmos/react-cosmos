import { Component } from 'react';
import { withRouter } from 'react-router';
import { object } from 'prop-types';

const getUrlFromLocation = ({ pathname, search, hash }) =>
  `${pathname}${search}${hash}`;

class LocationInterceptor extends Component {
  static contextTypes = {
    router: object
  };

  componentDidUpdate(prevProps) {
    const { location, onUrlChange, onLocationStateChange } = this.props;
    const newUrl = getUrlFromLocation(location);
    if (newUrl !== getUrlFromLocation(prevProps.location)) {
      onUrlChange(newUrl);
    }
    if (
      JSON.stringify(location.state) !==
      JSON.stringify(prevProps.location.state)
    ) {
      onLocationStateChange(location.state);
    }
  }

  render() {
    return this.props.children;
  }
}

export default withRouter(LocationInterceptor);
