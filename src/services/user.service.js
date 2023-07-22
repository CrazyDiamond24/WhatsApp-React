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
}

const STORAGE_KEY = 'users'

function query() {
  return httpService.get(`contact`)
}
async function addContact(loggedInUserId, contactName) {
  const contact = await httpService.post(
    `contact/${loggedInUserId}/add-contact`,
    { contactName }
  )
  return contact
}

async function getById(id) {
  console.log('id service front', id)
  // const user = gUsers.find((user) => user._id === id)
  // return Promise.resolve({ ...user })
  const user = await httpService.get(`contact/${id}`)
  console.log('user', user)
  return user
}
async function createNewMsg(msg, senderId, recipientId) {
  const newMsg = {
    senderId: senderId,
    recipientId: recipientId,
    content: msg,
    timestamp: Date.now(),
  }

  // Add the message to the sender's messages array
  await httpService.post(`contact/${senderId}/message`, newMsg)

  // Add the message to the recipient's messages array
  await httpService.post(`contact/${recipientId}/message`, newMsg)

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
    img: 'https://randomuser.me/api/portraits/men/1.jpg',
    contacts: [],
    msgs: [],
  }
}
