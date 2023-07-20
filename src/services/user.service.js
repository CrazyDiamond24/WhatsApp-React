import { storageService } from './storage.service.js'
import { makeId } from './util.service.js'

export const userService = {
  query,
  save,
  remove,
  getById,
  getEmptyUser,
  tryUser,
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
    status: "",
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
    status: "",
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
    status: "",
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
    status: "",
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

function query(filterBy) {
  let usersToReturn = gUsers
  console.log(filterBy)
  if (filterBy) {
    const { fullName, username, img } = filterBy

    //   usersToReturn = gUsers.filter(
    //     (user) =>
    //       user.fullName.toLowerCase().includes(fullName.toLowerCase()) &&
    //       user.username.toLowerCase().includes(username.toLowerCase()) &&
    //       user.img === img
    //   );
  }
  return Promise.resolve([...usersToReturn])
}
function tryUser(id) {
  const user = gUsers.find((user) => user._id === id)
  user.batteryStatus -= 10
  return Promise.resolve()
}
function getById(id) {
  const user = gUsers.find((user) => user._id === id)
  return Promise.resolve({ ...user })
}

function remove(id) {
  const idx = gUsers.findIndex((user) => user._id === id)
  gUsers.splice(idx, 1)
  if (!gUsers.length) gUsers = gDefaultUsers.slice()
  storageService.store(STORAGE_KEY, gUsers)
  return Promise.resolve()
}

function save(userToSave) {
  if (userToSave._id) {
    const idx = gUsers.findIndex((user) => user._id === userToSave._id)
    gUsers.splice(idx, 1, userToSave)
  } else {
    userToSave._id = makeId()
    gUsers.push(userToSave)
  }
  storageService.store(STORAGE_KEY, gUsers)
  return Promise.resolve(userToSave)
}

function getEmptyUser() {
  return {
    model: '',
    type: '',
  }
}

function _loadUsers() {
  let users = storageService.load(STORAGE_KEY)
  if (!users || !users.length) users = gDefaultUsers
  storageService.store(STORAGE_KEY, users)
  return users
}
