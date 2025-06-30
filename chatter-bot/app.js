import { createGateway, discordRateLimitMiddleware, registerCommands } from './discord.js'
import { verifyKeyMiddleware } from 'discord-interactions'
import { handleInteraction } from './interactions.js'
import { rateLimit } from 'express-rate-limit'
import cors from 'cors'
import express from 'express'
import { handleNew, handleSend, handleGet } from './chat.js'

const app = express()

app.use(cors())
app.use(express.json())

const newRateLimit = rateLimit({
  windowMs: 1000 * 60, // 1 Minute
  limit: 1,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
})

const sendRateLimit = rateLimit({
  windowMs: 1000 * 10, // 10 seconds
  limit: 3,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
})

const getRateLimit = rateLimit({
  windowMs: 1000 * 5, // 3 Gets every 5 sec
  limit: 3,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
})

app.post(
  '/interactions',
  verifyKeyMiddleware(process.env.DISCORD_APP_PUBLICKEY),
  handleInteraction
)

app.post('/new', newRateLimit, discordRateLimitMiddleware, handleNew)
app.post('/send/:uuid', sendRateLimit, discordRateLimitMiddleware, handleSend)
app.get('/get/:uuid', getRateLimit, discordRateLimitMiddleware, handleGet)

registerCommands()
createGateway()

const PORT = process.env.PORT || 3000
app.listen(process.env.PORT || 3000, () => {
  console.log('Listening on port', PORT)
})
