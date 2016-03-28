import test from 'ava';
import { parse } from '../../..';

const transform = output => output.entities.user_mentions.map(mention => mention.screen_name);

test("Extract mention at the begining of a tweet", t => {
  const actual = parse("@username reply");
  const expected = ["username"];

  t.same(transform(actual), expected);
});

test("Extract mention at the end of a tweet", t => {
  const actual = parse("mention @username");
  const expected = ["username"];

  t.same(transform(actual), expected);
});

test("Extract mention in the middle of a tweet", t => {
  const actual = parse("mention @username in the middle");
  const expected = ["username"];

  t.same(transform(actual), expected);
});

test("Extract mention of username with underscore", t => {
  const actual = parse("mention @user_name");
  const expected = ["user_name"];

  t.same(transform(actual), expected);
});

test("Extract mention of all numeric username", t => {
  const actual = parse("mention @12345");
  const expected = ["12345"];

  t.same(transform(actual), expected);
});

test("Extract mention or multiple usernames", t => {
  const actual = parse("mention @username1 @username2");
  const expected = ["username1","username2"];

  t.same(transform(actual), expected);
});

test("Extract mention in the middle of a Japanese tweet", t => {
  const actual = parse("の@usernameに到着を待っている");
  const expected = ["username"];

  t.same(transform(actual), expected);
});

test("DO NOT extract username ending in @", t => {
  const actual = parse("Current Status: @_@ (cc: @username)");
  const expected = ["username"];

  t.same(transform(actual), expected);
});

test("DO NOT extract username followed by accented latin characters", t => {
  const actual = parse("@aliceìnheiro something something");
  const expected = [];

  t.same(transform(actual), expected);
});

test("Extract lone metion but not @user@user (too close to an email)", t => {
  const actual = parse("@username email me @test@example.com");
  const expected = ["username"];

  t.same(transform(actual), expected);
});

test("DO NOT extract 'http' in '@http://' as username", t => {
  const actual = parse("@http://twitter.com");
  const expected = [];

  t.same(transform(actual), expected);
});

test("Extract mentions before newline", t => {
  const actual = parse("@username\n@mention");
  const expected = ["username","mention"];

  t.same(transform(actual), expected);
});

test("Extract mentions after 'RT'", t => {
  const actual = parse("RT@username RT:@mention RT @test");
  const expected = ["username","mention","test"];

  t.same(transform(actual), expected);
});

test("Extract mentions after 'rt'", t => {
  const actual = parse("rt@username rt:@mention rt @test");
  const expected = ["username","mention","test"];

  t.same(transform(actual), expected);
});

test("Extract mentions after 'Rt'", t => {
  const actual = parse("Rt@username Rt:@mention Rt @test");
  const expected = ["username","mention","test"];

  t.same(transform(actual), expected);
});

test("Extract mentions after 'rT'", t => {
  const actual = parse("rT@username rT:@mention rT @test");
  const expected = ["username","mention","test"];

  t.same(transform(actual), expected);
});

test("DO NOT extract username preceded by !", t => {
  const actual = parse("f!@kn");
  const expected = [];

  t.same(transform(actual), expected);
});

test("DO NOT extract username preceded by @", t => {
  const actual = parse("f@@kn");
  const expected = [];

  t.same(transform(actual), expected);
});

test("DO NOT extract username preceded by #", t => {
  const actual = parse("f#@kn");
  const expected = [];

  t.same(transform(actual), expected);
});

test("DO NOT extract username preceded by $", t => {
  const actual = parse("f$@kn");
  const expected = [];

  t.same(transform(actual), expected);
});

test("DO NOT extract username preceded by %", t => {
  const actual = parse("f%@kn");
  const expected = [];

  t.same(transform(actual), expected);
});

test("DO NOT extract username preceded by &", t => {
  const actual = parse("f&@kn");
  const expected = [];

  t.same(transform(actual), expected);
});

test("DO NOT extract username preceded by *", t => {
  const actual = parse("f*@kn");
  const expected = [];

  t.same(transform(actual), expected);
});
