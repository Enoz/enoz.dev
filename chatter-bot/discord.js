export const GUILD_TEXT = 0
export const GUILD_CATEGORY = 4

export const API_BASE = 'https://discord.com/api/v10'
export const MY_SERVER_ID = '1388918758801936397'
export function getDiscordHeaders() {
  return {
    Authorization: `Bot ${process.env.DISCORD_APP_TOKEN}`,
    "User-Agent": `DiscordBot (chatter-bot, 1)`,
    'Content-Type': 'application/json',
  }
}

/** Registers Slash (/) commands with Discord API */
export async function registerCommands() {
  const commandRegister = `${API_BASE}/applications/${process.env.DISCORD_APP_ID}/commands`
  const commands = [
    {
      name: 'test',
      type: 1,
      description: 'Debug test command',
    },
  ]

  for (const cmd of commands) {
    const options = {
      method: 'POST',
      headers: getDiscordHeaders(),
      body: JSON.stringify(cmd),
    }
    await fetch(commandRegister, options)
  }
}

/**
 * Gets the discord Category object with a given name If the category doesn't
 * exist, it will be created
 */
export async function getCategory(name) {
  const foundItem = await getChannel(name, null, GUILD_CATEGORY)
  if (foundItem) {
    return foundItem
  }
  return createChannel(name, null, GUILD_CATEGORY)
}

export async function getChannels() {
  return fetch(`${API_BASE}/guilds/${MY_SERVER_ID}/channels`, {
    headers: getDiscordHeaders(),
  })
}

/**
 * Gets the channel object
 *
 * @returns Channel object if exists, null if it doesn't
 */
export async function getChannel(name, parent, type) {
  const channels = await fetch(`${API_BASE}/guilds/${MY_SERVER_ID}/channels`, {
    headers: getDiscordHeaders(),
  })
  const channelsJson = await channels.json()
  return channelsJson.find((channel) => {
    return (
      channel.parent_id == parent &&
      channel.name === name &&
      channel.type === type
    )
  })
}

/**
 * Creates a channel. If parent is supplied, the channel will be created under
 * the parent channel
 */
export async function createChannel(name, type, parent) {
  const res = await fetch(`${API_BASE}/guilds/${MY_SERVER_ID}/channels`, {
    method: 'POST',
    headers: getDiscordHeaders(),
    body: JSON.stringify({
      name: name,
      type: type,
      parent_id: parent,
    }),
  })
  return res.json()
}

/** Send a message to a channel */
export async function sendMessage(channel, message, embeds) {
  const res = await fetch(`${API_BASE}/channels/${channel}/messages`, {
    method: 'POST',
    headers: getDiscordHeaders(),
    body: JSON.stringify({
      content: message,
      tts: false,
      embeds: embeds,
    }),
  })
  return res.json()
}
