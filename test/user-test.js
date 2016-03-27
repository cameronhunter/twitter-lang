import test from 'ava';
import { parse } from '..';

test(t => {
  const actual = parse('@cameronhunter');
  const expected = {
    text: '@cameronhunter',
    entities: {
      hashtags: [],
      symbols: [],
      urls: [],
      user_mentions: [{ screen_name: 'cameronhunter', indices: [0, 14] }]
    }
  };

  t.same(actual, expected);
});
