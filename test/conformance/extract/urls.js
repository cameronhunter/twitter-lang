import test from 'ava';
import { parse } from '../../..';

const transform = output => output.entities.urls.map(url => url.url);

test("Extract a lone URL", t => {
  const actual = parse("http://example.com");
  const expected = ["http://example.com"];

  t.deepEqual(transform(actual), expected);
});

test("Extract valid URL: http://google.com", t => {
  const actual = parse("text http://google.com");
  const expected = ["http://google.com"];

  t.deepEqual(transform(actual), expected);
});

test("Extract valid URL: http://foobar.com/#", t => {
  const actual = parse("text http://foobar.com/#");
  const expected = ["http://foobar.com/#"];

  t.deepEqual(transform(actual), expected);
});

test("Extract valid URL: http://google.com/#foo", t => {
  const actual = parse("text http://google.com/#foo");
  const expected = ["http://google.com/#foo"];

  t.deepEqual(transform(actual), expected);
});

test("Extract valid URL: http://google.com/#search?q=iphone%20-filter%3Alinks", t => {
  const actual = parse("text http://google.com/#search?q=iphone%20-filter%3Alinks");
  const expected = ["http://google.com/#search?q=iphone%20-filter%3Alinks"];

  t.deepEqual(transform(actual), expected);
});

test("Extract valid URL: http://twitter.com/#search?q=iphone%20-filter%3Alinks", t => {
  const actual = parse("text http://twitter.com/#search?q=iphone%20-filter%3Alinks");
  const expected = ["http://twitter.com/#search?q=iphone%20-filter%3Alinks"];

  t.deepEqual(transform(actual), expected);
});

test("Extract valid URL: http://somedomain.com/index.php?path=/abc/def/", t => {
  const actual = parse("text http://somedomain.com/index.php?path=/abc/def/");
  const expected = ["http://somedomain.com/index.php?path=/abc/def/"];

  t.deepEqual(transform(actual), expected);
});

test("Extract valid URL: http://www.boingboing.net/2007/02/14/katamari_damacy_phon.html", t => {
  const actual = parse("text http://www.boingboing.net/2007/02/14/katamari_damacy_phon.html");
  const expected = ["http://www.boingboing.net/2007/02/14/katamari_damacy_phon.html"];

  t.deepEqual(transform(actual), expected);
});

test("Extract valid URL: http://somehost.com:3000", t => {
  const actual = parse("text http://somehost.com:3000");
  const expected = ["http://somehost.com:3000"];

  t.deepEqual(transform(actual), expected);
});

test("Extract valid URL: http://xo.com/~matthew+%ff-x", t => {
  const actual = parse("text http://xo.com/~matthew+%ff-x");
  const expected = ["http://xo.com/~matthew+%ff-x"];

  t.deepEqual(transform(actual), expected);
});

test("Extract valid URL: http://xo.com/~matthew+%ff-,.;x", t => {
  const actual = parse("text http://xo.com/~matthew+%ff-,.;x");
  const expected = ["http://xo.com/~matthew+%ff-,.;x"];

  t.deepEqual(transform(actual), expected);
});

test("Extract valid URL: http://xo.com/,.;x", t => {
  const actual = parse("text http://xo.com/,.;x");
  const expected = ["http://xo.com/,.;x"];

  t.deepEqual(transform(actual), expected);
});

test("Extract valid URL: http://en.wikipedia.org/wiki/Primer_(film)", t => {
  const actual = parse("text http://en.wikipedia.org/wiki/Primer_(film)");
  const expected = ["http://en.wikipedia.org/wiki/Primer_(film)"];

  t.deepEqual(transform(actual), expected);
});

test("Extract valid URL: http://www.ams.org/bookstore-getitem/item=mbk-59", t => {
  const actual = parse("text http://www.ams.org/bookstore-getitem/item=mbk-59");
  const expected = ["http://www.ams.org/bookstore-getitem/item=mbk-59"];

  t.deepEqual(transform(actual), expected);
});

test("Extract valid URL: http://✪df.ws/ejp", t => {
  const actual = parse("text http://✪df.ws/ejp");
  const expected = ["http://✪df.ws/ejp"];

  t.deepEqual(transform(actual), expected);
});

