/**
 * @file
 * This file is used to deploy the commands the bot should have.
 */

import {
  ContextMenuCommandBuilder,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandIntegerOption,
  SlashCommandUserOption, SlashCommandStringOption
} from "@discordjs/builders";
import {Client} from "discord.js";
import {createRequire} from "module";

// import token from config.json
const {token} = createRequire(import.meta.url)("../config.json");

const commands = [

  // "Gimme Dat" on user avatars
  new ContextMenuCommandBuilder()
    .setName("Gimme Dat")
    .setType(2), // USER

  // "Gimme Dat" on messages
  new ContextMenuCommandBuilder()
    .setName("Gimme Dat")
    .setType(3), // MESSAGE

  new SlashCommandBuilder()
    .setName("gimme")
    .setDescription("Entry point for the GimmeDat bot.")
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("dat")
        .setDescription("Fetches some data.")
        .addUserOption(
          new SlashCommandUserOption()
            .setName("user")
            .setDescription("User to fetch avatar from.")
        )
        .addStringOption(
          new SlashCommandStringOption()
            .setName("user_id")
            .setDescription("ID of the user to fetch avatar from.")
        )
        .addStringOption(
          new SlashCommandStringOption()
            .setName("guild_id")
            .setDescription("ID of the guild to fetch avatar from.")
        )
        .addStringOption(
          new SlashCommandStringOption()
            .setName("server_id")
            .setDescription("ID of the server to fetch avatar from.")
        )
    )

].map(command => command.toJSON());

// basic client without intents
const client = new Client({intents: []});

client.once("ready", async () => {
  // deploy commands
  await client.application.commands.set(commands);
  console.log("Successfully registered application commands.");

  // close the client when done
  client.destroy();
});

client.login(token).catch(err => console.error(err));
