// Reuse the Babel toolchain supplied by react-scripts; no second build framework.
const fs = require('node:fs');
const path = require('node:path');
const babel = require('@babel/core');
const sourceDirectory = path.resolve(__dirname, '../src') + path.sep;
const originalLoader = require.extensions['.js'];
function loadSource(module, filename) {
  if (!filename.startsWith(sourceDirectory)) return originalLoader(module, filename);
  const result = babel.transformSync(fs.readFileSync(filename, 'utf8'), {
    filename, babelrc: false, configFile: false,
    presets: [
      [require.resolve('@babel/preset-env'), { targets: { node: 'current' }, modules: 'commonjs' }],
      [require.resolve('@babel/preset-react'), { runtime: 'automatic' }],
    ],
  });
  module._compile(result.code, filename);
}
require.extensions['.js'] = loadSource;
require.extensions['.jsx'] = loadSource;
require.extensions['.css'] = () => {};
