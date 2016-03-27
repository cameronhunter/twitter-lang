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

Cashtag
  = "$" text:AlphaNumeric
    { return { text, indices: indices(location()) }; }

Hashtag
  = ("#" / "＃") text:AlphaNumeric
    { return { text, indices: indices(location()) }; }

User
  = ("@" / "＠") screen_name:AlphaNumeric
    { return { screen_name, indices: indices(location()) }; }

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

Text
  = .
