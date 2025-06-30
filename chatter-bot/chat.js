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
    // console.log("headers", JSON.stringify(req.headers))
    const callerIP =
      req.headers?.['x-forwarded-for'] || req.socket.remoteAddress
    // console.log(chatCategory)
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
