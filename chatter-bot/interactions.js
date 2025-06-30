import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
} from 'discord-interactions'
import { deleteChannel } from './discord.js'
export async function handleInteraction(req, res) {
  // Interaction id, type and data
  const { id, type, data, channel } = req.body

  /** Handle verification requests */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG })
  }

  /**
   * Handle slash command requests See
   * https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data

    // "test" command
    if (name === 'test') {
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
      })
    }

    // "endchat" command
    if (name === 'endchat') {
      await deleteChannel(channel.id)
      return res.status(200)
    }

    console.error(`unknown command: ${name}`)
    return res.status(400).json({ error: 'unknown command' })
  }

  console.error('unknown interaction type', type)
  return res.status(400).json({ error: 'unknown interaction type' })
}
