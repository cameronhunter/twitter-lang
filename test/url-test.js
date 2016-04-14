import test from 'ava';
import { parse } from '..';

test('Single URL', t => {
  const actual = parse('http://twitter.com');
  const expected = {
    text: 'http://twitter.com',
    entities: {
      hashtags: [],
      symbols: [],
      urls: [{ url: 'http://twitter.com', indices: [0, 18] }],
      user_mentions: []
    }
  };

  t.deepEqual(actual, expected);
});

test('Multiple URLs', t => {
  const actual = parse('http://twitter.com/ https://google.com');
  const expected = {
    text: 'http://twitter.com/ https://google.com',
    entities: {
      hashtags: [],
      symbols: [],
      urls: [
        { url: 'http://twitter.com/', indices: [0, 19] },
        { url: 'https://google.com', indices: [20, 38] }
      ],
      user_mentions: []
    }
  };

  t.deepEqual(actual, expected);
});