test("Extract valid URL: http://chilp.it/?77e8fd", t => {
  const actual = parse("text http://chilp.it/?77e8fd");
  const expected = ["http://chilp.it/?77e8fd"];

  t.deepEqual(transform(actual), expected);
});

test("Extract valid URL: http://x.com/oneletterdomain", t => {
  const actual = parse("text http://x.com/oneletterdomain");
  const expected = ["http://x.com/oneletterdomain"];

  t.deepEqual(transform(actual), expected);
});

test("Extract valid URL: http://msdn.microsoft.com/ja-jp/library/system.net.httpwebrequest(v=VS.100).aspx", t => {
  const actual = parse("text http://msdn.microsoft.com/ja-jp/library/system.net.httpwebrequest(v=VS.100).aspx");
  const expected = ["http://msdn.microsoft.com/ja-jp/library/system.net.httpwebrequest(v=VS.100).aspx"];

  t.deepEqual(transform(actual), expected);
});

test("DO NOT extract invalid URL: http://domain-begin_dash_2314352345_dfasd.foo-cow_4352.com", t => {
  const actual = parse("text http://domain-dash_2314352345_dfasd.foo-cow_4352.com");
  const expected = [];

  t.deepEqual(transform(actual), expected);
});

test("DO NOT extract invalid URL: http://-begin_dash_2314352345_dfasd.foo-cow_4352.com", t => {
  const actual = parse("text http://-dash_2314352345_dfasd.foo-cow_4352.com");
  const expected = [];

  t.deepEqual(transform(actual), expected);
});

test("DO NOT extract invalid URL: http://no-tld", t => {
  const actual = parse("text http://no-tld");
  const expected = [];

  t.deepEqual(transform(actual), expected);
});

test("DO NOT extract invalid URL: http://tld-too-short.x", t => {
  const actual = parse("text http://tld-too-short.x");
  const expected = [];

  t.deepEqual(transform(actual), expected);
});

test("DO NOT extract invalid URL with invalid preceding character: (http://twitter.com", t => {
  const actual = parse("(http://twitter.com");
  const expected = ["http://twitter.com"];

  t.deepEqual(transform(actual), expected);
});

test("Extract a very long hyphenated sub-domain URL (single letter hyphens)", t => {
  const actual = parse("text http://word-and-a-number-8-ftw.domain.com/");
  const expected = ["http://word-and-a-number-8-ftw.domain.com/"];

  t.deepEqual(transform(actual), expected);
});

test("Extract a hyphenated TLD (usually a typo)", t => {
  const actual = parse("text http://domain.com-that-you-should-have-put-a-space-after");
  const expected = ["http://domain.com"];

  t.deepEqual(transform(actual), expected);
});

test("Extract URL ending with # value", t => {
  const actual = parse("text http://foo.com?#foo text");
  const expected = ["http://foo.com?#foo"];

  t.deepEqual(transform(actual), expected);
});

test("Extract URLs without protocol on (com|org|edu|gov|net) domains", t => {
  const actual = parse("foo.com foo.net foo.org foo.edu foo.gov");
  const expected = ["foo.com","foo.net","foo.org","foo.edu","foo.gov"];

  t.deepEqual(transform(actual), expected);
});

test("Extract URLs without protocol not on (com|org|edu|gov|net) domains", t => {
  const actual = parse("foo.baz foo.co.jp www.xxxxxxx.baz www.foo.co.uk wwwww.xxxxxxx foo.comm foo.somecom foo.govedu foo.jp");
  const expected = ["foo.co.jp","www.foo.co.uk"];

  t.deepEqual(transform(actual), expected);
});

test("Extract URLs without protocol on ccTLD with slash", t => {
  const actual = parse("t.co/abcde bit.ly/abcde");
  const expected = ["t.co/abcde","bit.ly/abcde"];

  t.deepEqual(transform(actual), expected);
});

test("Extract URLs with protocol on ccTLD domains", t => {
  const actual = parse("http://foo.jp http://fooooo.jp");
  const expected = ["http://foo.jp","http://fooooo.jp"];

  t.deepEqual(transform(actual), expected);
});

