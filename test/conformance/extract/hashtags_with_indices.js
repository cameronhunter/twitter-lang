import test from 'ava';
import { parse } from '../../..';

const transform = output => output.entities.hashtags.reduce((state, { text, ...rest }) => [...state, { hashtag: text, ...rest }], []);

test("Extract a hastag at the start", t => {
  const actual = parse("#hashtag here");
  const expected = [{"hashtag":"hashtag","indices":[0,8]}];

  t.deepEqual(transform(actual), expected);
});

test("Extract a hastag at the end", t => {
  const actual = parse("test a #hashtag");
  const expected = [{"hashtag":"hashtag","indices":[7,15]}];

  t.deepEqual(transform(actual), expected);
});

test("Extract a hastag in the middle", t => {
  const actual = parse("test a #hashtag in a string");
  const expected = [{"hashtag":"hashtag","indices":[7,15]}];

  t.deepEqual(transform(actual), expected);
});

test("Extract only a valid hashtag", t => {
  const actual = parse("#123 a #hashtag in a string");
  const expected = [{"hashtag":"hashtag","indices":[7,15]}];

  t.deepEqual(transform(actual), expected);
});

test("Extract a hashtag in a string of multi-byte characters", t => {
  const actual = parse("会議中 #hashtag 会議中");
  const expected = [{"hashtag":"hashtag","indices":[4,12]}];

  t.deepEqual(transform(actual), expected);
});

test("Extract multiple valid hashtags", t => {
  const actual = parse("One #two three #four");
  const expected = [{"hashtag":"two","indices":[4,8]},{"hashtag":"four","indices":[15,20]}];

  t.deepEqual(transform(actual), expected);
});

test("Extract a non-latin hashtag", t => {
  const actual = parse("Hashtags in #русский!");
  const expected = [{"hashtag":"русский","indices":[12,20]}];

  t.deepEqual(transform(actual), expected);
});

test("Extract multiple non-latin hashtags", t => {
  const actual = parse("Hashtags in #中文, #日本語, #한국말, and #русский! Try it out!");
  const expected = [{"hashtag":"中文","indices":[12,15]},{"hashtag":"日本語","indices":[17,21]},{"hashtag":"한국말","indices":[23,27]},{"hashtag":"русский","indices":[33,41]}];

  t.deepEqual(transform(actual), expected);
});
