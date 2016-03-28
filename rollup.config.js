import babel from 'rollup-plugin-babel';
import pegjs from 'rollup-plugin-pegjs';
import uglify from 'rollup-plugin-uglify';

const isProduction = process.env.NODE_ENV === 'production';
const nonNull = (array) => array.filter(item => !!item);

export default {
  entry: 'src/twitter-lang.pegjs',
  dest: `build/twitter-lang${isProduction ? '.min' : ''}.js`,
  sourceMap: !isProduction,
  format: 'cjs',
  plugins: nonNull([
    pegjs(),
    babel({ babelrc: false, presets: ['es2015-rollup', 'stage-1'] }),
    isProduction ? uglify() : null
  ])
}
