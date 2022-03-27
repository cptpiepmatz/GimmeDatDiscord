import {CommandInteraction} from "discord.js";

import prepareAvatars from "./prepareAvatars.js";
import replyOrFollowUp from "./replyOrFollowUp.js";
import createPayload from "./createPayload.js";

/**
 * Subroutine to handle incoming command interactions.
 * @param interaction slash command interaction
 */
export default async function handleCommandInteraction(
  interaction: CommandInteraction
) {
  let user = interaction.options.getUser("user");
  let userId = interaction.options.getString("user_id");
  let guildId = interaction.options.getString("guild_id") ||
    interaction.options.getString("server_id");

  if (userId) {
    await interaction.deferReply({ephemeral: true});
    try {
      user = await globalThis.client.users.fetch(userId);
    }
    catch (e) {
      await replyOrFollowUp(
        interaction,
        {
          content: `Could not fetch the user with the ID \`${userId}\`.`,
          ephemeral: true
        }
      );
    }
  }
  if (user) {
    let avatars = prepareAvatars(user.displayAvatarURL({dynamic: true}));
    await replyOrFollowUp(
      interaction,
      createPayload(user.username, avatars.gif || avatars.png, avatars)
    );
  }
  if (guildId) {
    await interaction.deferReply({ephemeral: true});
    try {
      let guild = await globalThis.client.fetchGuildPreview(guildId);
      let icon = guild.iconURL({dynamic: true});
      if (icon) {
        let avatars = prepareAvatars(icon);
        await replyOrFollowUp(
          interaction,
          createPayload(guild.name, avatars.gif || avatars.png, avatars)
        );
      }
      else {
        await replyOrFollowUp(
          interaction,
          {
            content: `\`${guild.name}\` has no icon.`,
            ephemeral: true
          }
        );
      }
    }
    catch (e) {
      await replyOrFollowUp(
        interaction,
        {
          content: `\`${guildId}\` is either no valid ID or the server is not discoverable.`,
          ephemeral: true
        }
      )
    }
  }

  if (!(interaction.replied || interaction.deferred)) {
    await interaction.reply({
      content: "Pass an option to fetch some data.",
      ephemeral: true
    });
  }
}
