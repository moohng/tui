import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

module.exports = {
  input: path.resolve('packages/index.ts'),
  plugins: [
    resolve({ extensions }),
    babel({
      extensions,
      include: ['packages/**/*'],
    }),
  ],
  output: [
    {
      file: 'dist/tui.common.js',
      format: 'cjs',
    },
    {
      file: 'dist/tui.common.min.js',
      format: 'cjs',
      plugins: [
        terser(),
      ],
    },
    {
      file: 'dist/tui.es.js',
      format: 'es',
    },
    {
      file: 'dist/tui.es.min.js',
      format: 'es',
      plugins: [
        terser(),
      ],
    },
    {
      file: 'dist/tui.js',
      format: 'iife',
      name: 'tui',
      // https://rollupjs.org/guide/en#output-globals-g-globals
      globals: {},
    },
    {
      file: 'dist/tui.min.js',
      format: 'iife',
      name: 'tui',
      // https://rollupjs.org/guide/en#output-globals-g-globals
      globals: {},
      plugins: [
        terser(),
      ],
    },
    {
      file: 'dist/tui.umd.js',
      format: 'umd',
      name: 'tui',
      // https://rollupjs.org/guide/en#output-globals-g-globals
      globals: {},
    },
    {
      file: 'dist/tui.umd.min.js',
      format: 'umd',
      name: 'tui',
      // https://rollupjs.org/guide/en#output-globals-g-globals
      globals: {},
      plugins: [
        terser(),
      ],
    },
  ],
};
