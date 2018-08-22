// @flow

import React, { Component, Fragment } from 'react';
import { create } from 'react-test-renderer';
import { CaptureProps } from '../CaptureProps';
import { FixtureProvider } from '../FixtureProvider';

class HelloMessage extends Component<{ name: string }> {
  render() {
    return `Hello, ${this.props.name || 'Guest'}!`;
  }
}

it('renders with props', () => {
  expect(
    create(
      <FixtureProvider>
        <HelloMessage name="Satoshi" />
      </FixtureProvider>
    ).toJSON()
  ).toBe('Hello, Satoshi!');
});

it('captures props', () => {
  const instance = create(
    <FixtureProvider>
      <HelloMessage name="Satoshi" />
    </FixtureProvider>
  );

  const [props] = instance.getInstance().state.fixtureState.props;
  expect(props).toEqual({
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
  const fixture = <HelloMessage name="Satoshi" />;
  const instance = create(<FixtureProvider>{fixture}</FixtureProvider>);
  const [{ instanceId }] = instance.getInstance().state.fixtureState.props;

  instance.update(
    <FixtureProvider
      fixtureState={{
        props: [getPropsWithName({ name: 'Vitalik', instanceId })]
      }}
    >
      {fixture}
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('Hello, Vitalik!');
});

it('removes prop', () => {
  const fixture = <HelloMessage name="Satoshi" />;
  const instance = create(<FixtureProvider>{fixture}</FixtureProvider>);
  const [{ instanceId }] = instance.getInstance().state.fixtureState.props;

  instance.update(
    <FixtureProvider
      fixtureState={{
        props: [getEmptyProps({ instanceId })]
      }}
    >
      {fixture}
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('Hello, Guest!');
});

it('reverts to original props', () => {
  const fixture = <HelloMessage name="Satoshi" />;
  const instance = create(<FixtureProvider>{fixture}</FixtureProvider>);

  const [
    { instanceId, renderKey }
  ] = instance.getInstance().state.fixtureState.props;

  instance.update(
    <FixtureProvider
      fixtureState={{
        props: [
          getPropsWithName({
            name: 'Vitalik',
            instanceId,
            // We also bump the render key for the instance to be recreated and
            // the element props reset in the fixtureState.
            // NOTE: Clearing fixtureState.props[i] without bumping renderKey
            // is a broken use case. CaptureProps will never update props in
            // fixture state from that point on. CaptureProps only adds props
            // to fixture state on mount, which means that props should only be
            // reset together with changing renderKey.
            renderKey: renderKey + 1
          })
        ]
      }}
    >
      {fixture}
    </FixtureProvider>
  );
  instance.update(
    <FixtureProvider fixtureState={{ props: [] }}>{fixture}</FixtureProvider>
  );

  expect(instance.toJSON()).toBe('Hello, Satoshi!');
});

it('reuses instance on props with same renderKey', () => {
  let ref1, ref2;

  const instance = create(
    <FixtureProvider>
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

  const { fixtureState } = instance.getInstance().state;
  const [{ instanceId, renderKey }] = fixtureState.props;

  instance.update(
    <FixtureProvider
      fixtureState={{
        props: [getPropsWithName({ name: 'Vitalik', instanceId, renderKey })]
      }}
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

  expect(ref1).not.toBeFalsy();
  expect(ref1).toBe(ref2);
});

it('creates new instance on props with different renderKey', () => {
  let ref1, ref2;

  const instance = create(
    <FixtureProvider>
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

  const { fixtureState } = instance.getInstance().state;
  const [{ instanceId, renderKey }] = fixtureState.props;

  instance.update(
    <FixtureProvider
      fixtureState={{
        props: [
          getPropsWithName({
            name: 'Vitalik',
            instanceId,
            renderKey: renderKey + 1
          })
        ]
      }}
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

  expect(ref1).not.toBeFalsy();
  expect(ref1).not.toBe(ref2);
});

it('captures props from multiple instances (explicit capture)', () => {
  const instance = create(
    <FixtureProvider>
      <CaptureProps>
        <HelloMessage name="Satoshi" />
      </CaptureProps>
      <CaptureProps>
        <HelloMessage name="Vitalik" />
      </CaptureProps>
    </FixtureProvider>
  );

  const [props1, props2] = instance.getInstance().state.fixtureState.props;
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
  const instance = create(
    <FixtureProvider>
      <HelloMessage name="Satoshi" />
      <HelloMessage name="Vitalik" />
    </FixtureProvider>
  );

  const [props1, props2] = instance.getInstance().state.fixtureState.props;
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
  const fixture = (
    <Fragment>
      <HelloMessage name="Satoshi" />
      <HelloMessage name="Vitalik" />
    </Fragment>
  );
  const instance = create(<FixtureProvider>{fixture}</FixtureProvider>);

  const [
    { instanceId: instanceId1 },
    { instanceId: instanceId2 }
  ] = instance.getInstance().state.fixtureState.props;

  instance.update(
    <FixtureProvider
      fixtureState={{
        props: [
          getPropsWithName({ name: 'SATOSHI', instanceId: instanceId1 }),
          getPropsWithName({ name: 'VITALIK', instanceId: instanceId2 })
        ]
      }}
    >
      {fixture}
    </FixtureProvider>
  );

  expect(instance.toJSON()).toEqual(['Hello, SATOSHI!', 'Hello, VITALIK!']);
});

function getPropsWithName({
  instanceId,
  name,
  renderKey = 0
}: {
  instanceId: number,
  name: string,
  renderKey?: number
}) {
  return {
    instanceId,
    componentName: 'HelloWorld',
    renderKey,
    values: [
      {
        serializable: true,
        key: 'name',
        value: name
      }
    ]
  };
}

function getEmptyProps({ instanceId }) {
  return {
    instanceId,
    componentName: 'HelloWorld',
    renderKey: 0,
    values: []
  };
}
