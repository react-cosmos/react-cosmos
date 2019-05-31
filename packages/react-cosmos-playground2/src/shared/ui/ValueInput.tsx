import * as React from 'react';
import styled from 'styled-components';
import { FixtureStateValue } from 'react-cosmos-shared2/fixtureState';

type Props = {
  id: string;
  valueKey: string;
  value: FixtureStateValue;
  onChange: (value: FixtureStateValue) => unknown;
};

export function ValueInput({ id, valueKey, value, onChange }: Props) {
  if (value.type === 'unserializable') {
    return (
      <RowContainer>
        <Label htmlFor={id}>{valueKey}</Label>
        <InputContainer>
          <input id={id} type="text" disabled value={value.stringifiedValue} />
        </InputContainer>
      </RowContainer>
    );
  }

  if (value.type === 'object') {
    return (
      <div style={{ paddingLeft: 16 }}>
        {Object.keys(value.values).map(key => (
          <ValueInput
            key={key}
            id={`${id}-${key}`}
            valueKey={key}
            value={value.values[key]}
            onChange={() => {
              // TODO: Implement this
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <RowContainer>
      <Label htmlFor={id}>{valueKey}</Label>
      <InputContainer>
        <input
          type="text"
          id={id}
          value={JSON.stringify(value.value)}
          onChange={(e: React.SyntheticEvent<HTMLInputElement>) => {
            try {
              onChange({
                type: 'simple',
                value: JSON.parse(e.currentTarget.value)
              });
            } catch (err) {
              console.warn(`Not a valid JSON value: ${value}`);
              return;
            }
          }}
        />
      </InputContainer>
    </RowContainer>
  );
}

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 8px 0;
`;

const Label = styled.label`
  flex-shrink: 0;
  display: block;
  max-width: 50%;
  box-sizing: border-box;
  padding: 0 6px 0 0;
  font-size: 14px;
`;

const InputContainer = styled.div`
  flex: auto;

  input,
  textarea {
    width: 100%;
    box-sizing: border-box;
  }
`;
