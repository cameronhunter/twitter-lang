import test from 'ava';
import { parse } from '..';

test('Single list using at-sign', t => {
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

  t.deepEqual(actual, expected);
});

test('Single list using alternative at-sign', t => {
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

  t.deepEqual(actual, expected);
});

test('Multiple lists', t => {
  const actual = parse('@cameronhunter/list-slug ＠twitter/tweeps');
  const expected = {
    text: '@cameronhunter/list-slug ＠twitter/tweeps',
    entities: {
      hashtags: [],
      symbols: [],
      urls: [],
      user_mentions: [
        { screen_name: 'cameronhunter', list_slug: '/list-slug', indices: [0, 24] },
        { screen_name: 'twitter', list_slug: '/tweeps', indices: [25, 40] }
      ]
    }
  };

  t.deepEqual(actual, expected);
});

test('Non-list text', t => {
  const actual = parse('This is not a @ user/list');
  const expected = {
    text: 'This is not a @ user/list',
    entities: {
      hashtags: [],
      symbols: [],
      urls: [],
      user_mentions: []
    }
  };

  t.deepEqual(actual, expected);
});
