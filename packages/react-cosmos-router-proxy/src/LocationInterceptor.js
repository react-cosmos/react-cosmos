import { Component } from 'react';
import { withRouter } from 'react-router';
import { object } from 'prop-types';

class LocationInterceptor extends Component {
  static contextTypes = {
    router: object
  };

  componentDidMount() {
    const { location, onLocationChange } = this.props;
    onLocationChange(location);
  }

  componentDidUpdate(prevProps) {
    const { location, onLocationChange } = this.props;
    if (JSON.stringify(location) !== JSON.stringify(prevProps.location)) {
      onLocationChange(location);
    }
  }

  render() {
    return this.props.children;
  }
}

export default withRouter(LocationInterceptor);
