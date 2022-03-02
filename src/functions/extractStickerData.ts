import {Message} from "discord.js";

/**
 * Extract the sticker data from a message.
 * @param message - The message to extract the stickers from
 */
async function extractStickerData(message: Message) {
  let stickers: Record<string, string> = {};

  for (let sticker of message.stickers.values()) {
    await sticker.fetch();
    stickers[sticker.name] = sticker.url;
  }

  return stickers;
}

export default extractStickerData;
