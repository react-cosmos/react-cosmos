// @flow

import React, { Component } from 'react';
import { create } from 'react-test-renderer';
import {
  updateFixtureState,
  getProps,
  setProps,
  resetProps
} from '../../shared/fixtureState';
import { CaptureProps } from '../../CaptureProps';
import { FixtureProvider } from '../../FixtureProvider';

it('renders with props', () => {
  expect(
    create(
      <FixtureProvider fixtureState={null} setFixtureState={() => {}}>
        <HelloMessage name="Satoshi" />
      </FixtureProvider>
    ).toJSON()
  ).toBe('Hello, Satoshi!');
});

it('captures props', () => {
  let fixtureState = {};
  const setFixtureState = updater => {
    fixtureState = updateFixtureState(fixtureState, updater);
  };

  create(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      <HelloMessage name="Satoshi" />
    </FixtureProvider>
  );

  const [props1] = getProps(fixtureState);
  expect(props1).toEqual(getPropsInstanceShape('Satoshi'));
});

it('overwrites prop', () => {
  let fixtureState = {};
  const setFixtureState = updater => {
    fixtureState = updateFixtureState(fixtureState, updater);
  };

  const fixture = <HelloMessage name="Satoshi" />;

  const instance = create(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      {fixture}
    </FixtureProvider>
  );

  const [{ instanceId }] = getProps(fixtureState);
  fixtureState = setProps(fixtureState, instanceId, { name: 'Vitalik' });

  instance.update(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      {fixture}
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('Hello, Vitalik!');
});

it('removes prop', () => {
  let fixtureState = {};
  const setFixtureState = updater => {
    fixtureState = updateFixtureState(fixtureState, updater);
  };

  const fixture = <HelloMessage name="Satoshi" />;

  const instance = create(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      {fixture}
    </FixtureProvider>
  );

  const [{ instanceId }] = getProps(fixtureState);
  fixtureState = setProps(fixtureState, instanceId, {});

  instance.update(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      {fixture}
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('Hello, Guest!');
});

// XXX: This is dead end use case. Props for this instance will stay empty from
// this point on, because CaptureProps only adds props to fixture state on
// mount.
// TODO: Inside CapturePropsInner.componentDidUpdate reset props in fixture
// state if they are missing.
it('reverts to original props', () => {
  let fixtureState = {};
  const setFixtureState = updater => {
    fixtureState = updateFixtureState(fixtureState, updater);
  };

  const fixture = <HelloMessage name="Satoshi" />;

  const instance = create(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      {fixture}
    </FixtureProvider>
  );

  const [{ instanceId }] = getProps(fixtureState);
  fixtureState = setProps(fixtureState, instanceId, { name: 'Vitalik' });

  instance.update(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      {fixture}
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('Hello, Vitalik!');

  setFixtureState({ props: [] });

  instance.update(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      {fixture}
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('Hello, Satoshi!');
});

it('reuses instance on props transition', () => {
  let fixtureState = {};
  const setFixtureState = updater => {
    fixtureState = updateFixtureState(fixtureState, updater);
  };

  let ref1;
  const instance = create(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      <HelloMessage
        name="Satoshi"
        ref={ref => {
          if (ref) {
            ref1 = ref;
          }
        }}
      />
    </FixtureProvider>
  );

  const [{ instanceId }] = getProps(fixtureState);
  fixtureState = setProps(fixtureState, instanceId, { name: 'Vitalik' });

  let ref2;
  instance.update(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      <HelloMessage
        name="Satoshi"
        ref={ref => {
          if (ref) {
            ref2 = ref;
          }
        }}
      />
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('Hello, Vitalik!');

  expect(ref1).not.toBeFalsy();
  expect(ref1).toBe(ref2);
});

it('creates new instance on props reset', () => {
  let fixtureState = {};
  const setFixtureState = updater => {
    fixtureState = updateFixtureState(fixtureState, updater);
  };

  let ref1;
  const instance = create(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      <HelloMessage
        name="Satoshi"
        ref={ref => {
          if (ref) {
            ref1 = ref;
          }
        }}
      />
    </FixtureProvider>
  );

  const [{ instanceId }] = getProps(fixtureState);
  fixtureState = resetProps(fixtureState, instanceId, { name: 'Vitalik' });

  let ref2;
  instance.update(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      <HelloMessage
        name="Satoshi"
        ref={ref => {
          if (ref) {
            ref2 = ref;
          }
        }}
      />
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('Hello, Vitalik!');

  expect(ref1).not.toBeFalsy();
  expect(ref1).not.toBe(ref2);
});

it('captures props from multiple instances (explicit capture)', () => {
  let fixtureState = {};
  const setFixtureState = updater => {
    fixtureState = updateFixtureState(fixtureState, updater);
  };

  create(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      <CaptureProps>
        <HelloMessage name="Satoshi" />
      </CaptureProps>
      <CaptureProps>
        <HelloMessage name="Vitalik" />
      </CaptureProps>
    </FixtureProvider>
  );

  const [props1, props2] = getProps(fixtureState);
  expect(props1).toEqual(getPropsInstanceShape('Satoshi'));
  expect(props2).toEqual(getPropsInstanceShape('Vitalik'));
});

it('captures props from multiple instances (direct children)', () => {
  let fixtureState = {};
  const setFixtureState = updater => {
    fixtureState = updateFixtureState(fixtureState, updater);
  };

  create(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      <HelloMessage name="Satoshi" />
      <HelloMessage name="Vitalik" />
    </FixtureProvider>
  );

  const [props1, props2] = getProps(fixtureState);
  expect(props1).toEqual(getPropsInstanceShape('Satoshi'));
  expect(props2).toEqual(getPropsInstanceShape('Vitalik'));
});

it('overwrites props in multiple instances', () => {
  let fixtureState = {};
  const setFixtureState = updater => {
    fixtureState = updateFixtureState(fixtureState, updater);
  };

  const fixture = (
    <>
      <HelloMessage name="Satoshi" />
      <HelloMessage name="Vitalik" />
    </>
  );

  const instance = create(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      {fixture}
    </FixtureProvider>
  );

  const [props1, props2] = getProps(fixtureState);
  fixtureState = setProps(fixtureState, props1.instanceId, { name: 'SATOSHI' });
  fixtureState = setProps(fixtureState, props2.instanceId, { name: 'VITALIK' });

  instance.update(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      {fixture}
    </FixtureProvider>
  );

  expect(instance.toJSON()).toEqual(['Hello, SATOSHI!', 'Hello, VITALIK!']);
});

// End of tests

class HelloMessage extends Component<{ name: string }> {
  render() {
    return `Hello, ${this.props.name || 'Guest'}!`;
  }
}

function getPropsInstanceShape(name) {
  return {
    instanceId: expect.any(Number),
    componentName: 'HelloMessage',
    renderKey: expect.any(Number),
    values: [
      {
        serializable: true,
        key: 'name',
        value: name
      }
    ]
  };
}
