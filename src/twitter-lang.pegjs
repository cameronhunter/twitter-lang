{
  const indices = ({ start, end }) => [start.offset, end.offset];
}

start
  = parts:(Entity / Text)*
    {
      return {
        text: text(),
        entities: parts.reduce((state, part) => ({
          ...state,
          hashtags: [
            ...(state.hashtags || []),
            ...(part.hashtag ? [part.hashtag] : [])
          ],
          symbols: [
            ...(state.symbols || []),
            ...(part.symbol ? [part.symbol] : [])
          ],
          urls: [
            ...(state.urls || []),
            ...(part.url ? [part.url] : [])
          ],
          user_mentions: [
            ...(state.user_mentions || []),
            ...(part.mention ? [part.mention] : [])
          ]
        }), {})
      };
    }

/******************************************************************************/

Entity
  = symbol:Cashtag
    { return { symbol }; }
  / hashtag:Hashtag
    { return { hashtag }; }
  / mention:(List / User)
    { return { mention }; }

/******************************************************************************/

Cashtag
  = CashtagPrefix text:CashtagText
    { return { text, indices: indices(location()) }; }

CashtagPrefix
  = "$"

CashtagText
  = AlphaNumeric

/******************************************************************************/

Hashtag
  = HashtagPrefix text:HashtagText
    { return { text, indices: indices(location()) }; }

HashtagPrefix
  = "#" / "＃"

HashtagText
  = AlphaNumeric

/******************************************************************************/

User
  = UserPrefix screen_name:UserName
    { return { screen_name, indices: indices(location()) }; }

UserPrefix
  = "@" / "＠"

UserName
  = AlphaNumeric

/******************************************************************************/

List
  = user:User list_slug:ListSlug
    { return { screen_name: user.screen_name, list_slug, indices: indices(location()) }; }

ListSlug
  = $("/" AlphaNumeric)

/*******************************************************************************
 * Common
 ******************************************************************************/

AlphaNumeric
  = $(([a-z0-9_-]i)+)

Space
  = "\u0020"        // White_Space # Zs       SPACE
  / "\u0085"        // White_Space # Cc       <control-0085>
  / "\u00A0"        // White_Space # Zs       NO-BREAK SPACE
  / "\u1680"        // White_Space # Zs       OGHAM SPACE MARK
  / "\u180E"        // White_Space # Zs       MONGOLIAN VOWEL SEPARATOR
  / "\u2028"        // White_Space # Zl       LINE SEPARATOR
  / "\u2029"        // White_Space # Zp       PARAGRAPH SEPARATOR
  / "\u202F"        // White_Space # Zs       NARROW NO-BREAK SPACE
  / "\u205F"        // White_Space # Zs       MEDIUM MATHEMATICAL SPACE
  / "\u3000"        // White_Space # Zs       IDEOGRAPHIC SPACE
  / [\u0009-\u000D] // White_Space # Cc   [5] <control-0009>..<control-000D>
  / [\u2000-\u200A] // White_Space # Zs  [11] EN QUAD..HAIR SPACE

Punctuation
 = "!" / ","

Text
  = (AlphaNumeric / Punctuation / Space)+
