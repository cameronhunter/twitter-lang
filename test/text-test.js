import test from 'ava';
import { parse } from '..';

test(t => {
  const actual = parse('hello');
  const expected = {
    text: 'hello',
    entities: {
      hashtags: [],
      symbols: [],
      urls: [],
      user_mentions: []
    }
  };

  t.same(actual, expected);
});

test(t => {
  const actual = parse('hello world');
  const expected = {
    text: 'hello world',
    entities: {
      hashtags: [],
      symbols: [],
      urls: [],
      user_mentions: []
    }
  };

  t.same(actual, expected);
});
