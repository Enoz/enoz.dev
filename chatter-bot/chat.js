import crypto from 'crypto'
import {
  createChannel,
  useCategory,
  getChannel,
  GUILD_TEXT,
  sendMessage,
} from './discord.js'

const LIVE_CATEGORY = 'active-chats'

export async function handleNew(req, res) {
  try {
    const uuid = crypto.randomUUID()
    const chatCategory = await useCategory(LIVE_CATEGORY)
    const callerIP =
      req.headers?.['x-forwarded-for'] || req.socket.remoteAddress
    const channel = await createChannel(uuid, chatCategory.id, GUILD_TEXT)
    await sendMessage(channel.id, 'everyone', [
      {
        title: 'IP',
        description: `${callerIP}`,
      },
    ])
    return res.status(200).json({ id: uuid })
  } catch (err) {
    console.error(err)
    return res.status(500).json()
  }
}

export async function handleSend(req, res) {
  console.log(req)
  if (!req.body?.message) {
    return res.status(400).json({ error: 'message required' })
  }
  const uuid = req.params.uuid
  const activeCategory = await useCategory(LIVE_CATEGORY)
  const channel = await getChannel(uuid, activeCategory.id, GUILD_TEXT)
  if (channel == null) {
    return res.status(404).json({ error: 'room does not exist' })
  }
  sendMessage(channel.id, req.body.message, null)
  return res.status(200).json({})
}

export async function handleGet(req, res) {
  const uuid = req.params.uuid
  return res.status(200).json({})
}
