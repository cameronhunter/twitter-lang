import test from 'ava';
import { parse } from '..';

test('Single hashtag using octothorpe', t => {
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

test('Single hashtag using sharp sign', t => {
  const actual = parse('＃sharptag');
  const expected = {
    text: '＃sharptag',
    entities: {
      hashtags: [{ text: 'sharptag', indices: [0, 9] }],
      symbols: [],
      urls: [],
      user_mentions: []
    }
  };

  t.same(actual, expected);
});

test('Multiple hashtags', t => {
  const actual = parse('#hashtag ＃sharptag');
  const expected = {
    text: '#hashtag ＃sharptag',
    entities: {
      hashtags: [
        { text: 'hashtag', indices: [0, 8] },
        { text: 'sharptag', indices: [9, 18] }
      ],
      symbols: [],
      urls: [],
      user_mentions: []
    }
  };

  t.same(actual, expected);
});

test('Non-hashtag text', t => {
  const actual = parse('This is not a # hashtag');
  const expected = {
    text: 'This is not a # hashtag',
    entities: {
      hashtags: [],
      symbols: [],
      urls: [],
      user_mentions: []
    }
  };

  t.same(actual, expected);
});
