import io from 'socket.io-client'
import { authService } from './auth.service'

export const SOCKET_EVENT_ADD_MSG = 'chat-add-msg'
export const SOCKET_EMIT_SEND_MSG = 'chat-send-msg'
export const SOCKET_EMIT_SET_TOPIC = 'chat-set-topic'
export const SOCKET_EMIT_USER_WATCH = 'user-watch'
export const SOCKET_EVENT_USER_UPDATED = 'user-updated'
export const SOCKET_EVENT_REVIEW_ADDED = 'review-added'
export const SOCKET_EVENT_REVIEW_ABOUT_YOU = 'review-about-you'

const SOCKET_EMIT_LOGIN = 'set-user-socket'
const SOCKET_EMIT_LOGOUT = 'unset-user-socket'

const baseUrl = process.env.NODE_ENV === 'production' ? '' : '//localhost:3030'
export const socketService = createSocketService()
// export const socketService = createDummySocketService()

// for debugging from console
window.socketService = socketService

socketService.setup()

function createSocketService() {
  var socket = null
  const registeredEvents = [] // Keep track of registered event names

  const socketService = {
    setup() {
      socket = io(baseUrl)
      setTimeout(async () => {
        const user = await authService.getLoggedinUser()
        if (user && user._id) this.login(user._id)
      }, 500)
    },
    on(eventName, cb) {
      // Check if the event is not already registered before adding it
      if (!registeredEvents.includes(eventName)) {
        socket.on(eventName, cb)
        registeredEvents.push(eventName)
      }
    },
    off(eventName, cb = null) {
      if (!socket) return
      if (!cb) {
        // Remove all listeners for the event and clear from the registeredEvents array
        socket.removeAllListeners(eventName)
        const index = registeredEvents.indexOf(eventName)
        if (index !== -1) {
          registeredEvents.splice(index, 1)
        }
      } else {
        socket.off(eventName, cb)
        // Remove the listener from the registeredEvents array
        const index = registeredEvents.indexOf(eventName)
        if (index !== -1) {
          registeredEvents.splice(index, 1)
        }
      }
    },
    emit(eventName, data) {
      data = JSON.parse(JSON.stringify(data))
      socket.emit(eventName, data)
    },
    login(userId) {
      socket.emit(SOCKET_EMIT_LOGIN, userId)
    },
    logout() {
      socket.emit(SOCKET_EMIT_LOGOUT)
    },
    terminate() {
      // Clear the registeredEvents array when the socket is terminated
      registeredEvents.length = 0
      socket = null
    },
  }
  return socketService
}

// eslint-disable-next-line
function createDummySocketService() {
  var listenersMap = {}
  const socketService = {
    listenersMap,
    setup() {
      listenersMap = {}
    },
    terminate() {
      this.setup()
    },
    login() {},
    logout() {},
    on(eventName, cb) {
      listenersMap[eventName] = [...(listenersMap[eventName] || []), cb]
    },
    off(eventName, cb) {
      if (!listenersMap[eventName]) return
      if (!cb) delete listenersMap[eventName]
      else
        listenersMap[eventName] = listenersMap[eventName].filter(
          (l) => l !== cb
        )
    },
    emit(eventName, data) {
      var listeners = listenersMap[eventName]
      if (eventName === SOCKET_EMIT_SEND_MSG) {
        listeners = listenersMap[SOCKET_EVENT_ADD_MSG]
      }

      if (!listeners) return

      listeners.forEach((listener) => {
        listener(data)
      })
    },
    // Functions for easy testing of pushed data
    testChatMsg() {
      this.emit(SOCKET_EVENT_ADD_MSG, {
        from: 'Someone',
        txt: 'Aha it worked!',
      })
    },
    testUserUpdate() {
      this.emit(SOCKET_EVENT_USER_UPDATED, {
        ...authService.getLoggedinUser(),
        score: 555,
      })
    },
  }
  window.listenersMap = listenersMap
  return socketService
}

// Basic Tests
// function cb(x) {console.log('Socket Test - Expected Puk, Actual:', x)}
// socketService.on('baba', cb)
// socketService.on('baba', cb)
// socketService.on('baba', cb)
// socketService.on('mama', cb)
// socketService.emit('baba', 'Puk')
// socketService.off('baba', cb)
