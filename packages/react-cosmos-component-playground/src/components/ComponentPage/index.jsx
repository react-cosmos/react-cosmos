import React, { Component } from 'react';
import { objectOf, arrayOf, string } from 'prop-types';
import LoaderGrid from '../LoaderGrid';

const stringify = value => JSON.stringify(value, null, 2);

export default class ComponentPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gridData: this.getGridData(props)
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      stringify(nextProps.fixtures) !== stringify(this.props.fixtures) ||
      stringify(nextProps.component) !== stringify(this.props.component)
    ) {
      this.setState({
        gridData: this.getGridData(nextProps)
      });
    }
  }

  getGridData(props) {
    const {fixtures, component} = props;
    if (!fixtures[component]) {
      return [];
    }

    return fixtures[component].map(fixture => {
      return {
        fixture
      };
    });
  }

  render() {
    return (
      <div>
        ComponentPage
        {JSON.stringify(this.state.gridData)}
        <LoaderGrid fixtures={this.state.gridData}/>
      </div>
    );
  }
}

ComponentPage.propTypes = {
  fixtures: objectOf(arrayOf(string)),
  component: string
};
