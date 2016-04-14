import test from 'ava';
import { parse } from '../../..';

const transform = output => output.entities.symbols.map(symbol => symbol.text);

test("Extract cashtags", t => {
  const actual = parse("Example cashtags: $TEST $Stock   $symbol");
  const expected = ["TEST","Stock","symbol"];

  t.deepEqual(transform(actual), expected);
});

test("Extract cashtags with . or _", t => {
  const actual = parse("Example cashtags: $TEST.T $test.tt $Stock_X $symbol_ab");
  const expected = ["TEST.T","test.tt","Stock_X","symbol_ab"];

  t.deepEqual(transform(actual), expected);
});

test("Do not extract cashtags if they contain numbers", t => {
  const actual = parse("$123 $test123 $TE123ST");
  const expected = [];

  t.deepEqual(transform(actual), expected);
});

test("Do not extract cashtags with non-ASCII characters", t => {
  const actual = parse("$ストック $株");
  const expected = [];

  t.deepEqual(transform(actual), expected);
});

test("Do not extract cashtags with punctuations", t => {
  const actual = parse("$ $. $- $@ $! $() $+");
  const expected = [];

  t.deepEqual(transform(actual), expected);
});

test("Do not include trailing . or _", t => {
  const actual = parse("$TEST. $TEST_");
  const expected = ["TEST","TEST"];

  t.deepEqual(transform(actual), expected);
});

test("Do not extract cashtags if there is no space before $", t => {
  const actual = parse("$OK$NG$BAD text$NO .$NG $$NG");
  const expected = ["OK"];

  t.deepEqual(transform(actual), expected);
});

test("Do not extract too long cashtags", t => {
  const actual = parse("$CashtagMustBeLessThanSixCharacter");
  const expected = [];

  t.deepEqual(transform(actual), expected);
});
