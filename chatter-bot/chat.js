import GatewayClient from './gateway.js'

const client = new GatewayClient()

export async function handleNew(req, res) {
  try {
    const callerIP = req.ip
    const channel = await client.newChat([
      { title: 'Client IP', description: callerIP },
    ])
    return res.status(200).json({ id: channel.name })
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
    const uuid = req.params.uuid
    await client.sendMessage(uuid, req.body.message)
    return res.status(200).send()
  } catch (error) {
    console.error(error)
    return res.status(500).send()
  }
}

export async function handleGet(req, res) {
  try {
    const uuid = req.params.uuid
    const messages = client.getMessages(uuid)
    if (messages === undefined) {
      return res.status(404).send()
    }
    return res.status(200).json(messages)
  } catch (error) {
    console.error(error)
    return res.status(500).send()
  }
}
