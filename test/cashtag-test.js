import test from 'ava';
import { parse } from '..';

test('Single cashtag', t => {
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

  t.deepEqual(actual, expected);
});

test('Multiple cashtags', t => {
  const actual = parse('$TWTR $tsla');
  const expected = {
    text: '$TWTR $tsla',
    entities: {
      hashtags: [],
      symbols: [
        { text: 'TWTR', indices: [0, 5] },
        { text: 'tsla', indices: [6, 11] }
      ],
      urls: [],
      user_mentions: []
    }
  };

  t.deepEqual(actual, expected);
});

test('Non-cashtag text', t => {
  const actual = parse('This is not a $ cashtag');
  const expected = {
    text: 'This is not a $ cashtag',
    entities: {
      hashtags: [],
      symbols: [],
      urls: [],
      user_mentions: []
    }
  };

  t.deepEqual(actual, expected);
});
