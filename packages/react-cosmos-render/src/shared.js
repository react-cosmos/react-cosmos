// @flow

type FixtureDataProps = Array<{ key: string, value: mixed }>;

// TODO: Mark serializable/unserializable props
export function extractPropsFromObject(object: {}): FixtureDataProps {
  return Object.keys(object).reduce(
    (data, key) => [...data, { key, value: object[key] }],
    []
  );
}
