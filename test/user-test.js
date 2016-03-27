import test from 'ava';
import { parse } from '..';

test('Single user using at-sign', t => {
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

test('Single user using alternative at-sign', t => {
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

test('Multiple users', t => {
  const actual = parse('@cameronhunter ＠twitter');
  const expected = {
    text: '@cameronhunter ＠twitter',
    entities: {
      hashtags: [],
      symbols: [],
      urls: [],
      user_mentions: [
        { screen_name: 'cameronhunter', indices: [0, 14] },
        { screen_name: 'twitter', indices: [15, 23] }
      ]
    }
  };

  t.same(actual, expected);
});

test('Non-user text', t => {
  const actual = parse('this is not a @ user');
  const expected = {
    text: 'this is not a @ user',
    entities: {
      hashtags: [],
      symbols: [],
      urls: [],
      user_mentions: []
    }
  };

  t.same(actual, expected);
});
