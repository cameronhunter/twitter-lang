import test from 'ava';
import { parse } from '../../..';

const transform = output => output.entities.hashtags.map(hashtag => hashtag.text);

test("Extract an all-alpha hashtag", t => {
  const actual = parse("a #hashtag here");
  const expected = ["hashtag"];

  t.deepEqual(transform(actual), expected);
});

test("Extract a letter-then-number hashtag", t => {
  const actual = parse("this is #hashtag1");
  const expected = ["hashtag1"];

  t.deepEqual(transform(actual), expected);
});

test("Extract a number-then-letter hashtag", t => {
  const actual = parse("#1hashtag is this");
  const expected = ["1hashtag"];

  t.deepEqual(transform(actual), expected);
});

test("DO NOT Extract an all-numeric hashtag", t => {
  const actual = parse("On the #16 bus");
  const expected = [];

  t.deepEqual(transform(actual), expected);
});

test("DO NOT Extract a single numeric hashtag", t => {
  const actual = parse("#0");
  const expected = [];

  t.deepEqual(transform(actual), expected);
});

test("Extract hashtag after bracket", t => {
  const actual = parse("(#hashtag1 )#hashtag2 [#hashtag3 ]#hashtag4 ’#hashtag5’#hashtag6");
  const expected = ["hashtag1","hashtag2","hashtag3","hashtag4","hashtag5","hashtag6"];

  t.deepEqual(transform(actual), expected);
});

test("Extract a hashtag containing ñ", t => {
  const actual = parse("I'll write more tests #mañana");
  const expected = ["mañana"];

  t.deepEqual(transform(actual), expected);
});

test("Extract a hashtag containing é", t => {
  const actual = parse("Working remotely #café");
  const expected = ["café"];

  t.deepEqual(transform(actual), expected);
});

test("Extract a hashtag containing ü", t => {
  const actual = parse("Getting my Oktoberfest on #münchen");
  const expected = ["münchen"];

  t.deepEqual(transform(actual), expected);
});

test("DO NOT Extract a hashtag containing Japanese", t => {
  const actual = parse("this is not valid: # 会議中 ハッシュ");
  const expected = [];

  t.deepEqual(transform(actual), expected);
});

test("Extract a hashtag in Korean", t => {
  const actual = parse("What is #트위터 anyway?");
  const expected = ["트위터"];

  t.deepEqual(transform(actual), expected);
});

test("Extract a half-width Hangul hashtag", t => {
  const actual = parse("Just random half-width Hangul #ﾣﾦﾰ");
  const expected = ["ﾣﾦﾰ"];

  t.deepEqual(transform(actual), expected);
});

test("Extract a hashtag in Russian", t => {
  const actual = parse("What is #ашок anyway?");
  const expected = ["ашок"];

  t.deepEqual(transform(actual), expected);
});

test("Extract a starting katakana hashtag", t => {
  const actual = parse("#カタカナ is a hashtag");
  const expected = ["カタカナ"];

  t.deepEqual(transform(actual), expected);
});

test("Extract a starting hiragana hashtag", t => {
  const actual = parse("#ひらがな FTW!");
  const expected = ["ひらがな"];

  t.deepEqual(transform(actual), expected);
});

test("Extract a starting kanji hashtag", t => {
  const actual = parse("#漢字 is the future");
  const expected = ["漢字"];

  t.deepEqual(transform(actual), expected);
});

test("Extract a trailing katakana hashtag", t => {
  const actual = parse("Hashtag #カタカナ");
  const expected = ["カタカナ"];

  t.deepEqual(transform(actual), expected);
});

test("Extract a trailing hiragana hashtag", t => {
  const actual = parse("Japanese hashtags #ひらがな");
  const expected = ["ひらがな"];

  t.deepEqual(transform(actual), expected);
});

test("Extract a trailing kanji hashtag", t => {
  const actual = parse("Study time #漢字");
  const expected = ["漢字"];

  t.deepEqual(transform(actual), expected);
});

test("Extract a central katakana hashtag", t => {
  const actual = parse("See my #カタカナ hashtag?");
  const expected = ["カタカナ"];

  t.deepEqual(transform(actual), expected);
});

test("Extract a central hiragana hashtag", t => {
  const actual = parse("Study #ひらがな for fun and profit");
  const expected = ["ひらがな"];

  t.deepEqual(transform(actual), expected);
});

test("Extract a central kanji hashtag", t => {
  const actual = parse("Some say #漢字 is the past. what do they know?");
  const expected = ["漢字"];

  t.deepEqual(transform(actual), expected);
});

test("Extract a Kanji/Katakana mixed hashtag", t => {
  const actual = parse("日本語ハッシュタグテスト #日本語ハッシュタグ");
  const expected = ["日本語ハッシュタグ"];

  t.deepEqual(transform(actual), expected);
});

test("Extract a hashtag after a punctuation", t => {
  const actual = parse("日本語ハッシュテスト。#日本語ハッシュタグ");
  const expected = ["日本語ハッシュタグ"];

  t.deepEqual(transform(actual), expected);
});

