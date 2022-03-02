/**
 * @file
 * This file is used to deploy the commands the bot should have.
 */

import {ContextMenuCommandBuilder} from "@discordjs/builders";
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
    .setType(3) // MESSAGE

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
