import test from 'ava';
import { parse } from '..';

test(t => {
  const actual = parse('$TWTR');
  const expected = {
    text: '$TWTR',
    entities: {
      hashtags: [],
      symbols: [{ text: 'TWTR', indices: [0, 5] }],
      urls: [],
      user_mentions: []
    }
  };

  t.same(actual, expected);
});
