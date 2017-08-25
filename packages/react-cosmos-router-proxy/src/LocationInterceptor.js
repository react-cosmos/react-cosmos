import { Component } from 'react';
import { withRouter } from 'react-router';
import { object } from 'prop-types';

const getPathFromProps = props => props.location.pathname;

class LocationInterceptor extends Component {
  static contextTypes = {
    router: object
  };

  componentDidUpdate(prevProps) {
    const newPath = getPathFromProps(this.props);
    if (newPath !== getPathFromProps(prevProps)) {
      this.props.onLocation(newPath);
    }
  }

  render() {
    return this.props.children;
  }
}

export default withRouter(LocationInterceptor);
