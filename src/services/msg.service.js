import { httpService } from './http.service.js'
import { utilService } from './util.service.js'

export const msgService = {
  createNewMsg,
  updateMsg,
  getUserMessages,
  filterMsgs,
  getTimestamp,
  getMsgType,
  getReceivedMsgType,
  getType,
}

async function createNewMsg(msg, senderId, recipientId, type) {
  const newMsg = {
    id: utilService.makeId(12),
    senderId: senderId,
    recipientId: recipientId,
    content: msg,
    timestamp: Date.now(),
    type: type,
  }
  await httpService.post(`contact/${senderId}/msg`, newMsg)
  await httpService.post(`contact/${recipientId}/msg`, newMsg)
  return newMsg
}

async function updateMsg(msg, senderId, recipientId) {
  const msgId = msg.id
  await httpService.put(`contact/msg/edit`, { msgId, senderId, recipientId })
  // await httpService.delete(`contact/${recipientId}/msg/delete/${msg._id}`)
}

// frontend service
async function getUserMessages(userId, loggedInUserId) {
  try {
    const response = await httpService.get(
      `contact/${loggedInUserId}/user/${userId}/messages`
    )
    return response.data
  } catch (error) {
    console.log('Error fetching user messages:', error)
    throw error
  }
}

function filterMsgs(user, loggedInUser) {
  const filteredMsgs = loggedInUser.msgs
    .filter(
      (msg) =>
        (msg.senderId === loggedInUser._id && msg.recipientId === user._id) ||
        (msg.senderId === user._id && msg.recipientId === loggedInUser._id)
    )
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

  return filteredMsgs
}

function getTimestamp(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const currentDate = new Date()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')

  // Check if the date is today
  if (date.toDateString() === currentDate.toDateString()) {
    return `${hours}:${minutes}`
  }

  // Check if the date is within the last 6 days (show day name)
  const daysDifference = (currentDate - date) / (1000 * 60 * 60 * 24)
  if (daysDifference < 6) {
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]
    const dayOfWeek = daysOfWeek[date.getDay()]
    return `${dayOfWeek}, ${hours}:${minutes}`
  }

  // Otherwise, show the full date (e.g., "Jul 20, 2023, 12:34")
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const month = months[date.getMonth()]
  const day = date.getDate()
  return `${month} ${day}, ${hours}:${minutes}`
}

function getMsgType(url, loggedInUser, user, type) {
  return {
    content: url,
    senderId: loggedInUser._id,
    recipientId: user._id,
    type,
  }
}

function getReceivedMsgType(msg) {
  if (msg.content.includes('image')) return 'image'
  if (msg.content.includes('gif')) return 'image'
  if (msg.content.includes('deepai')) return 'image'
  if (msg.content.includes('video')) return 'video'
  if (msg.content.includes('blob')) return 'audio'
  if (msg.content.includes('raw')) return 'file'
  else return 'text'
}
function getType(msg) {
  if (msg.type === 'audio') return 'Audio msg'
  if (msg.type === 'video') return 'Video msg'
  if (msg.type === 'file') return 'File msg'
}
