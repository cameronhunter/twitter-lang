import test from 'ava';
import { parse } from '..';

test(t => {
  const actual = parse('hello @cameronhunter');
  const expected = {
    text: 'hello @cameronhunter',
    entities: {
      hashtags: [],
      symbols: [],
      urls: [],
      user_mentions: [{ screen_name: 'cameronhunter', indices: [6, 20] }]
    }
  };

  t.same(actual, expected);
});

test(t => {
  const actual = parse('Hello @world, I love #hashtags and $twtr!');
  const expected = {
    text: 'Hello @world, I love #hashtags and $twtr!',
    entities: {
      hashtags: [{ text: 'hashtags', indices: [21, 30] }],
      symbols: [{ text: 'twtr', indices: [35, 40] }],
      urls: [],
      user_mentions: [{ screen_name: 'world', indices: [6, 12] }]
    }
  };

  t.same(actual, expected);
});
