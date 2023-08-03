import { httpService } from './http.service.js'
import { storageService } from './storage.service.js'
import { utilService } from './util.service.js'
import { authService } from './auth.service.js'
export const userService = {
  query,
  // save,
  // remove,
  getById,
  getEmptyUser,
  createNewMsg,
  addContact,
  removeContact,
  editProfile,
  getFilteredUsers,
}

const STORAGE_KEY = 'users'

function query() {
  return httpService.get(`contact`)
}
async function editProfile(user) {
  return httpService.put(`contact/${user._id}`, user)
}
async function addContact(loggedInUserId, contactName) {
  const contact = await httpService.post(
    `contact/${loggedInUserId}/add-contact`,
    { contactName }
  )
  return contact
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

// function remove(id) {
//   const idx = gUsers.findIndex((user) => user._id === id)
//   gUsers.splice(idx, 1)
//   if (!gUsers.length) gUsers = gDefaultUsers.slice()
//   storageService.store(STORAGE_KEY, gUsers)
//   return Promise.resolve()
//   // return httpService.delete(`/${id}`)
// }

// function save(userToSave) {
//   if (userToSave._id) {
//     const idx = gUsers.findIndex((user) => user._id === userToSave._id)
//     gUsers.splice(idx, 1, userToSave)
//   } else {
//     userToSave._id = utilService.makeId()
//     gUsers.push(userToSave)
//   }
//   storageService.store(STORAGE_KEY, gUsers)
//   return Promise.resolve(userToSave)
//   // return httpService.get(`/${id}`)
// }

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
