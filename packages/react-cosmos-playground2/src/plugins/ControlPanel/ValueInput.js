// @flow

import styled from 'styled-components';
import React, { Component } from 'react';

type Props = {
  id: string,
  label: string,
  value: mixed,
  disabled: boolean,
  onChange: (value: mixed) => mixed
};

export class ValueInput extends Component<Props> {
  render() {
    const { id, label, value, disabled } = this.props;

    return (
      <div>
        <Label htmlFor={id}>{label}</Label>
        {disabled ? (
          <input id={id} type="text" value={value} disabled />
        ) : (
          <input
            id={id}
            type="text"
            value={value}
            onChange={this.handleChange}
          />
        )}
      </div>
    );
  }

  handleChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    const { onChange } = this.props;

    onChange(value === '' || isNaN(value) ? value : Number(value));
    // TODO: onChange(value);
  };
}

const Label = styled.label`
  display: block;
  font-size: 14px;
`;
