import { registerCommands } from './discord.js'
import { verifyKeyMiddleware } from 'discord-interactions'
import { handleInteraction } from './interactions.js'
import express from 'express'
import { handleNew } from './chat.js'

const app = express()
const PORT = process.env.PORT || 3000

app.post(
  '/interactions',
  verifyKeyMiddleware(process.env.DISCORD_APP_PUBLICKEY),
  handleInteraction
)

app.post('/new', handleNew)

registerCommands()
app.listen(PORT, () => {
  console.log('Listening on port', PORT)
})
