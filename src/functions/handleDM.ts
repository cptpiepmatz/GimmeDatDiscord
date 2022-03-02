import {Message} from "discord.js";

import extractStickerData from "./extractStickerData.js";
import createPayload from "./createPayload.js";
import extractEmojiData from "./extractEmojiData.js";

/**
 * Function to handle direct messages.
 * @param message - A direct message
 */
async function handleDM(message: Message) {

  for (let [key, value] of Object.entries(await extractStickerData(message))) {
    let buttons: Record<string, string> = {};
    if (value.endsWith(".png")) buttons["png"] = value;
    if (value.endsWith(".json")) buttons["lottie"] = value;
    await message.channel.send(createPayload(key, value, buttons, false));
  }

  for (let [key, value] of Object.entries(extractEmojiData(message))) {
    let buttons: Record<string, string> = {};
    if (value.endsWith(".png")) buttons["png"] = value;
    if (value.endsWith(".gif")) buttons["gif"] = value;
    await message.channel.send(createPayload(key, value, buttons, false));
  }

}

export default handleDM;
