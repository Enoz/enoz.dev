import https from "https";
import {
  verifyKeyMiddleware,
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
} from "discord-interactions";
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.post(
  "/interactions",
  verifyKeyMiddleware(process.env.DISCORD_APP_PUBLICKEY),
  async function (req, res) {
    // Interaction id, type and data
    const { id, type, data } = req.body;

    /**
     * Handle verification requests
     */
    if (type === InteractionType.PING) {
      return res.send({ type: InteractionResponseType.PONG });
    }

    /**
     * Handle slash command requests
     * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
     */
    if (type === InteractionType.APPLICATION_COMMAND) {
      const { name } = data;

      // "test" command
      if (name === "test") {
        // Send a message into the channel where command was triggered from
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            flags: InteractionResponseFlags.IS_COMPONENTS_V2,
            components: [
              {
                type: MessageComponentTypes.TEXT_DISPLAY,
                // Fetches a random emoji to send from a helper function
                content: `hello world ${id}`,
              },
            ],
          },
        });
      }

      console.error(`unknown command: ${name}`);
      return res.status(400).json({ error: "unknown command" });
    }

    console.error("unknown interaction type", type);
    return res.status(400).json({ error: "unknown interaction type" });
  },
);

app.get("/test123", (_, res) => {
  return res.status(200).json({ nice: "123" });
});

// Register Commands

const guildUrl = `https://discord.com/api/v10/applications/${process.env.DISCORD_APP_ID}/commands`;
const commands = [
  {
    name: "test",
    type: 1,
    description: "Debug test command",
  },
];

for (const cmd of commands) {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bot ${process.env.DISCORD_APP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cmd),
  };
  await fetch(guildUrl, options);
}

// Listen

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
