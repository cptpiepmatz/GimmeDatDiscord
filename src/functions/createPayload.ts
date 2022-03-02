import {Embed} from "@discordjs/builders";
import {
  MessageAttachment,
  MessageButton,
  MessageOptions,
  InteractionReplyOptions,
  MessageActionRow
} from "discord.js";

/**
 * Creates a payload for the image to beautifully displayed.
 * @param displayName - The name to be displayed in the embed
 * @param imageUrl - The url of the main image (may also be the .json link for stickers)
 * @param buttons - The names and urls for the buttons below
 * @param forInteraction - If the payload is for an interaction (default: false)
 */
function createPayload(
  displayName: string,
  imageUrl: string,
  buttons: Record<string, string>,
  forInteraction: false
): MessageOptions;
function createPayload(
  displayName: string,
  imageUrl: string,
  buttons: Record<string, string>
): InteractionReplyOptions;
function createPayload(
  displayName: string,
  imageUrl: string,
  buttons: Record<string, string>,
  forInteraction = true
): InteractionReplyOptions | MessageOptions {
  let embeds = [new Embed().setTitle(displayName).setDescription(imageUrl)];
  let componentButtons = [];
  for (let [key, value] of Object.entries(buttons)) {
    componentButtons.push(
      new MessageButton()
        .setLabel(key.toUpperCase())
        .setURL(value)
        .setStyle("LINK")
    );
  }
  let components = [new MessageActionRow().addComponents(...componentButtons)];
  let options = {
    embeds,
    components
  }
  if (forInteraction) Object.assign(options, {ephemeral: true});
  if (!imageUrl.endsWith(".json")) {
    Object.assign(options, {files: [new MessageAttachment(imageUrl)]});
  }
  return options;
}

export default createPayload;
