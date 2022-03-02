import {Message} from "discord.js";

/**
 * Extract the emoji data from a message.
 * @param message - The message to extract the emojis from
 */
function extractEmojiData(message: Message) {
  let emojiRegExp = /<(?<animated>a?):(?<name>[^:]+):(?<id>\d+)>/g;

  let emojis: Record<string, string> = {};

  for (let match of message.content.matchAll(emojiRegExp)) {
    let emojiId = match.groups.id;
    let animated = !!match.groups.animated;
    let name = match.groups.name;

    let url = "https://cdn.discordapp.com/emojis/" + emojiId;
    url += animated ? ".gif" : ".png";

    emojis[name] = url;
  }

  return emojis;
}

export default extractEmojiData;
