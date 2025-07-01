import { rateLimit } from 'express-rate-limit'
import cors from 'cors'
import express from 'express'
import { handleNew, handleSend, handleGet } from './chat.js'

const app = express()
app.set('trust proxy', true)

app.use(cors())
app.use(express.json())

const rlKey = (req, res) => {
  const override = req.headers['x-override-ip']
  if (override !== undefined) {
    return override
  }
  return req.ip
}

const newRateLimit = rateLimit({
  windowMs: 1000 * 5, // 3 sec
  limit: 1,
  keyGenerator: rlKey,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
})

const sendRateLimit = rateLimit({
  windowMs: 1000 * 5, // 5 seconds
  limit: 5,
  keyGenerator: rlKey,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
})
//
const getRateLimit = rateLimit({
  windowMs: 1000 * 5, // 5 Gets every 5 sec
  limit: 5,
  keyGenerator: rlKey,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
})

app.post('/new', newRateLimit, handleNew)
app.post('/messages/:uuid', sendRateLimit, handleSend)
app.get('/messages/:uuid', getRateLimit, handleGet)

const PORT = process.env.PORT || 3000
app.listen(process.env.PORT || 3000, () => {
  console.log('Listening on port', PORT)
})