test("Extract URLs with a - or + at the end of the path", t => {
  const actual = parse("Go to http://example.com/a+ or http://example.com/a-");
  const expected = ["http://example.com/a+","http://example.com/a-"];

  t.deepEqual(transform(actual), expected);
});

test("Extract URLs with longer paths ending in -", t => {
  const actual = parse("Go to http://example.com/view/slug-url-?foo=bar");
  const expected = ["http://example.com/view/slug-url-?foo=bar"];

  t.deepEqual(transform(actual), expected);
});

test("Extract URLs beginning with a space", t => {
  const actual = parse("@user Try http:// example.com/path");
  const expected = ["example.com/path"];

  t.deepEqual(transform(actual), expected);
});

test("Extract long URL without protocol surrounded by CJK characters", t => {
  const actual = parse("これは日本語です。example.com/path/index.html中国語example.com/path한국");
  const expected = ["example.com/path/index.html","example.com/path"];

  t.deepEqual(transform(actual), expected);
});

test("Extract short URL without protocol surrounded by CJK characters", t => {
  const actual = parse("twitter.comこれは日本語です。example.com中国語t.co/abcde한국twitter.com example2.comテストtwitter.com/abcde");
  const expected = ["twitter.com","example.com","t.co/abcde","twitter.com","example2.com","twitter.com/abcde"];

  t.deepEqual(transform(actual), expected);
});

test("Extract URLs with and without protocol surrounded by CJK characters", t => {
  const actual = parse("http://twitter.com/これは日本語です。example.com中国語http://t.co/abcde한국twitter.comテストexample2.comテストhttp://twitter.com/abcde");
  const expected = ["http://twitter.com/","example.com","http://t.co/abcde","twitter.com","example2.com","http://twitter.com/abcde"];

  t.deepEqual(transform(actual), expected);
});

test("Extract URLs with protocol and path containing Cyrillic characters", t => {
  const actual = parse("Go to http://twitter.com/Русские_слова");
  const expected = ["http://twitter.com/Русские_слова"];

  t.deepEqual(transform(actual), expected);
});

test("DO NOT extract short URLs without protocol on ccTLD domains without path", t => {
  const actual = parse("twitter.jp日本語it.so中国語foo.jp it.so foo.jp");
  const expected = [];

  t.deepEqual(transform(actual), expected);
});

test("Extract some (tv|co) short URLs without protocol on ccTLD domains without path", t => {
  const actual = parse("MLB.tv vine.co twitch.tv t.co");
  const expected = ["MLB.tv","vine.co","twitch.tv","t.co"];

  t.deepEqual(transform(actual), expected);
});

test("Extract URLs beginning with a non-breaking space (U+00A0)", t => {
  const actual = parse("@user Try http:// example.com/path");
  const expected = ["example.com/path"];

  t.deepEqual(transform(actual), expected);
});

test("Extract URLs with underscores and dashes in the subdomain", t => {
  const actual = parse("test http://sub_domain-dash.twitter.com");
  const expected = ["http://sub_domain-dash.twitter.com"];

  t.deepEqual(transform(actual), expected);
});

test("Extract URL with minimum number of valid characters", t => {
  const actual = parse("test http://a.b.cd");
  const expected = ["http://a.b.cd"];

  t.deepEqual(transform(actual), expected);
});

test("Extract URLs containing underscores and dashes", t => {
  const actual = parse("test http://a_b.c-d.com");
  const expected = ["http://a_b.c-d.com"];

  t.deepEqual(transform(actual), expected);
});

test("Extract URLs containing dashes in the subdomain", t => {
  const actual = parse("test http://a-b.c.com");
  const expected = ["http://a-b.c.com"];

  t.deepEqual(transform(actual), expected);
});

test("Extract URLs with dashes in the domain name", t => {
  const actual = parse("test http://twitter-dash.com");
  const expected = ["http://twitter-dash.com"];

  t.deepEqual(transform(actual), expected);
});

test("Extract URLs with lots of symbols then a period", t => {
  const actual = parse("http://www.bestbuy.com/site/Currie+Technologies+-+Ezip+400+Scooter/9885188.p?id=1218189013070&skuId=9885188");
  const expected = ["http://www.bestbuy.com/site/Currie+Technologies+-+Ezip+400+Scooter/9885188.p?id=1218189013070&skuId=9885188"];

  t.deepEqual(transform(actual), expected);
});

