// @flow

import React, { Component, Fragment } from 'react';
import { create } from 'react-test-renderer';
import { CaptureProps } from '../../CaptureProps';
import { FixtureProvider } from '../../FixtureProvider';
import { updateFixtureState, getProps, setProps, resetProps } from './_shared';

it('renders with props', () => {
  expect(
    create(
      <FixtureProvider fixtureState={{}} setFixtureState={() => {}}>
        <HelloMessage name="Satoshi" />
      </FixtureProvider>
    ).toJSON()
  ).toBe('Hello, Satoshi!');
});

it('captures props', () => {
  let fixtureState = {};
  const setFixtureState = (updater, cb) => {
    fixtureState = updateFixtureState(fixtureState, updater, cb);
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
  expect(props1).toEqual({
    instanceId: expect.any(Number),
    componentName: 'HelloMessage',
    renderKey: expect.any(Number),
    values: [
      {
        serializable: true,
        key: 'name',
        value: 'Satoshi'
      }
    ]
  });
});

it('overwrites prop', () => {
  let fixtureState = {};
  const setFixtureState = (updater, cb) => {
    fixtureState = updateFixtureState(fixtureState, updater, cb);
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

  fixtureState = setProps(fixtureState, { name: 'Vitalik' });

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
  const setFixtureState = (updater, cb) => {
    fixtureState = updateFixtureState(fixtureState, updater, cb);
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

  fixtureState = setProps(fixtureState, {});

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
  const setFixtureState = (updater, cb) => {
    fixtureState = updateFixtureState(fixtureState, updater, cb);
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

  fixtureState = setProps(fixtureState, { name: 'Vitalik' });

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
  const setFixtureState = (updater, cb) => {
    fixtureState = updateFixtureState(fixtureState, updater, cb);
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

  fixtureState = setProps(fixtureState, { name: 'Vitalik' });

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
  const setFixtureState = (updater, cb) => {
    fixtureState = updateFixtureState(fixtureState, updater, cb);
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

  fixtureState = resetProps(fixtureState, { name: 'Vitalik' });

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
  const setFixtureState = (updater, cb) => {
    fixtureState = updateFixtureState(fixtureState, updater, cb);
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
  expect(props1).toEqual({
    instanceId: expect.any(Number),
    componentName: 'HelloMessage',
    renderKey: expect.any(Number),
    values: [
      {
        serializable: true,
        key: 'name',
        value: 'Satoshi'
      }
    ]
  });
  expect(props2).toEqual({
    instanceId: expect.any(Number),
    componentName: 'HelloMessage',
    renderKey: expect.any(Number),
    values: [
      {
        serializable: true,
        key: 'name',
        value: 'Vitalik'
      }
    ]
  });
});

it('captures props from multiple instances (direct children)', () => {
  let fixtureState = {};
  const setFixtureState = (updater, cb) => {
    fixtureState = updateFixtureState(fixtureState, updater, cb);
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
  expect(props1).toEqual({
    instanceId: expect.any(Number),
    componentName: 'HelloMessage',
    renderKey: expect.any(Number),
    values: [
      {
        serializable: true,
        key: 'name',
        value: 'Satoshi'
      }
    ]
  });
  expect(props2).toEqual({
    instanceId: expect.any(Number),
    componentName: 'HelloMessage',
    renderKey: expect.any(Number),
    values: [
      {
        serializable: true,
        key: 'name',
        value: 'Vitalik'
      }
    ]
  });
});

it('overwrites props in multiple instances', () => {
  let fixtureState = {};
  const setFixtureState = (updater, cb) => {
    fixtureState = updateFixtureState(fixtureState, updater, cb);
  };

  const fixture = (
    <Fragment>
      <HelloMessage name="Satoshi" />
      <HelloMessage name="Vitalik" />
    </Fragment>
  );

  const instance = create(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      {fixture}
    </FixtureProvider>
  );

  fixtureState = setProps(
    fixtureState,
    { name: 'SATOSHI' },
    { name: 'VITALIK' }
  );

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
