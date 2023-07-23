import { httpService } from './http.service.js'
import { utilService } from './util.service.js'

export const msgService = {
    createNewMsg,
    deleteMsg,
}

async function createNewMsg(msg, senderId, recipientId) {
    const newMsg = {
      _id: utilService.makeId(12),
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
    const msgId = msg._id
  await httpService.put(`contact/message/`, msgId ,senderId)
  // await httpService.delete(`contact/${recipientId}/message/delete/${msg._id}`)
}
