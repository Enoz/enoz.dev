import { registerCommands } from './discord.js'
import { verifyKeyMiddleware } from 'discord-interactions'
import { handleInteraction } from './interactions.js'
import { rateLimit } from 'express-rate-limit'
import cors from 'cors'
import express from 'express'
import { handleNew } from './chat.js'

const app = express()

app.use(cors())

const newRateLimit = rateLimit({
  windowMs: 1000 * 60, // 1 Minute
  limit: 1,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
})

app.post(
  '/interactions',
  verifyKeyMiddleware(process.env.DISCORD_APP_PUBLICKEY),
  handleInteraction
)

app.post('/new', newRateLimit, handleNew)

registerCommands()

const PORT = process.env.PORT || 3000
app.listen(process.env.PORT || 3000, () => {
  console.log('Listening on port', PORT)
})
