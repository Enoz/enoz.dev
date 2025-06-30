import crypto from 'crypto'
import {
  createChannel,
  getCategory,
  GUILD_TEXT,
  sendMessage,
} from './discord.js'

const LIVE_CATEGORY = 'active-chats'

export async function handleNew(req, res) {
  try {
    const uuid = crypto.randomUUID()
    const chatCategory = await getCategory(LIVE_CATEGORY)
    const callerIP =
      res.headers?.['x-forwarded-for'] || req.socket.remoteAddress
    const channel = await createChannel(uuid, GUILD_TEXT, chatCategory.id)
    const msgRes = await sendMessage(channel.id, '@everyone', [
      {
        title: 'Chat Created',
        description: `Guest IP: ${callerIP}`,
      },
    ])
    const js = await msgRes.json()
    return res.status(200).json({ id: uuid })
  } catch (err) {
    console.error(err)
    return res.status(500).json()
  }
}
