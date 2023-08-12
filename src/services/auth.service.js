import { httpService } from './http.service'
// import { stationService } from './station.service'
import { utilService } from './util.service'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export const authService = {
  login,
  logout,
  signup,
  getLoggedinUser,
  saveLocalUser,
  getUsers,
  getById,
  remove,

  getLoggedinUserDetails,
}

window.authService = authService
signupGuest()
function getUsers() {
  return httpService.get(`user`)
}

async function getById(userId) {
  const user = await httpService.get(`user/${userId}`)

  return user
}

function remove(userId) {
  return httpService.delete(`user/${userId}`)
}

async function login(userCred) {
  try {
    const user = await httpService.post('auth/login', userCred)
    return saveLocalUser(user)
  } catch (err) {
    console.log('service', err)
  }
}

async function signup(userCred) {
  const user = await httpService.post('auth/signup', userCred)
  return saveLocalUser(user)
}

async function logout() {
  return await httpService.post('auth/logout')
}

async function getLoggedinUserDetails() {
  const user = getLoggedinUser()

  if (!user) return null
  const userDetails = await httpService.get(`user/${user._id}`)
  return userDetails
}

function saveLocalUser(user) {
  user = {
    _id: user._id,
    username: user.username,
    fullName: user.fullName,
    msgs: user.msgs,
    contacts: user.contacts,
    groups: user.groups,
    story: user.story,
    img: user.img,
    status: user.status,
    blockedContcats: user.blockedContcats,
    userPref: user.userPref,
  }
  sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
  return user
}

function getLoggedinUser() {
  const user = JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
  if (user) {
    if (user.username === 'guest') {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
    } else {
      return httpService.get(`contact/${user._id}`)
    }
  }
}

async function signupGuest() {
  const guestUser = {
    _id: '64d788b6e9633df901bed7ed',
    username: 'guest',
    password: '3256dsaht8eh4e433$%4#$3$',
    fullName: 'guest',
    img: 'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg',
    status: 'guest mode',
    story: [],
    groups: [],
    contacts: [],
    msgs: [],
    userPref: {
      fontSize: 16,
      fontColor: '#000000',
      headerBgColor: '#ffffff',
      fontFamily: 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif',
      backgroundImage: '',
    },
  }
  sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(guestUser))
}
