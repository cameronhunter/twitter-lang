import test from 'ava';
import { parse } from '../../..';

const transform = output => output.entities.urls;

test("Extract a URL", t => {
  const actual = parse("text http://google.com");
  const expected = [{"url":"http://google.com","indices":[5,22]}];

  t.deepEqual(transform(actual), expected);
});

test("Extract a URL from a Japanese tweet", t => {
  const actual = parse("皆さん見てください！ http://google.com");
  const expected = [{"url":"http://google.com","indices":[11,28]}];

  t.deepEqual(transform(actual), expected);
});

test("Extract URLs without protocol on ccTLD with slash", t => {
  const actual = parse("t.co/abcde bit.ly/abcde");
  const expected = [{"url":"t.co/abcde","indices":[0,10]},{"url":"bit.ly/abcde","indices":[11,23]}];

  t.deepEqual(transform(actual), expected);
});

test("Extract URLs without protocol surrounded by CJK characters", t => {
  const actual = parse("twitter.comこれは日本語です。example.com中国語t.co/abcde한국twitter.com example2.comテストtwitter.com/abcde");
  const expected = [{"url":"twitter.com","indices":[0,11]},{"url":"example.com","indices":[20,31]},{"url":"t.co/abcde","indices":[34,44]},{"url":"twitter.com","indices":[46,57]},{"url":"example2.com","indices":[58,70]},{"url":"twitter.com/abcde","indices":[73,90]}];

  t.deepEqual(transform(actual), expected);
});

test("Extract URLs with and without protocol surrounded by CJK characters", t => {
  const actual = parse("http://twitter.com/これは日本語です。example.com中国語http://t.co/abcde한국twitter.comテストexample2.comテストhttp://twitter.com/abcde");
  const expected = [{"url":"http://twitter.com/","indices":[0,19]},{"url":"example.com","indices":[28,39]},{"url":"http://t.co/abcde","indices":[42,59]},{"url":"twitter.com","indices":[61,72]},{"url":"example2.com","indices":[75,87]},{"url":"http://twitter.com/abcde","indices":[90,114]}];

  t.deepEqual(transform(actual), expected);
});

test("Extract t.co URLs skipping trailing characters and adjusting indices correctly", t => {
  const actual = parse("http://t.co/pbY2NfTZ's http://t.co/2vYHpAc5; http://t.co/ulYGBYSo: http://t.co/8MkmHU0k+c http://t.co/TKLp64dY.x http://t.co/8t7G3ddS#a http://t.co/FNkPfmii-");
  const expected = [{"url":"http://t.co/pbY2NfTZ","indices":[0,20]},{"url":"http://t.co/2vYHpAc5","indices":[23,43]},{"url":"http://t.co/ulYGBYSo","indices":[45,65]},{"url":"http://t.co/8MkmHU0k","indices":[67,87]},{"url":"http://t.co/TKLp64dY","indices":[90,110]},{"url":"http://t.co/8t7G3ddS","indices":[113,133]},{"url":"http://t.co/FNkPfmii","indices":[136,156]}];

  t.deepEqual(transform(actual), expected);
});

test("Extract correct indices for duplicate instances of the same URL", t => {
  const actual = parse("http://t.co http://t.co");
  const expected = [{"url":"http://t.co","indices":[0,11]},{"url":"http://t.co","indices":[12,23]}];

  t.deepEqual(transform(actual), expected);
});

test("Extract I18N URL", t => {
  const actual = parse("test http://xn--ls8h.XN--ls8h.la/");
  const expected = [{"url":"http://xn--ls8h.XN--ls8h.la/","indices":[5,33]}];

  t.deepEqual(transform(actual), expected);
});

test("Extract URLs with IDN(not encoded)", t => {
  const actual = parse("test http://foobar.みんな/ http://foobar.中国/ http://foobar.پاکستان/ ");
  const expected = [{"url":"http://foobar.みんな/","indices":[5,23]},{"url":"http://foobar.中国/","indices":[24,41]},{"url":"http://foobar.پاکستان/","indices":[42,64]}];

  t.deepEqual(transform(actual), expected);
});
