import test from 'ava';
import { parse } from '../../..';

const transform = output => output.entities.user_mentions;

test("Extract a mention at the start", t => {
  const actual = parse("@username yo!");
  const expected = [{"screen_name":"username","indices":[0,9]}];

  t.same(transform(actual), expected);
});

test("Extract a mention that has the same thing mentioned at the start", t => {
  const actual = parse("username @username");
  const expected = [{"screen_name":"username","indices":[9,18]}];

  t.same(transform(actual), expected);
});

test("Extract a mention in the middle of a Japanese tweet", t => {
  const actual = parse("の@usernameに到着を待っている");
  const expected = [{"screen_name":"username","indices":[1,10]}];

  t.same(transform(actual), expected);
});
