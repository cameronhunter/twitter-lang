import babel from 'rollup-plugin-babel';
import pegjs from 'rollup-plugin-pegjs';

export default {
  entry: 'src/twitter-lang.pegjs',
  dest: 'build/twitter-lang.js',
  format: 'cjs',
  plugins: [
    pegjs(),
    babel({ babelrc: false, presets: ['es2015-rollup', 'stage-1'] })
  ]
}
