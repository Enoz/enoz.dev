import GatewayClient from './gateway.js'

const client = new GatewayClient()

export async function handleNew(req, res) {
  try {
    const callerIP =
      req.headers?.['x-forwarded-for'] || req.socket.remoteAddress
    const channel = await client.newChat([
      { title: 'Client IP', description: callerIP },
    ])
    return res.status(200).json({ id: channel.id })
  } catch (err) {
    console.error(err)
    return res.status(500).send()
  }
}

export async function handleSend(req, res) {
  try {
    if (!req.body?.message) {
      return res.status(400).json({ error: 'message required' })
    }
    const chid = req.params.chid
    await client.sendMessage(chid, req.body.message)
    return res.status(200).send()
  } catch (error) {
    console.error(error)
    return res.status(500).send()
  }
}

export async function handleGet(req, res) {
  try {
    const chid = req.params.chid
    const messages = client.getMessages(chid)
    return res.status(200).json(messages)
  } catch (error) {
    console.error(error)
    return res.status(500).send()
  }
}