test("DO NOT extract URLs containing leading dashes in the subdomain", t => {
  const actual = parse("test http://-leadingdash.twitter.com");
  const expected = [];

  t.deepEqual(transform(actual), expected);
});

test("DO NOT extract URLs containing trailing dashes in the subdomain", t => {
  const actual = parse("test http://trailingdash-.twitter.com");
  const expected = [];

  t.deepEqual(transform(actual), expected);
});

test("DO NOT extract URLs containing leading underscores in the subdomain", t => {
  const actual = parse("test http://_leadingunderscore.twitter.com");
  const expected = [];

  t.deepEqual(transform(actual), expected);
});

test("DO NOT extract URLs containing trailing underscores in the subdomain", t => {
  const actual = parse("test http://trailingunderscore_.twitter.com");
  const expected = [];

  t.deepEqual(transform(actual), expected);
});

test("DO NOT extract URLs containing leading dashes in the domain name", t => {
  const actual = parse("test http://-twitter.com");
  const expected = [];

  t.deepEqual(transform(actual), expected);
});

test("DO NOT extract URLs containing trailing dashes in the domain name", t => {
  const actual = parse("test http://twitter-.com");
  const expected = [];

  t.deepEqual(transform(actual), expected);
});

test("DO NOT extract URLs containing underscores in the domain name", t => {
  const actual = parse("test http://twitter_underscore.com");
  const expected = [];

  t.deepEqual(transform(actual), expected);
});

test("DO NOT extract URLs containing underscores in the tld", t => {
  const actual = parse("test http://twitter.c_o_m");
  const expected = [];

  t.deepEqual(transform(actual), expected);
});

test("Extract valid URL http://www.foo.com/foo/path-with-period./", t => {
  const actual = parse("test http://www.foo.com/foo/path-with-period./");
  const expected = ["http://www.foo.com/foo/path-with-period./"];

  t.deepEqual(transform(actual), expected);
});

test("Extract valid URL http://www.foo.org.za/foo/bar/688.1", t => {
  const actual = parse("test http://www.foo.org.za/foo/bar/688.1");
  const expected = ["http://www.foo.org.za/foo/bar/688.1"];

  t.deepEqual(transform(actual), expected);
});

test("Extract valid URL http://www.foo.com/bar-path/some.stm?param1=foo;param2=P1|0||P2|0", t => {
  const actual = parse("test http://www.foo.com/bar-path/some.stm?param1=foo;param2=P1|0||P2|0");
  const expected = ["http://www.foo.com/bar-path/some.stm?param1=foo;param2=P1|0||P2|0"];

  t.deepEqual(transform(actual), expected);
});

test("Extract valid URL http://foo.com/bar/123/foo_&_bar/", t => {
  const actual = parse("test http://foo.com/bar/123/foo_&_bar/");
  const expected = ["http://foo.com/bar/123/foo_&_bar/"];

  t.deepEqual(transform(actual), expected);
});

test("Extract valid URL http://www.cp.sc.edu/events/65", t => {
  const actual = parse("test http://www.cp.sc.edu/events/65 test");
  const expected = ["http://www.cp.sc.edu/events/65"];

  t.deepEqual(transform(actual), expected);
});

test("Extract valid URL http://www.andersondaradio.no.comunidades.net/", t => {
  const actual = parse("http://www.andersondaradio.no.comunidades.net/ test test");
  const expected = ["http://www.andersondaradio.no.comunidades.net/"];

  t.deepEqual(transform(actual), expected);
});

test("Extract valid URL ELPAÍS.com", t => {
  const actual = parse("test ELPAÍS.com");
  const expected = ["ELPAÍS.com"];

  t.deepEqual(transform(actual), expected);
});

test("DO NOT include period at the end of URL", t => {
  const actual = parse("test http://twitter.com/.");
  const expected = ["http://twitter.com/"];

  t.deepEqual(transform(actual), expected);
});

