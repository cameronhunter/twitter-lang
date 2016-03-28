{
  const indices = ({ start, end }) => ({ indices: [start.offset, end.offset] });
  const flatten = (input) => input ? [input] : [];
}

start
  = parts:(Entity / .)*
    {
      return {
        text: text(),
        entities: parts.reduce((state, part) => ({
          ...state,
          hashtags: [
            ...(state.hashtags || []),
            ...flatten(part.hashtag)
          ],
          symbols: [
            ...(state.symbols || []),
            ...flatten(part.symbol)
          ],
          urls: [
            ...(state.urls || []),
            ...flatten(part.url)
          ],
          user_mentions: [
            ...(state.user_mentions || []),
            ...flatten(part.mention)
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

Cashtag
  = cashtag:CashTagToken CashTagToken+
    { return cashtag; }
  / cashtag:CashTagToken &(Space / Punctuation / End)
    { return cashtag; }

CashTagToken
  = "$" symbol:$([a-z]i+) subsymbol:$(("." / "_") [a-z]i+)?
    { return symbol.length <= 6 && { text: symbol + (subsymbol || ''), ...indices(location()) }; }

Hashtag
  = ("#" / "＃") text:AlphaNumeric
    { return { text, ...indices(location()) }; }

User
  = ("@" / "＠") screen_name:AlphaNumeric
    { return { screen_name, ...indices(location()) }; }

List
  = user:User list_slug:ListSlug
    { return { screen_name: user.screen_name, list_slug, ...indices(location()) }; }

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
  = "!" / "'" / "#" / "%" / "&" / "'" / "(" / ")" / "*" / "+" / "," / "\\" / "-"
  / "." / "/" / ":" / ";" / "<" / "=" / ">" / "?" / "@" / "[" / "]" / "^" / "_"
  / "{" / "|" / "}" / "~" / "$"

End
  = !.
