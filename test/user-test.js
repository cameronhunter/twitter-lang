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

test(t => {
  const actual = parse('＠twitter');
  const expected = {
    text: '＠twitter',
    entities: {
      hashtags: [],
      symbols: [],
      urls: [],
      user_mentions: [{ screen_name: 'twitter', indices: [0, 8] }]
    }
  };

  t.same(actual, expected);
});
