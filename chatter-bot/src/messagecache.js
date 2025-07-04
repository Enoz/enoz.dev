export class MessageCache {
  #messages = {}
  constructor() {}

  onMessage = (message) => {
    let oldLog = this.#messages[message.channel.name] || []
    if (message.content !== '') {
      oldLog.push({
        content: message.content,
        author: message.author.globalName,
        id: message.id,
      })
    }
    this.#messages[message.channel.name] = oldLog
  }

  getMessages = (channelName) => {
    return this.#messages[channelName]
  }

  reset = () => {
    this.#messages = {}
  }
}
