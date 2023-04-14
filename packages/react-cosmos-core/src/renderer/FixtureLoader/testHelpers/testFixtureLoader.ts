import {
  mountTestRenderer,
  RendererTestArgs,
  RendererTestCallback,
} from './mountTestRenderer.js';

export function testFixtureLoader(
  testName: string,
  args: RendererTestArgs,
  cb: RendererTestCallback
) {
  const test = () => mountTestRenderer(args, cb);

  if (args.only) {
    it.only(`[FixtureLoader] ${testName}`, test);
  } else {
    it(`[FixtureLoader] ${testName}`, test);
  }
}
