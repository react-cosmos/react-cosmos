// @flow

import React from 'react';
import { create } from 'react-test-renderer';
import { CaptureProps } from '../../CaptureProps';
import { FixtureContainer } from '../../FixtureContainer';

it('renders props', () => {
  expect(
    create(
      <FixtureContainer>
        <HelloMessage name="Satoshi" />
      </FixtureContainer>
    ).toJSON()
  ).toBe('Hello, Satoshi!');
});

it('renders multiple (implicit) props captures', () => {
  expect(
    create(
      <FixtureContainer>
        <HelloMessage name="Satoshi" />
        <HelloMessage name="Vitalik" />
      </FixtureContainer>
    ).toJSON()
  ).toEqual(['Hello, Satoshi!', 'Hello, Vitalik!']);
});

it('renders multiple (explicit) props captures', () => {
  expect(
    create(
      <FixtureContainer>
        <CaptureProps>
          <HelloMessage name="Satoshi" />
        </CaptureProps>
        <CaptureProps>
          <HelloMessage name="Vitalik" />
        </CaptureProps>
      </FixtureContainer>
    ).toJSON()
  ).toEqual(['Hello, Satoshi!', 'Hello, Vitalik!']);
});

it('renders replaced component type', () => {
  const renderer = create(
    <FixtureContainer>
      <HelloMessage name="Satoshi" />
    </FixtureContainer>
  );

  renderer.update(
    <FixtureContainer>
      <YoMessage name="Satoshi" />
    </FixtureContainer>
  );

  expect(renderer.toJSON()).toBe('Yo, Satoshi!');
});

// End of tests

function HelloMessage({ name }: { name: string }) {
  return `Hello, ${name}!`;
}

function YoMessage({ name }: { name: string }) {
  return `Yo, ${name}!`;
}
