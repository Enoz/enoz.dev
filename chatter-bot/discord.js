export const GUILD_TEXT = 0
export const GUILD_CATEGORY = 4

export const API_BASE = 'https://discord.com/api/v10'
export const MY_SERVER_ID = '1388918758801936397'
export function getDiscordHeaders() {
  return {
    Authorization: `Bot ${process.env.DISCORD_APP_TOKEN}`,
    'User-Agent': `DiscordBot (chatter-bot, 1)`,
    'Content-Type': 'application/json',
  }
}

let limitLifted = 0
async function checkErrors(func, res, healthyStatus) {
  if (res.status != healthyStatus) {
    const js = await res.json()
    if (js.retry_after !== undefined) {
      limitLifted = Date.now() + js.retry_after * 1000
    }
    throw new Error(`${func} error (${res.status}): ${JSON.stringify(js)}`)
  }
}

export async function discordRateLimitMiddleware(_, res, next) {
  if (Date.now() < limitLifted) {
    return res
      .status(429)
      .json({ error: 'Awaiting internal discord rate limit' })
  }
  next()
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
    {
      name: 'endchat',
      type: 1,
      description: 'Ends the chat',
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
export async function useCategory(name) {
  const foundItem = await getChannel(name, null, GUILD_CATEGORY)
  if (foundItem) {
    return foundItem
  }
  return createChannel(name, undefined, GUILD_CATEGORY)
}

/**
 * Gets the channel object
 *
 * @returns Channel object if exists, null if it doesn't
 */
export async function getChannel(name, parent, type) {
  const channels = await fetch(`${API_BASE}/guilds/${MY_SERVER_ID}/channels`, {
    method: 'GET',
    headers: getDiscordHeaders(),
  })
  await checkErrors('getChannel', channels, 200)
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
export async function createChannel(name, parent, type) {
  const res = await fetch(`${API_BASE}/guilds/${MY_SERVER_ID}/channels`, {
    method: 'POST',
    headers: getDiscordHeaders(),
    body: JSON.stringify({
      name: name,
      type: type,
      parent_id: parent,
    }),
  })
  await checkErrors('createChannel', res, 201)
  return res.json()
}

/** Deletes a channel */
export async function deleteChannel(channelId) {
  const res = await fetch(`${API_BASE}/channels/${channelId}`, {
    method: 'DELETE',
    headers: getDiscordHeaders(),
  })
  checkErrors('deleteChannel', res, 200)
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
  await checkErrors('sendMessage', res, 200)
  return res.json()
}

/** Get channel messages */
export async function getMessages(channelId, since) {
  let url = `${API_BASE}/channels/${channelId}/messages`
  if (since !== undefined) {
    url += `?after=${since}`
  }
  const res = await fetch(url, {
    method: 'GET',
    headers: getDiscordHeaders(),
  })
  await checkErrors('getMessages', res, 200)
  return res.json()
}

export async function getGatewayURL() {
  const res = await fetch(`${API_BASE}/gateway`, {
    headers: getDiscordHeaders(),
  })
  await checkErrors('getGatewayURL', res, 200)
  return res.json()
}

export async function createGateway() {
  const gateway = await getGatewayURL()
  const socket = new WebSocket(gateway.url)

  let hbInterval = null
  let lastSequence = null

  const sendHeartbeat = () => {
    const data = {
      op: 1,
      d: lastSequence,
    }
    socket.send(JSON.stringify(data))
  }
  socket.addEventListener('open', (event) => {
    console.log('[Gateway] Connection Established')
  })

  socket.addEventListener('message', (event) => {
    console.log('[Gateway] Server Message: ', event.data)
    const data = JSON.parse(event.data)
    if (data.op === 10) {
      hbInterval = setInterval(sendHeartbeat, data.d.heartbeat_interval)
    }
    if (data.op === 1) {
      sendHeartbeat()
    }
  })

  socket.addEventListener('close', (event) => {
    console.log('[Gateway] Closed: ', event.code, event.reason)
    clearInterval(hbInterval)
  })

  socket.addEventListener('error', (error) => {
    console.error('[Gateway] Error: ', error)
  })
}
