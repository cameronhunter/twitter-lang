import test from 'ava';
import { parse } from '..';

test('\\u0020', t => {
  const actual = parse('$twtr\u0020$twtr');
  const expected = {
    text: '$twtr\u0020$twtr',
    entities: {
      hashtags: [],
      symbols: [
        { text: 'twtr', indices: [0, 5] },
        { text: 'twtr', indices: [6, 11] }
      ],
      urls: [],
      user_mentions: []
    }
  };

  t.same(actual, expected);
});

test('\\u2001', t => {
  const actual = parse('$twtr\u2001$twtr');
  const expected = {
    text: '$twtr\u2001$twtr',
    entities: {
      hashtags: [],
      symbols: [
        { text: 'twtr', indices: [0, 5] },
        { text: 'twtr', indices: [6, 11] }
      ],
      urls: [],
      user_mentions: []
    }
  };

  t.same(actual, expected);
});
