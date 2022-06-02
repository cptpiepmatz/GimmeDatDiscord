import {ContextMenuInteraction} from "discord.js";

import createPayload from "./createPayload.js";
import replyOrFollowUp from "./replyOrFollowUp.js";
import extractStickerData from "./extractStickerData.js";
import extractEmojiData from "./extractEmojiData.js";
import prepareAvatars, {avatarSize} from "./prepareAvatars.js";

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
  let isDm = interaction.channel.type === "DM";

  await interaction.deferReply({ephemeral: !isDm});
  let user = await globalThis.client.users.fetch(interaction.targetId, true);
  let userAvatar = user.displayAvatarURL({dynamic: true});

  await replyOrFollowUp(interaction, createPayload(
    user.username,
    userAvatar + avatarSize,
    prepareAvatars(userAvatar)
  ));

  if (interaction.guild) {
    let guild = await globalThis.client.guilds.fetch(interaction.guildId);
    let member = await guild.members.fetch(interaction.targetId);
    let memberAvatar = member.displayAvatarURL({dynamic: true});
    if (memberAvatar !== userAvatar) {
      await replyOrFollowUp(interaction, createPayload(
        member.displayName,
        memberAvatar + avatarSize,
        prepareAvatars(memberAvatar)
      ));
    }
  }
}

/**
 * Handle the interaction if the target type is "MESSAGE".
 * @param interaction - A context menu interaction
 */
async function handleMessageType(interaction: ContextMenuInteraction) {
  let isDm = interaction.channel.type === "DM";

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
      ephemeral: !isDm,
      content: "Found nothing to give ya. :/"
    });
  }
}

export default handleContextMenuInteraction;