test("DO NOT include a punctuation in a hashtag", t => {
  const actual = parse("#日本語ハッシュタグ。");
  const expected = ["日本語ハッシュタグ"];

  t.deepEqual(transform(actual), expected);
});

test("Extract a full-width Alnum hashtag", t => {
  const actual = parse("全角英数字ハッシュタグ ＃ｈａｓｈｔａｇ１２３");
  const expected = ["ｈａｓｈｔａｇ１２３"];

  t.deepEqual(transform(actual), expected);
});

test("DO NOT extract a hashtag without a preceding space", t => {
  const actual = parse("日本語ハッシュタグ#日本語ハッシュタグ");
  const expected = [];

  t.deepEqual(transform(actual), expected);
});

test("Hashtag with chouon", t => {
  const actual = parse("長音ハッシュタグ。#サッカー");
  const expected = ["サッカー"];

  t.deepEqual(transform(actual), expected);
});

test("Hashtag with half-width chouon", t => {
  const actual = parse("長音ハッシュタグ。#ｻｯｶｰ");
  const expected = ["ｻｯｶｰ"];

  t.deepEqual(transform(actual), expected);
});

test("Hashtag with half-widh voiced sounds marks", t => {
  const actual = parse("#ﾊｯｼｭﾀｸﾞ #ﾊﾟﾋﾟﾌﾟﾍﾟﾎﾟ");
  const expected = ["ﾊｯｼｭﾀｸﾞ","ﾊﾟﾋﾟﾌﾟﾍﾟﾎﾟ"];

  t.deepEqual(transform(actual), expected);
});

test("Hashtag with half-width # after full-width ！", t => {
  const actual = parse("できましたよー！#日本語ハッシュタグ。");
  const expected = ["日本語ハッシュタグ"];

  t.deepEqual(transform(actual), expected);
});

test("Hashtag with full-width ＃ after full-width ！", t => {
  const actual = parse("できましたよー！＃日本語ハッシュタグ。");
  const expected = ["日本語ハッシュタグ"];

  t.deepEqual(transform(actual), expected);
});

test("Hashtag with ideographic iteration mark", t => {
  const actual = parse("#云々 #学問のすゝめ #いすゞ #各〻 #各〃");
  const expected = ["云々","学問のすゝめ","いすゞ","各〻","各〃"];

  t.deepEqual(transform(actual), expected);
});

test("Extract hashtag with fullwidth tilde", t => {
  const actual = parse("#メ～テレ ハッシュタグ内で～が認識されず");
  const expected = ["メ～テレ"];

  t.deepEqual(transform(actual), expected);
});

test("Extract hashtag with wave dash", t => {
  const actual = parse("#メ〜テレ ハッシュタグ内で～が認識されず");
  const expected = ["メ〜テレ"];

  t.deepEqual(transform(actual), expected);
});

test("Hashtags with ş (U+015F)", t => {
  const actual = parse("Here’s a test tweet for you: #Ateş #qrşt #ştu #ş");
  const expected = ["Ateş","qrşt","ştu","ş"];

  t.deepEqual(transform(actual), expected);
});

test("Hashtags with İ (U+0130) and ı (U+0131)", t => {
  const actual = parse("Here’s a test tweet for you: #İn #ın");
  const expected = ["İn","ın"];

  t.deepEqual(transform(actual), expected);
});

test("Hashtag before punctuations", t => {
  const actual = parse("#hashtag: #hashtag; #hashtag, #hashtag. #hashtag! #hashtag?");
  const expected = ["hashtag","hashtag","hashtag","hashtag","hashtag","hashtag"];

  t.deepEqual(transform(actual), expected);
});

test("Hashtag after punctuations", t => {
  const actual = parse(":#hashtag ;#hashtag ,#hashtag .#hashtag !#hashtag ?#hashtag");
  const expected = ["hashtag","hashtag","hashtag","hashtag","hashtag","hashtag"];

  t.deepEqual(transform(actual), expected);
});

test("Hashtag before newline", t => {
  const actual = parse("#hashtag\ntest\n#hashtag2\ntest\n#hashtag3\n");
  const expected = ["hashtag","hashtag2","hashtag3"];

  t.deepEqual(transform(actual), expected);
});

test("DO NOT extract hashtag when # is followed by URL", t => {
  const actual = parse("#http://twitter.com #https://twitter.com");
  const expected = [];

  t.deepEqual(transform(actual), expected);
});

test("DO NOT extract hashtag if it's a part of URL", t => {
  const actual = parse("http://twitter.com/#hashtag twitter.com/#hashtag");
  const expected = [];

  t.deepEqual(transform(actual), expected);
});

test("Extract hashtags with Latin extended characters", t => {
  const actual = parse("#Azərbaycanca #mûǁae #Čeština #Ċaoiṁín");
  const expected = ["Azərbaycanca","mûǁae","Čeština","Ċaoiṁín"];

  t.deepEqual(transform(actual), expected);
});

