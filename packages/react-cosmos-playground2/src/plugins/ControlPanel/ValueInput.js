// @flow

// import styled from 'styled-components';
import React, { Component } from 'react';

type Props = {
  label: string,
  value: mixed,
  disabled: boolean,
  onChange: (value: mixed) => mixed
};

export class ValueInput extends Component<Props> {
  render() {
    const { label, value, disabled } = this.props;

    return (
      <div>
        {label}{' '}
        {disabled ? (
          <input type="text" value={value} disabled />
        ) : (
          <input type="text" value={value} onChange={this.handleChange} />
        )}
      </div>
    );
  }

  handleChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    const { onChange } = this.props;

    onChange(isNaN(value) ? value : Number(value));
  };
}
