import { httpService } from './http.service.js'
import { storageService } from './storage.service.js'
import { utilService } from './util.service.js'
import { authService } from './auth.service.js'
export const userService = {
  query,
  save,
  remove,
  getById,
  getEmptyUser,
  createNewMsg,
}

const STORAGE_KEY = 'users'

const gDefaultUsers = [
  {
    _id: '101',
    fullName: 'John Doe',
    username: 'john.doe',
    img: 'https://randomuser.me/api/portraits/men/1.jpg',
    contacts: [],
    story: [],
    groups: [],
    status: '',
    msgs: [
      {
        id: 'msg1',
        senderId: '105',
        recipientId: '101',
        content: 'Hello, how are you?',
        timestamp: '2023-07-19T12:34:56.789Z',
      },
      {
        id: 'msg2',
        senderId: '101',
        recipientId: '105',
        content: "I'm doing well, thank you!",
        timestamp: '2023-07-19T12:36:00.123Z',
      },
    ],
  },
  {
    _id: '102',
    fullName: 'Jane Smith',
    username: 'jane.smith',
    img: 'https://randomuser.me/api/portraits/women/2.jpg',
    contacts: [],
    story: [],
    groups: [],
    status: '',
    msgs: [
      {
        id: 'msg3',
        senderId: '102',
        recipientId: '101',
        content: 'Hey, how is it going?',
        timestamp: '2023-07-19T12:38:25.456Z',
      },
    ],
  },
  {
    _id: '103',
    fullName: 'Mike Johnson',
    username: 'mike.johnson',
    img: 'https://randomuser.me/api/portraits/men/3.jpg',
    contacts: [],
    story: [],
    groups: [],
    status: '',
    msgs: [
      {
        id: 'msg4',
        senderId: '103',
        recipientId: '101',
        content: 'Morning! Are you free today?',
        timestamp: '2023-07-19T13:20:10.987Z',
      },
      {
        id: 'msg5',
        senderId: '101',
        recipientId: '103',
        content: "Hi Mike! Yes, I am. What's up?",
        timestamp: '2023-07-19T13:21:30.765Z',
      },
    ],
  },
  {
    _id: '104',
    fullName: 'Emily Brown',
    username: 'emily.brown',
    img: 'https://randomuser.me/api/portraits/women/4.jpg',
    contacts: [],
    story: [],
    groups: [],
    status: '',
    msgs: [
      {
        id: 'msg6',
        senderId: '104',
        recipientId: '101',
        content: 'Good afternoon!',
        timestamp: '2023-07-19T15:45:00.234Z',
      },
      {
        id: 'msg7',
        senderId: '101',
        recipientId: '104',
        content: "Hi Emily! How's your day going?",
        timestamp: '2023-07-19T15:46:45.321Z',
      },
      {
        id: 'msg8',
        senderId: '104',
        recipientId: '101',
        content: "It's going well, thanks! How about you?",
        timestamp: '2023-07-19T15:47:50.876Z',
      },
    ],
  },
]

var gUsers = _loadUsers()

function query() {
  return httpService.get('contact')
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

function remove(id) {
  const idx = gUsers.findIndex((user) => user._id === id)
  gUsers.splice(idx, 1)
  if (!gUsers.length) gUsers = gDefaultUsers.slice()
  storageService.store(STORAGE_KEY, gUsers)
  return Promise.resolve()
  // return httpService.delete(`/${id}`)
}

function save(userToSave) {
  if (userToSave._id) {
    const idx = gUsers.findIndex((user) => user._id === userToSave._id)
    gUsers.splice(idx, 1, userToSave)
  } else {
    userToSave._id = utilService.makeId()
    gUsers.push(userToSave)
  }
  storageService.store(STORAGE_KEY, gUsers)
  return Promise.resolve(userToSave)
  // return httpService.get(`/${id}`)
}

function getEmptyUser() {
  return {
    fullName: '',
    username: '',
    img: 'https://randomuser.me/api/portraits/men/1.jpg',
    contacts: [],
    msgs: [],
  }
}

function _loadUsers() {
  let users = storageService.load(STORAGE_KEY)
  if (!users || !users.length) users = gDefaultUsers
  storageService.store(STORAGE_KEY, users)
  return users
}
