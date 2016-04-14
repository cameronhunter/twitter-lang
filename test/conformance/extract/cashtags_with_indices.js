import test from 'ava';
import { parse } from '../../..';

const transform = output => output.entities.symbols.reduce((state, { text, ...rest }) => [...state, { cashtag: text, ...rest }], []);

test("Extract cashtags", t => {
  const actual = parse("Example: $TEST $symbol test");
  const expected = [{"cashtag":"TEST","indices":[9,14]},{"cashtag":"symbol","indices":[15,22]}];

  t.deepEqual(transform(actual), expected);
});

test("Extract cashtags with . or _", t => {
  const actual = parse("Example: $TEST.T test $symbol_ab end");
  const expected = [{"cashtag":"TEST.T","indices":[9,16]},{"cashtag":"symbol_ab","indices":[22,32]}];

  t.deepEqual(transform(actual), expected);
});
