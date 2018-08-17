// @flow

// TODO: Map fixture data to component? (Eg. when wrapping more than one
// component in CaptureProps)
export type FixtureData = { [key: string]: mixed };

export type UpdateFixtureData = (key: string, value: mixed) => mixed;
