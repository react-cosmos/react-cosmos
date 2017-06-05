import React, { Component } from 'react';
import { string, bool, object } from 'prop-types';
import { omitBy } from 'lodash';
import { } from '../SvgIcon';
import StarryBg from '../StarryBg';
import FixtureList from '../FixtureList';
import styles from './index.less';

export default class ComponentPlayground extends Component {
  static defaultProps = {}

  // Exclude params with default values
  static getCleanUrlParams = params =>
    omitBy(params, (val, key) => ComponentPlayground.defaultProps[key] === val)

  state = {
    waitingForLoader: true
  };

  componentDidMount() {
    window.addEventListener('message', this.onMessage, false);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.onMessage);
  }

  componentWillReceiveProps({ component, fixture }) {
    if (
      component !== this.props.component ||
      fixture !== this.props.fixture
    ) {
      this.loaderFrame.contentWindow.postMessage({
        type: 'fixtureSelect',
        component,
        fixture,
      }, '*');
    }
  }

  onMessage = ({ data }) => {
    const { type } = data;

    if (type === 'loaderReady') {
      this.onLoaderReady(data);
    }
  }

  onLoaderReady({ fixtures }) {
    const { loaderFrame } = this;

    this.setState({
      waitingForLoader: false,
      fixtures
    });

    const { component, fixture } = this.props;
    if (component && fixture) {
      loaderFrame.contentWindow.postMessage({
        type: 'fixtureSelect',
        component,
        fixture,
      }, '*');
    }
  }

  onUrlChange = location => {
    this.props.router.goTo(location);
  }

  render() {
    return (
      <div className={styles.root}>
        {this.renderContent()}
      </div>
    );
  }

  renderContent() {
    const { component, fixture, editor, fullScreen } = this.props;
    const { waitingForLoader } = this.state;

    if (waitingForLoader) {
      return <div>
        {this.renderLoaderFrame()}
        <StarryBg />
      </div>;
    }

    const { fixtures } = this.state;
    const urlParams = ComponentPlayground.getCleanUrlParams({
      component,
      fixture,
      editor,
      fullScreen
    });

    return (
      <div>
        <FixtureList
          fixtures={fixtures}
          urlParams={urlParams}
          onUrlChange={this.onUrlChange}
        />
        {this.renderLoaderFrame()}
        <StarryBg />
      </div>
    );
  }

  renderLoaderFrame() {
    const { loaderUri } = this.props;

    return (
      <iframe
        key="loaderFrame"
        ref={node => {
          this.loaderFrame = node;
        }}
        src={loaderUri}
        />
    );
  }
}

ComponentPlayground.propTypes = {
  router: object.isRequired,
  loaderUri: string.isRequired,
  component: string,
  fixture: string,
  editor: bool,
  fullScreen: bool,
};
