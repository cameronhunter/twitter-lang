import test from 'ava';
import { parse } from '..';

test('\\u0020', t => {
  const actual = parse('hello\u0020world');
  const expected = {
    text: 'hello\u0020world',
    entities: {
      hashtags: [],
      symbols: [],
      urls: [],
      user_mentions: []
    }
  };

  t.same(actual, expected);
});

test('\\u0085', t => {
  const actual = parse('hello\u0085world');
  const expected = {
    text: 'hello\u0085world',
    entities: {
      hashtags: [],
      symbols: [],
      urls: [],
      user_mentions: []
    }
  };

  t.same(actual, expected);
});
