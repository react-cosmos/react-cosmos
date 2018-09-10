// Babel picks up configs relative to cwd (current working directory). We need
// this re-export to reuse the global Babel config from the monorepo.
// NOTE: This file is generated automatically to avoid manual labor and
// out-of-sync duplication. See scripts/generateExamplesBabelConfig.js
module.exports = require('../../babel.config');
