import test from 'ava';
import { parse } from '..';

test(t => {
  const actual = parse('@cameronhunter/list-slug');
  const expected = {
    text: '@cameronhunter/list-slug',
    entities: {
      hashtags: [],
      symbols: [],
      urls: [],
      user_mentions: [{ screen_name: 'cameronhunter', list_slug: '/list-slug', indices: [0, 24] }]
    }
  };

  t.same(actual, expected);
});

test(t => {
  const actual = parse('＠twitter/tweeps');
  const expected = {
    text: '＠twitter/tweeps',
    entities: {
      hashtags: [],
      symbols: [],
      urls: [],
      user_mentions: [{ screen_name: 'twitter', list_slug: '/tweeps', indices: [0, 15] }]
    }
  };

  t.same(actual, expected);
});
