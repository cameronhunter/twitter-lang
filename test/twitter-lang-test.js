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
