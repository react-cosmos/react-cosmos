import path from 'path';

/**
 * Resolve path from user config if it isn't already absolute.
 * This allows use of any of the following forms to express user paths:
 * - componentsPaths: ['src/components']
 * - componentsPaths: [path.join(__dirname, 'src/components')]
 */
export default function resolveUserPath(userPath, cosmosConfigPath) {
  // The root path is usually the directory of the config file, but it can also be
  // the cwd when searching for the cosmos config path initially.
  const projectRootPath = (
    cosmosConfigPath ?
    // Our best bet is to resolve relative user paths to the parent dir of their
    // cosmos config, *assuming* that's their root path. Users also have the
    // option to use absolute config paths if this doesn't work well in some cases.
    path.dirname(cosmosConfigPath) :
    process.cwd()
  );

  if (path.isAbsolute(userPath)) {
    return userPath;
  }

  return path.join(projectRootPath, userPath);
}
