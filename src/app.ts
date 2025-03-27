import {Client, CommandInteraction, ContextMenuInteraction} from "discord.js";
import {createRequire} from "module";

import clientOptions from "./clientOptions.js";
import handleContextMenuInteraction
  from "./functions/handleContextMenuInteraction.js";
import handleDM from "./functions/handleDM.js";
import handleCommandInteraction from "./functions/handleCommandInteraction.js";

const token = process.env.DISCORD_TOKEN;
if (!token) throw new Error("Missing DISCORD_TOKEN env variable");

globalThis.client = new Client(clientOptions);
const client = globalThis.client;

client.once("ready", () => {
  console.log("Client started successfully.");
});

client.on("interactionCreate", async interaction => {
  if (interaction.isContextMenu()) {
    await handleContextMenuInteraction(interaction as ContextMenuInteraction);
  }
  if (interaction.isCommand()) {
    await handleCommandInteraction(interaction as CommandInteraction);
  }
});

client.on("messageCreate", async message => {
  if (message.channel.type !== "DM") return;
  if (message.author.id === client.user.id) return;

  await handleDM(message);
});

client.login(token).catch(err => console.error(err));
