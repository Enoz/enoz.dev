import crypto from 'crypto'
import {
  ChannelType,
  Client,
  EmbedBuilder,
  Events,
  GatewayIntentBits,
} from 'discord.js'

export const MY_GUILD = process.env.DISCORD_GUILD_ID
const ACTIVE_CHANNEL = 'active-chats'
class GatewayClient {
  constructor() {
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
      this.#logMessage(msg)
    })
    this.client.login(process.env.DISCORD_APP_TOKEN)
  }

  #messageLog = {}
  #logMessage = (message) => {
    if (message.mentions.everyone) {
      return
    }
    if (message.content === '') {
      return
    }
    let oldLog = this.#messageLog[message.channel.name]
    if (!oldLog) {
      oldLog = []
    }
    oldLog.push({
      content: message.content,
      author: message.author.globalName,
      id: message.id,
    })
    this.#messageLog[message.channel.name] = oldLog
  }

  #syncMessages = async () => {
    this.#messageLog = {}

    const guild = await this.client.guilds.fetch(MY_GUILD)
    if (!guild) {
      throw new Error('Guild unavailable')
    }
    const channels = await guild.channels.fetch()
    const activeChat = channels.find(
      (ch) => ch.type == ChannelType.GuildCategory && ch.name == ACTIVE_CHANNEL
    )
    if (!activeChat) {
      return
    }

    const chatChannels = channels.filter((ch) => ch.parentId == activeChat.id)
    for (const ch of chatChannels) {
      this.#messageLog[ch[1].name] = []
      const messages = await ch[1].messages.fetch()
      messages.reverse().forEach(this.#logMessage)
    }
  }

  getMessages = (uuid) => {
    return this.#messageLog[uuid]
  }

  newChat = async (embeds) => {
    const guild = await this.client.guilds.fetch(MY_GUILD)
    if (!guild) {
      throw new Error('Guild unavailable')
    }

    // Check if channel already exists
    const channels = await guild.channels.fetch()
    let category = channels.find(
      (ch) => ch.name == ACTIVE_CHANNEL && ch.type == ChannelType.GuildCategory
    )
    if (!category) {
      category = await guild.channels.create({
        name: ACTIVE_CHANNEL,
        type: ChannelType.GuildCategory,
      })
    }

    // Create a new child channel
    const uuid = crypto.randomUUID()
    const channel = await guild.channels.create({
      name: uuid,
      type: ChannelType.GuildText,
      parent: category,
    })

    if (embeds !== undefined) {
      const embObj = embeds.map((emb) => {
        return new EmbedBuilder()
          .setTitle(emb.title)
          .setDescription(emb.description)
      })
      channel.send({ embeds: embObj })
    }
    this.#messageLog[uuid] = []
    return channel
  }

  sendMessage = async (uuid, message) => {
    const guild = await this.client.guilds.fetch(MY_GUILD)
    if (!guild) {
      throw new Error('Guild unavailable')
    }

    // Check if channel already exists
    const channels = await guild.channels.fetch()
    const activeChat = channels.find(
      (ch) => ch.type == ChannelType.GuildCategory && ch.name == ACTIVE_CHANNEL
    )
    if (!activeChat) {
      throw new Error('Active Chat not present')
    }
    const channel = channels.find(
      (ch) =>
        ch.name == uuid &&
        ch.type == ChannelType.GuildText &&
        ch.parentId == activeChat.id
    )
    if (!channel) {
      throw new Error('Chat doesnt exist')
    }
    channel.send(message)
  }
}

export default GatewayClient
