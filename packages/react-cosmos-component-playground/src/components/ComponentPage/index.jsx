import React, { Component } from 'react';
import { objectOf, arrayOf, string } from 'prop-types';
import LoaderGrid from '../LoaderGrid';

export default class ComponentPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gridData: this.getGridData(props)
    };
  }

  getGridData(props) {
    const {fixtures, component} = props;
    if (!fixtures[component]) {
      return [];
    }

    return fixtures[component].map(fixture => {
      return {
        fixture,
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
  fixtures: objectOf(arrayOf(string))
};
