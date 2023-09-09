import io from 'socket.io-client'
import { authService } from './auth.service'
import { store } from '../store/index'
import {
  updateUserStatus,
  updateUserStoryStatus,
} from '../store/actions/user.actions'
export const SOCKET_EVENT_ADD_MSG = 'chat-add-msg'
export const SOCKET_EMIT_SEND_MSG = 'chat-send-msg'
export const SOCKET_EMIT_SET_TOPIC = 'chat-set-topic'
export const SOCKET_EMIT_USER_WATCH = 'user-watch'
export const SOCKET_EVENT_USER_UPDATED = 'user-updated'
export const SOCKET_EVENT_USER_UPDATED_ADDED_STORY = 'user-updated-added-story'
export const SOCKET_EVENT_REVIEW_ADDED = 'review-added'
export const SOCKET_EVENT_REVIEW_ABOUT_YOU = 'review-about-you'

const SOCKET_EMIT_LOGIN = 'set-user-socket'
const SOCKET_EMIT_STORY_ADDED = 'added-story-socket'
const SOCKET_EMIT_LOGOUT = 'unset-user-socket'

const baseUrl = process.env.NODE_ENV === 'production' ? '' : '//localhost:3030'
export const socketService = createSocketService()

// for debugging from console
window.socketService = socketService

socketService.setup()

socketService.on(SOCKET_EVENT_USER_UPDATED, (user) => {
  // console.log('updatedUser', updatedUser)
  // console.log('userStatusUpdate', userStatusUpdate)
  if (
    user
    // userStatusUpdate.userId &&
    // userStatusUpdate.isOnline !== undefined &&
    // userStatusUpdate.lastSeen
  ) {
    store.dispatch(
      updateUserStatus(
        user.updatedUser
        // userStatusUpdate.userId,
        // userStatusUpdate.isOnline,
        // userStatusUpdate.lastSeen
      )
    )
  }
})

socketService.on(
  SOCKET_EVENT_USER_UPDATED_ADDED_STORY,
  (userStoryStatusUpdate) => {
    if (
      userStoryStatusUpdate.userId &&
      userStoryStatusUpdate.haveStory !== undefined
    ) {
      store.dispatch(
        updateUserStoryStatus(
          userStoryStatusUpdate.userId,
          userStoryStatusUpdate.haveStory
        )
      )
    }
  }
)

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
    logout(userId) {
      socket.emit(SOCKET_EMIT_LOGOUT, userId)
    },
    terminate() {
      // Clear the registeredEvents array when the socket is terminated
      registeredEvents.length = 0
      socket = null
    },
    addedStory(userId) {
      socket.emit(SOCKET_EMIT_STORY_ADDED, userId)
    },
  }
  return socketService
}

// The rest of your code including createDummySocketService() remains unchanged
