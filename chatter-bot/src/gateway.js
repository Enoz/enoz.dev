import crypto from 'crypto'
import {
  ChannelType,
  Client,
  EmbedBuilder,
  Events,
  GatewayIntentBits,
} from 'discord.js'
import { MessageCache } from './messagecache.js'

export const MY_GUILD = process.env.DISCORD_GUILD_ID
const ACTIVE_CHANNEL = 'active-chats'
class GatewayClient {
  #messages
  #hooks
  constructor() {
    this.#hooks = {
      message: [],
    }
    this.#messages = new MessageCache()
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    })
    this.client.once(Events.ClientReady, (readyClient) => {
      console.log(`Ready! Logged in as ${readyClient.user.tag}`)
      this.#syncMessages()
    })
    this.client.on('messageCreate', (msg) => {
      const { message, id } = this.#messages.onMessage(msg)
      if (message.content !== '') {
        this.#hooks.message.forEach((fn) => {
          fn(id, message)
        })
      }
    })
    this.client.login(process.env.DISCORD_APP_TOKEN)
  }

  on = (hook, fn) => {
    this.#hooks[hook].push(fn)
  }

  #syncMessages = async () => {
    this.#messages.reset()

    const { activeCategory, channels } = await this.#getChannels()

    const chatChannels = channels.filter(
      (ch) => ch.parentId == activeCategory.id
    )
    for (const ch of chatChannels) {
      const messages = await ch[1].messages.fetch()
      messages.reverse().forEach(this.#messages.onMessage)
    }
  }

  #getChannels = async () => {
    const guild = await this.client.guilds.fetch(MY_GUILD)
    if (!guild) {
      throw new Error('Guild unavailable')
    }
    const channels = await guild.channels.fetch()
    let activeCategory = channels.find(
      (ch) => ch.type == ChannelType.GuildCategory && ch.name == ACTIVE_CHANNEL
    )

    if (!activeCategory) {
      activeCategory = await guild.channels.create({
        name: ACTIVE_CHANNEL,
        type: ChannelType.GuildCategory,
      })
    }

    return { activeCategory, channels }
  }

  getMessages = (uuid) => {
    return this.#messages.getMessages(uuid)
  }

  newChat = async (embeds) => {
    const { activeCategory } = await this.#getChannels()

    // Create a new child channel
    const uuid = crypto.randomUUID()
    const channel = await activeCategory.guild.channels.create({
      name: uuid,
      type: ChannelType.GuildText,
      parent: activeCategory,
    })

    if (embeds !== undefined) {
      const embObj = embeds.map((emb) => {
        return new EmbedBuilder()
          .setTitle(emb.title)
          .setDescription(emb.description)
      })
      await channel.send({ embeds: embObj })
    }
    return channel
  }

  sendMessage = async (uuid, message) => {
    const { activeCategory, channels } = await this.#getChannels()
    const channel = channels.find(
      (ch) =>
        ch.name == uuid &&
        ch.type == ChannelType.GuildText &&
        ch.parentId == activeCategory.id
    )
    if (!channel) {
      throw new Error('Chat doesnt exist')
    }
    channel.send(message)
  }
}

export default GatewayClient
