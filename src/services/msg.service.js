import { httpService } from './http.service.js'
import { utilService } from './util.service.js'

export const msgService = {
    createNewMsg,
    updateMsg,
    getUserMessages
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
  await httpService.put(`contact/msg/edit`, {msgId ,senderId , recipientId})
  // await httpService.delete(`contact/${recipientId}/msg/delete/${msg._id}`)
}


// frontend service
async function getUserMessages(userId, loggedInUserId) {
  try {
    const response = await httpService.get(`contact/${loggedInUserId}/user/${userId}/messages`);
    return response.data;
  } catch (error) {
    console.log('Error fetching user messages:', error);
    throw error;
  }
}

// ... other service functions ...
