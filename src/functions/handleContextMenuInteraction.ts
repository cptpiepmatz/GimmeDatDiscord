import {ContextMenuInteraction} from "discord.js";

import createPayload from "./createPayload.js";
import replyOrFollowUp from "./replyOrFollowUp.js";
import extractStickerData from "./extractStickerData.js";
import extractEmojiData from "./extractEmojiData.js";

/**
 * Function to handle context menu interactions.
 * @param interaction - A context menu interaction
 */
async function handleContextMenuInteraction(interaction: ContextMenuInteraction) {
  switch (interaction.targetType) {
    case "USER": return handleUserType(interaction);
    case "MESSAGE": return handleMessageType(interaction);
  }
}

/**
 * Handle the interaction if the target type is "USER".
 * @param interaction - A context menu interaction
 */
async function handleUserType(interaction: ContextMenuInteraction) {
  let user = await globalThis.client.users.fetch(interaction.targetId);
  let userAvatar = user.displayAvatarURL({dynamic: true});

  const size = "?size=4096";
  function prepareButtons(avatarUrl: string) {
    let buttons: Record<string, string> = {};
    if (avatarUrl.endsWith(".webp")) {
      buttons["webp"] = avatarUrl + size;
      buttons["png"] = avatarUrl.replace(".webp", ".png") + size;
    }
    if (avatarUrl.endsWith(".png")) {
      buttons["png"] = avatarUrl + size;
    }
    if (avatarUrl.endsWith(".gif")) {
      buttons["gif"] = avatarUrl + size;
      buttons["png"] = avatarUrl.replace(".gif", ".png") + size;
    }
    return buttons;
  }

  await replyOrFollowUp(interaction, createPayload(
    user.username,
    userAvatar + size,
    prepareButtons(userAvatar)
  ));

  if (interaction.guild) {
    let guild = await globalThis.client.guilds.fetch(interaction.guildId);
    let member = await guild.members.fetch(interaction.targetId);
    let memberAvatar = member.displayAvatarURL({dynamic: true});
    if (memberAvatar !== userAvatar) {
      await replyOrFollowUp(interaction, createPayload(
        member.displayName,
        memberAvatar + size,
        prepareButtons(memberAvatar)
      ));
    }
  }
}

/**
 * Handle the interaction if the target type is "MESSAGE".
 * @param interaction - A context menu interaction
 */
async function handleMessageType(interaction: ContextMenuInteraction) {
  let channel = await interaction.channel.fetch();
  let message = await channel.messages.fetch(interaction.targetId);

  for (let [key, value] of Object.entries(await extractStickerData(message))) {
    let buttons: Record<string, string> = {};
    if (value.endsWith(".png")) buttons["png"] = value;
    if (value.endsWith(".json")) buttons["lottie"] = value;
    await replyOrFollowUp(interaction, createPayload(
      key,
      value,
      buttons
    ));
  }

  for (let [key, value] of Object.entries(extractEmojiData(message))) {
    let buttons: Record<string, string> = {};
    if (value.endsWith(".png")) buttons["png"] = value;
    if (value.endsWith(".gif")) buttons["gif"] = value;
    await replyOrFollowUp(interaction, createPayload(
      key,
      value,
      buttons
    ));
  }

  if (!interaction.replied) {
    await interaction.reply({
      ephemeral: true,
      content: "Found nothing to give ya. :/"
    });
  }
}

export default handleContextMenuInteraction;
