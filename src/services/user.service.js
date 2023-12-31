import { httpService } from './http.service.js'
export const userService = {
  query,
  updatePref,
  getById,
  addStory,
  getEmptyUser,
  createNewMsg,
  addContact,
  removeContact,
  editProfile,
  getFilteredUsers,
  editLastSeen,
  blockUnblockUser,
  clearChat,
}

// const STORAGE_KEY = 'users'

function query() {
  return httpService.get(`contact`)
}
async function editProfile(user) {
  const updatedUser = await httpService.put(`contact/${user._id}`, user)
  return updatedUser
}
async function editLastSeen(user) {
  const updatedUser = await httpService.put(
    `contact/${user._id}/last-seen`,
    user
  )
  return updatedUser
}

async function clearChat(targetUserId, loggedInUserId) {
  const data = { targetUserId, loggedInUserId }
  const response = await httpService.post(`contact/clear-chat`, data)
  return response
}

async function blockUnblockUser(actionType, userId, loggedInUserId) {
  const data = { actionType, loggedInUserId }
  const updatedUser = await httpService.put(
    `contact/${userId}/block-un-block`,
    data
  )
  return updatedUser
}
async function updatePref(user) {
  const updatedUser = await httpService.put(`contact/${user._id}/pref`, user)
  return updatedUser
}

async function addContact(loggedInUserId, contactName) {
  const contact = await httpService.post(
    `contact/${loggedInUserId}/add-contact`,
    { contactName }
  )
  return contact
}
async function addStory(loggedInUserId, url) {
  httpService.post(`contact/${loggedInUserId}/add-story`, { url })
}
async function removeContact(loggedInUserId, contactId) {
  await httpService.delete(
    `contact/${loggedInUserId}/remove-contact/${contactId}`
  )
}

async function getById(id) {
  // const user = gUsers.find((user) => user._id === id)
  // return Promise.resolve({ ...user })
  const user = await httpService.get(`contact/${id}`)
  return user
}
async function createNewMsg(msg, senderId, recipientId) {
  const newMsg = {
    senderId: senderId,
    recipientId: recipientId,
    content: msg,
    timestamp: Date.now(),
  }
  await httpService.post(`contact/${senderId}/msg`, newMsg)
  await httpService.post(`contact/${recipientId}/msg`, newMsg)
  return newMsg
}

function getEmptyUser() {
  return {
    fullName: '',
    username: '',
    blockedContcats: [],
    img: 'https://randomuser.me/api/portraits/men/1.jpg',
    contacts: [],
    msgs: [],
  }
}

function getFilteredUsers(users, filterBy, loggedInUser) {
  const regexPattern = new RegExp(filterBy, 'i')
  const filteredUsers = users?.filter((user) => {
    const isUserInContacts =
      loggedInUser?.contacts &&
      loggedInUser?.contacts?.some(
        (contact) => contact && contact._id === user._id
      )

    return (
      loggedInUser &&
      isUserInContacts &&
      user._id !== loggedInUser._id &&
      (regexPattern.test(user.fullName) ||
        user?.msgs?.some((msg) => regexPattern.test(msg.content)))
    )
  })
  return filteredUsers?.sort((a, b) => {
    const aMsgs = a.msgs
    const bMsgs = b.msgs

    const aLastMsgTimestamp = aMsgs?.[aMsgs.length - 1]?.timestamp
    const bLastMsgTimestamp = bMsgs?.[bMsgs.length - 1]?.timestamp

    return bLastMsgTimestamp - aLastMsgTimestamp
  })
}
