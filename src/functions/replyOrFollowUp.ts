import {BaseCommandInteraction, Interaction} from "discord.js";

/**
 * Convenience function for reply or doing a followup on interactions.
 * @param interaction - The interaction to reply to
 * @param reply - The reply payload to reply with
 */
async function replyOrFollowUp(
  interaction: BaseCommandInteraction,
  reply: Parameters<BaseCommandInteraction["reply"]>[0]
) {
  if (interaction.replied) return interaction.followUp(reply);
  return interaction.reply(reply);
}

export default replyOrFollowUp;
