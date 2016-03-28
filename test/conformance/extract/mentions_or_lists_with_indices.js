import test from 'ava';
import { parse } from '../../..';

const transform = output => output.entities.user_mentions.map(mention => ({ list_slug: "", ...mention }));

test("Extract a mention", t => {
  const actual = parse("@username yo!");
  const expected = [{"screen_name":"username","list_slug":"","indices":[0,9]}];

  t.same(transform(actual), expected);
});

test("Extract a list", t => {
  const actual = parse("@username/list-name is a great list!");
  const expected = [{"screen_name":"username","list_slug":"/list-name","indices":[0,19]}];

  t.same(transform(actual), expected);
});

test("Extract a mention and list", t => {
  const actual = parse("Hey @username, check out out @otheruser/list_name-01!");
  const expected = [{"screen_name":"username","list_slug":"","indices":[4,13]},{"screen_name":"otheruser","list_slug":"/list_name-01","indices":[29,52]}];

  t.same(transform(actual), expected);
});

test("Extract a list in the middle of a Japanese tweet", t => {
  const actual = parse("の@username/list_name-01に到着を待っている");
  const expected = [{"screen_name":"username","list_slug":"/list_name-01","indices":[1,23]}];

  t.same(transform(actual), expected);
});

test("DO NOT extract a list with slug that starts with a number", t => {
  const actual = parse("@username/7list-name is a great list!");
  const expected = [{"screen_name":"username","list_slug":"","indices":[0,9]}];

  t.same(transform(actual), expected);
});
