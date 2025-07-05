export default class ChatterWs {
  #wss
  #client
  constructor(gwc) {
    this.#client = gwc
    this.#client.on('message', this.#handleMessage)
  }

  #handleMessage = (id, msg) => {
    if (this.#wss) {
      this.#wss.clients.forEach((ws) => {
        if (ws.uuid == id) {
          ws.send([JSON.stringify(msg)])
        }
      })
    }
  }

  setWss = (wss) => {
    this.#wss = wss
  }
  wsApi = (ws, req) => {
    ws.uuid = req.params.uuid
    const messages = this.#client.getMessages(ws.uuid)
    if (messages) {
      ws.send(JSON.stringify(messages))
    }
  }
}
