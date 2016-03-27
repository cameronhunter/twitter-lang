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
            ...(part.cashtag ? [part.cashtag] : [])
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

/*******************************************************************************
 * Entity
 ******************************************************************************/

Entity
  = cashtag:Cashtag
    { return { cashtag }; }
  / hashtag:Hashtag
    { return { hashtag }; }
  / mention:Mention
    { return { mention }; }

/*******************************************************************************
 * Cashtag
 ******************************************************************************/

Cashtag
  = CashtagPrefix text:CashtagText
    { return { text, indices: indices(location()) }; }

CashtagPrefix
  = "$"

CashtagText
  = AlphaNumeric

/*******************************************************************************
 * Hashtag
 ******************************************************************************/

Hashtag
  = HashtagPrefix text:HashtagText
    { return { text, indices: indices(location()) }; }

HashtagPrefix
  = "#"

HashtagText
  = AlphaNumeric

/*******************************************************************************
 * Mention
 ******************************************************************************/

Mention
  = List / User

/*******************************************************************************
 * User
 ******************************************************************************/

User
  = UserPrefix screen_name:UserName
    { return { screen_name, indices: indices(location()) }; }

UserPrefix
  = "@"

UserName
  = AlphaNumeric

/*******************************************************************************
 * List
 ******************************************************************************/

List
  = user:User list_slug:ListText
    { return { screen_name: user.screen_name, list_slug, indices: indices(location()) }; }

ListText
  = $("/" AlphaNumeric)

/*******************************************************************************
 * Common
 ******************************************************************************/

AlphaNumeric
  = $(([a-z0-9_-]i)+)

Space
  = $(" ")

Text
  = (AlphaNumeric / Space)+
