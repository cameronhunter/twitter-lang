import test from 'ava';
import { parse } from '../../..';

const transform = output => output.entities.user_mentions.filter(({ indices }) => indices[0] == 0).map(mention => mention.screen_name)[0] || null;

test("Extract reply at the begining of a tweet", t => {
  const actual = parse("@username reply");
  const expected = "username";

  t.deepEqual(transform(actual), expected);
});

test("Extract reply preceded by only a space", t => {
  const actual = parse(" @username reply");
  const expected = "username";

  t.deepEqual(transform(actual), expected);
});

test("Extract reply preceded by only a full-width space (U+3000)", t => {
  const actual = parse("　@username reply");
  const expected = "username";

  t.deepEqual(transform(actual), expected);
});

test("DO NOT Extract reply when preceded by text", t => {
  const actual = parse("a @username mention, not a reply");
  const expected = null;

  t.deepEqual(transform(actual), expected);
});

test("DO NOT Extract reply when preceded by .", t => {
  const actual = parse(".@username mention, not a reply");
  const expected = null;

  t.deepEqual(transform(actual), expected);
});

test("DO NOT Extract reply when preceded by /", t => {
  const actual = parse("/@username mention, not a reply");
  const expected = null;

  t.deepEqual(transform(actual), expected);
});

test("DO NOT Extract reply when preceded by _", t => {
  const actual = parse("_@username mention, not a reply");
  const expected = null;

  t.deepEqual(transform(actual), expected);
});

test("DO NOT Extract reply when preceded by -", t => {
  const actual = parse("-@username mention, not a reply");
  const expected = null;

  t.deepEqual(transform(actual), expected);
});

test("DO NOT Extract reply when preceded by +", t => {
  const actual = parse("+@username mention, not a reply");
  const expected = null;

  t.deepEqual(transform(actual), expected);
});

test("DO NOT Extract reply when preceded by #", t => {
  const actual = parse("#@username mention, not a reply");
  const expected = null;

  t.deepEqual(transform(actual), expected);
});

test("DO NOT Extract reply when preceded by !", t => {
  const actual = parse("!@username mention, not a reply");
  const expected = null;

  t.deepEqual(transform(actual), expected);
});

test("DO NOT Extract reply when preceded by @", t => {
  const actual = parse("@@username mention, not a reply");
  const expected = null;

  t.deepEqual(transform(actual), expected);
});

test("DO NOT Extract reply when followed by URL", t => {
  const actual = parse("@http://twitter.com");
  const expected = null;

  t.deepEqual(transform(actual), expected);
});