test("Extract Arabic hashtags", t => {
  const actual = parse("#سیاست #ایران #السياسة #السياح #لغات  #اتمی  #کنفرانس #العربية #الجزيرة #فارسی");
  const expected = ["سیاست","ایران","السياسة","السياح","لغات","اتمی","کنفرانس","العربية","الجزيرة","فارسی"];

  t.deepEqual(transform(actual), expected);
});

test("Extract Arabic hashtags with underscore", t => {
  const actual = parse("#برنامه_نویسی  #رییس_جمهور  #رئيس_الوزراء, #ثبت_نام. #لس_آنجلس");
  const expected = ["برنامه_نویسی","رییس_جمهور","رئيس_الوزراء","ثبت_نام","لس_آنجلس"];

  t.deepEqual(transform(actual), expected);
});

test("Extract Hebrew hashtags", t => {
  const actual = parse("#עַל־יְדֵי #וכו׳ #מ״כ");
  const expected = ["עַל־יְדֵי","וכו׳","מ״כ"];

  t.deepEqual(transform(actual), expected);
});

test("Extract Thai hashtags", t => {
  const actual = parse("#ผู้เริ่ม #การเมือง #รายละเอียด #นักท่องเที่ยว #ของขวัญ #สนามบิน #เดินทาง #ประธาน");
  const expected = ["ผู้เริ่ม","การเมือง","รายละเอียด","นักท่องเที่ยว","ของขวัญ","สนามบิน","เดินทาง","ประธาน"];

  t.deepEqual(transform(actual), expected);
});

test("Extract Arabic hashtags with Zero-Width Non-Joiner", t => {
  const actual = parse("#أي‌بي‌إم #می‌خواهم");
  const expected = ["أي‌بي‌إم","می‌خواهم"];

  t.deepEqual(transform(actual), expected);
});

test("Extract Amharic hashtag", t => {
  const actual = parse("የአላህ መልእክተኛ ሰለላሁ ዓለይሂ ወሰለም #ኢትዮሙስሊምስ");
  const expected = ["ኢትዮሙስሊምስ"];

  t.deepEqual(transform(actual), expected);
});

test("Extract Sinhala hashtag with Zero-Width Joiner (U+200D)", t => {
  const actual = parse("#ශ්‍රීලංකා");
  const expected = ["ශ්‍රීලංකා"];

  t.deepEqual(transform(actual), expected);
});

test("Extract Arabic and Persian hashtags with numbers", t => {
  const actual = parse("#۳۴۵هشتگ #هشتگ۶۷۸ #ســـلام_عليكم_٤٠٦");
  const expected = ["۳۴۵هشتگ","هشتگ۶۷۸","ســـلام_عليكم_٤٠٦"];

  t.deepEqual(transform(actual), expected);
});

test("Extract Hindi hashtags", t => {
  const actual = parse("#महात्मा #महात्मा_१२३४ #१२३४ गांधी");
  const expected = ["महात्मा","महात्मा_१२३४"];

  t.deepEqual(transform(actual), expected);
});

test("Extract Indic script hashtags", t => {
  const actual = parse("#বাংলা #ગુજરાતી #ಕನ್ನಡ #മലയാളം #ଓଡ଼ିଆ #ਪੰਜਾਬੀ #සිංහල #தமிழ் #తెలుగు");
  const expected = ["বাংলা","ગુજરાતી","ಕನ್ನಡ","മലയാളം","ଓଡ଼ିଆ","ਪੰਜਾਬੀ","සිංහල","தமிழ்","తెలుగు"];

  t.deepEqual(transform(actual), expected);
});

test("Extract Tibetan hashtags", t => {
  const actual = parse("#བོད་སྐད་ #བོད་སྐད");
  const expected = ["བོད་སྐད་","བོད་སྐད"];

  t.deepEqual(transform(actual), expected);
});

test("Extract Khmer, Burmese, Laotian hashtags", t => {
  const actual = parse("#មហាត្មះគន្ធី #မြင့်မြတ်သော #ຊີວະສາດ");
  const expected = ["មហាត្មះគន្ធី","မြင့်မြတ်သော","ຊີວະສາດ"];

  t.deepEqual(transform(actual), expected);
});

test("Extract Greek hashtag", t => {
  const actual = parse("#Μαχάτμα_Γκάντι ήταν Ινδός πολιτικός");
  const expected = ["Μαχάτμα_Γκάντι"];

  t.deepEqual(transform(actual), expected);
});

test("Extract Armenian and Georgian hashtags", t => {
  const actual = parse("#Մահաթմա #მაჰათმა");
  const expected = ["Մահաթմա","მაჰათმა"];

  t.deepEqual(transform(actual), expected);
});

test("Extract hashtag with middle dot", t => {
  const actual = parse("#il·lusió");
  const expected = ["il·lusió"];

  t.deepEqual(transform(actual), expected);
});

test("DO NOT extract hashtags without a letter", t => {
  const actual = parse("#_ #1_2 #122 #〃");
  const expected = [];

  t.deepEqual(transform(actual), expected);
});
