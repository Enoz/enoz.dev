export class MessageCache {
  #messages = {}
  constructor() {}

  onMessage = (message) => {
    let oldLog = this.#messages[message.channel.name] || []
    const msgObj = {
      content: message.content,
      author: message.author.globalName,
      id: message.id,
    }
    if (message.content !== '') {
      oldLog.push(msgObj)
    }
    this.#messages[message.channel.name] = oldLog
    return { message: msgObj, id: message.channel.name }
  }

  getMessages = (channelName) => {
    return this.#messages[channelName]
  }

  reset = () => {
    this.#messages = {}
  }
}
