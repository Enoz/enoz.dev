import crypto from 'crypto'
import { createChannel, getCategory, GUILD_TEXT } from './discord.js'

const LIVE_CATEGORY = 'active-chats'

export async function handleNew(req, res) {
  try {
    const uuid = crypto.randomUUID()
    const chatCategory = await getCategory(LIVE_CATEGORY)
    await createChannel(uuid, GUILD_TEXT, chatCategory.id)
    return res.status(200).json({ id: uuid })
  } catch (err) {
    console.error(err)
    return res.status(500).json()
  }
}
