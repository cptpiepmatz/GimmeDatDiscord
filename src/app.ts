import {Client, ContextMenuInteraction} from "discord.js";
import {createRequire} from "module";

import clientOptions from "./clientOptions.js";
import handleContextMenuInteraction
  from "./functions/handleContextMenuInteraction.js";
import handleDM from "./functions/handleDM.js";

const {token} = createRequire(import.meta.url)("../config.json");

globalThis.client = new Client(clientOptions);
const client = globalThis.client;

client.once("ready", () => {
  console.log("ready");
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isContextMenu()) return;
  const cmInteraction = interaction as ContextMenuInteraction;

  await handleContextMenuInteraction(interaction);
});

client.on("messageCreate", async message => {
  if (message.channel.type !== "DM") return;
  if (message.author.id === client.user.id) return;

  await handleDM(message);
});

client.login(token).catch(err => console.error(err));
