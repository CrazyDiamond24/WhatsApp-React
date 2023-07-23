import { httpService } from './http.service.js'
import { utilService } from './util.service.js'

export const msgService = {
    createNewMsg,
    deleteMsg,
}

async function createNewMsg(msg, senderId, recipientId) {
    const newMsg = {
      id: utilService.makeId(12),
      senderId: senderId,
      recipientId: recipientId,
      content: msg,
      timestamp: Date.now(),
    }
    await httpService.post(`contact/${senderId}/message`, newMsg)
    await httpService.post(`contact/${recipientId}/message`, newMsg)
    return newMsg
  }
  
  async function deleteMsg(msg, recipientId , senderId) {
    console.log('msg', msg)
    console.log('sender', senderId)
    const msgId = msg._id
  await httpService.put(`contact/message/edit`, {msgId ,senderId})
  // await httpService.delete(`contact/${recipientId}/message/delete/${msg._id}`)
}
