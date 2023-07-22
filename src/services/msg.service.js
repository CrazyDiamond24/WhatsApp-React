import { httpService } from './http.service.js'

export const msgService = {
    createNewMsg
}

async function createNewMsg(msg, senderId, recipientId) {
    const newMsg = {
      senderId: senderId,
      recipientId: recipientId,
      content: msg,
      timestamp: Date.now(),
    }
    await httpService.post(`contact/${senderId}/message`, newMsg)
  
    await httpService.post(`contact/${recipientId}/message`, newMsg)
  
    return newMsg
  }