test("Extract a URL with '?' in fragment", t => {
  const actual = parse("http://tn.com.ar/show/00056158/la-estrella-del-certamen-el-turno-de-pamela-anderson?fb_xd_fragment#?=&cb=fe17523f223b7&relation=parent.parent&transport=fragment&type=resize&height=20&ackdata");
  const expected = ["http://tn.com.ar/show/00056158/la-estrella-del-certamen-el-turno-de-pamela-anderson?fb_xd_fragment#?=&cb=fe17523f223b7&relation=parent.parent&transport=fragment&type=resize&height=20&ackdata"];

  t.deepEqual(transform(actual), expected);
});

test("Extract a URL with '?' in fragment in a text", t => {
  const actual = parse("text http://tn.com.ar/show/00056158/la-estrella-del-certamen-el-turno-de-pamela-anderson?fb_xd_fragment#?=&cb=fe17523f223b7&relation=parent.parent&transport=fragment&type=resize&height=20&ackdata text");
  const expected = ["http://tn.com.ar/show/00056158/la-estrella-del-certamen-el-turno-de-pamela-anderson?fb_xd_fragment#?=&cb=fe17523f223b7&relation=parent.parent&transport=fragment&type=resize&height=20&ackdata"];

  t.deepEqual(transform(actual), expected);
});

test("Extract a URL with a ton of trailing periods", t => {
  const actual = parse("Test a ton of periods http://example.com/path..........................................");
  const expected = ["http://example.com/path"];

  t.deepEqual(transform(actual), expected);
});

test("Extract a URL with a ton of trailing commas", t => {
  const actual = parse("Test a ton of periods http://example.com/,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,");
  const expected = ["http://example.com/"];

  t.deepEqual(transform(actual), expected);
});

test("Extract a URL with a ton of trailing '!'", t => {
  const actual = parse("Test a ton of periods http://example.com/path/!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  const expected = ["http://example.com/path/"];

  t.deepEqual(transform(actual), expected);
});

test("DO NOT extract URLs in hashtag or @mention", t => {
  const actual = parse("#test.com @test.com #http://test.com @http://test.com #t.co/abcde @t.co/abcde");
  const expected = [];

  t.deepEqual(transform(actual), expected);
});

test("Extract a t.co URL with a trailing apostrophe", t => {
  const actual = parse("I really like http://t.co/pbY2NfTZ's website");
  const expected = ["http://t.co/pbY2NfTZ"];

  t.deepEqual(transform(actual), expected);
});

test("Extract a t.co URL with a trailing hyphen", t => {
  const actual = parse("Check this site out http://t.co/FNkPfmii- it's great");
  const expected = ["http://t.co/FNkPfmii"];

  t.deepEqual(transform(actual), expected);
});

test("Extract a t.co URL with a trailing colon", t => {
  const actual = parse("According to http://t.co/ulYGBYSo: the internet is cool");
  const expected = ["http://t.co/ulYGBYSo"];

  t.deepEqual(transform(actual), expected);
});

test("Extract URL before newline", t => {
  const actual = parse("http://twitter.com\nhttp://example.com\nhttp://example.com/path\nexample.com/path\nit.so\nit.so/abcde");
  const expected = ["http://twitter.com","http://example.com","http://example.com/path","example.com/path","it.so/abcde"];

  t.deepEqual(transform(actual), expected);
});

test("DO NOT extract URL if preceded by $", t => {
  const actual = parse("$http://twitter.com $twitter.com $http://t.co/abcde $t.co/abcde $t.co $TVI.CA $RBS.CA");
  const expected = [];

  t.deepEqual(transform(actual), expected);
});

test("DO NOT extract .bz2 file name as URL", t => {
  const actual = parse("long.test.tar.bz2 test.tar.bz2 tar.bz2");
  const expected = [];

  t.deepEqual(transform(actual), expected);
});

test("DO NOT extract URL with gTLD followed by @ sign", t => {
  const actual = parse("john.doe.gov@mail.com");
  const expected = [];

  t.deepEqual(transform(actual), expected);
});

test("DO NOT extract URL with ccTLD followed by @ sign", t => {
  const actual = parse("john.doe.jp@mail.com");
  const expected = [];

  t.deepEqual(transform(actual), expected);
});
