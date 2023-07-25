import { httpService } from './http.service.js'
import { utilService } from './util.service.js'

export const msgService = {
    createNewMsg,
    updateMsg,
}

async function createNewMsg(msg, senderId, recipientId, type) {
    const newMsg = {
      id: utilService.makeId(12),
      senderId: senderId,
      recipientId: recipientId,
      content: msg,
      timestamp: Date.now(),
      type: type
    }
    await httpService.post(`contact/${senderId}/msg`, newMsg)
    await httpService.post(`contact/${recipientId}/msg`, newMsg)
    return newMsg
  }
  
  async function updateMsg(msg, senderId, recipientId) {
    console.log('msg from service', msg)
    console.log('sender from service', senderId)
    const msgId = msg.id
  await httpService.put(`contact/msg/edit`, {msgId ,senderId})
  // await httpService.delete(`contact/${recipientId}/msg/delete/${msg._id}`)
}
