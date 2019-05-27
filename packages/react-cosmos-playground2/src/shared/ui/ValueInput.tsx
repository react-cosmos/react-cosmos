import * as React from 'react';
import styled from 'styled-components';

type Props = {
  id: string;
  label: string;
  value: string;
  disabled: boolean;
  onChange: (value: string) => unknown;
};

type State = {
  confirmedValue: string;
  localValue: string;
};

export class ValueInput extends React.Component<Props, State> {
  static getDerivedStateFromProps(props: Props, state: State) {
    if (props.value === state.confirmedValue) {
      return null;
    }

    return {
      confirmedValue: props.value,
      localValue: props.value
    };
  }

  state = {
    confirmedValue: this.props.value,
    localValue: this.props.value
  };

  render() {
    const { id, label } = this.props;
    const { localValue } = this.state;

    const type = localValue.indexOf(`\n`) !== -1 ? 'textarea' : 'input';
    const props = this.getInputProps(type);

    return (
      <div>
        <Label htmlFor={id}>{label}</Label>
        {React.createElement(type, props)}
      </div>
    );
  }

  getInputProps = (type: 'input' | 'textarea') => {
    const { id, disabled } = this.props;
    const { localValue } = this.state;

    type InputProps = {
      id: string;
      value: string;
      disabled: boolean;
      type?: string;
      onChange?: (e: React.SyntheticEvent<HTMLInputElement>) => void;
    };
    let props: InputProps = {
      id,
      value: localValue,
      disabled
    };
    if (type === 'input') {
      props = { ...props, type: 'text' };
    }
    if (!disabled) {
      props = { ...props, onChange: this.handleChange };
    }

    return props;
  };

  handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    const { onChange } = this.props;

    this.setState({
      localValue: value
    });

    try {
      JSON.parse(value);
    } catch (err) {
      console.warn(`Not a valid JSON value: ${value}`);
      return;
    }

    onChange(value);
  };
}

const Label = styled.label`
  display: block;
  font-size: 14px;
`;
