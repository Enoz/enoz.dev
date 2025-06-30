import {
  registerCommands,
  createChannel,
  getCategory,
  getChannels,
} from './discord.js'
import { verifyKeyMiddleware } from 'discord-interactions'
import { handleInteraction } from './interactions.js'
import express from 'express'

const app = express()
const PORT = process.env.PORT || 3000

app.post(
  '/interactions',
  verifyKeyMiddleware(process.env.DISCORD_APP_PUBLICKEY),
  handleInteraction
)

app.get('/test123', async (_, res) => {
  const cg = await getCategory('test')
  console.log(cg)
  return res.status(200).json({ nice: '123' })
})

registerCommands()
app.listen(PORT, () => {
  console.log('Listening on port', PORT)
})
