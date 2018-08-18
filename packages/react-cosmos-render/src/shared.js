// @flow

type FixtureDataProp = {
  serializable: boolean,
  key: string,
  value: mixed
};

type FixtureDataProps = Array<FixtureDataProp>;

export function extractPropsFromObject(object: {}): FixtureDataProps {
  return Object.keys(object).map(key => ({
    // TODO: Detect unserializable props and stringify values
    serializable: true,
    key,
    value: object[key]
  }));
}
