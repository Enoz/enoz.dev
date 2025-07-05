import { rateLimit } from 'express-rate-limit'
import cors from 'cors'
import express from 'express'
import GatewayClient from './src/gateway.js'
import ChatterRest from './src/rest.js'
import expressWsImp from 'express-ws'
import ChatterWs from './src/ws.js'

let app = express()
app.set('trust proxy', true)
app.use(cors())
app.use(express.json())
const expressWs = expressWsImp(app)
app = expressWs.app

const client = new GatewayClient()
const chatter = new ChatterRest(client)
const ws = new ChatterWs(client)

const rlKey = (req) => {
  const override = req.headers?.['x-override-ip']
  if (override !== undefined && override.length > 0) {
    return override
  }
  return req.ip
}

const newRateLimit = rateLimit({
  windowMs: 1000 * 5, // 5 sec
  limit: 1,
  keyGenerator: rlKey,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
})

const sendRateLimit = rateLimit({
  windowMs: 1000 * 5, // 5 seconds
  limit: 10,
  keyGenerator: rlKey,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
})
//
const getRateLimit = rateLimit({
  windowMs: 1000 * 1, // 20 Gets every 5 sec
  limit: 5,
  keyGenerator: rlKey,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
})

app.post('/new', newRateLimit, chatter.handleNew)
app.post('/messages/:uuid', sendRateLimit, chatter.handleSend)
app.get('/messages/:uuid', getRateLimit, chatter.handleGet)

app.ws('/ws/:uuid', ws.wsApi)
ws.setWss(expressWs.getWss('/ws/:uuid'))

const PORT = process.env.PORT || 3000
app.listen(process.env.PORT || 3000, () => {
  console.log('Listening on port', PORT)
})
