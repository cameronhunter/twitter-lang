import test from 'ava';
import { parse } from '..';

test(t => {
  const actual = parse('#hashtag');
  const expected = {
    text: '#hashtag',
    entities: {
      hashtags: [{ text: 'hashtag', indices: [0, 8] }],
      symbols: [],
      urls: [],
      user_mentions: []
    }
  };

  t.same(actual, expected);
});
