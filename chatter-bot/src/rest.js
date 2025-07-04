export default class ChatterRest {
  constructor(gwc) {
    this.client = gwc
  }
  handleNew = async (req, res) => {
    try {
      const callerIP = req.ip
      const embeds = [{ title: 'Client IP', description: callerIP }]
      const overrideIp = req.headers?.['x-override-ip']
      if (overrideIp !== undefined && overrideIp.length > 0) {
        embeds.push({ title: 'Override IP', description: overrideIp })
      }

      const channel = await this.client.newChat(embeds)
      return res.status(200).json({ id: channel.name })
    } catch (err) {
      console.error(err)
      return res.status(500).send()
    }
  }

  handleSend = async (req, res) => {
    try {
      if (!req.body?.message) {
        return res.status(400).json({ error: 'message required' })
      }
      const uuid = req.params.uuid
      await this.client.sendMessage(uuid, req.body.message)
      return res.status(200).send()
    } catch (error) {
      console.error(error)
      return res.status(500).send()
    }
  }

  handleGet = async (req, res) => {
    try {
      const uuid = req.params.uuid
      let messages = this.client.getMessages(uuid)
      if (messages === undefined) {
        return res.status(404).send()
      }
      const after = req.query.after
      if (after !== undefined && after > 0) {
        messages = messages.slice(after, messages.length)
      }
      return res.status(200).json(messages)
    } catch (error) {
      console.error(error)
      return res.status(500).send()
    }
  }
}
