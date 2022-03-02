import {Intents, ClientOptions} from "discord.js";

/** The options for the client. */
const clientOptions: ClientOptions = {
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.DIRECT_MESSAGES
  ],
  partials: [
    "CHANNEL"
  ]
};
export default clientOptions;
