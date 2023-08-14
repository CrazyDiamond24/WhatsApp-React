import { userService } from '../../services/user.service'
import { authService } from '../../services/auth.service'
import { msgService } from '../../services/msg.service'
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
import { socketService } from '../../services/socket.service'
import {
  REMOVE_USER,
  SET_USERS,
  SET_USER,
  SIGNUP,
  LOGIN,
  LOGOUT,
  SET_LOGGEDIN_USER,
  ADD_MSG,
  ADD_STORY,
  ADD_CONTACT,
  UPDATE_MSG_CONTENT,
  REMOVE_CONTACT,
  EDIT_USER,
  EDIT_LOGGEDIN_USER,
  UPDATE_USER_STATUS,
  CLEAR_CHAT,
} from '../reducers/user.reducer'

export function addContactToUser(name) {
  return async (dispatch, getState) => {
    try {
      const loggedInUser = getState().userModule.loggedInUser
      const contact = await userService.addContact(loggedInUser._id, name)
      const action = {
        type: ADD_CONTACT,
        contact,
      }
      dispatch(action)
    } catch (error) {
      console.log('error:', error)
    }
  }
}

export function addStoryToUser(url) {
  console.log('story action', url)
  return async (dispatch, getState) => {
    try {
      const loggedInUser = getState().userModule.loggedInUser
      await userService.addStory(loggedInUser._id, url)
      const action = {
        type: ADD_STORY,
        url,
      }
      dispatch(action)
    } catch (error) {
      console.log('error:', error)
    }
  }
}

export function doSignup(userCred) {
  return async (dispatch, getState) => {
    try {
      const user = await authService.signup(userCred)
      const action = {
        type: SIGNUP,
        user,
      }
      dispatch(action)
    } catch (error) {
      console.log('error:', error)
    }
  }
}

export function doLogin(userCred) {
  return async (dispatch, getState) => {
    try {
      const user = await authService.login(userCred)
      // user.isOnline = true
      // console.log('user', user)
      socketService.login(user._id)
      const action = {
        type: LOGIN,
        user,
      }
      dispatch(action)

      showSuccessMsg('like')

      // Add any additional logic here if needed before navigating
      // For example, you could wait for some socket event to be received
      // Only then navigate to the home page
      // window.location.href = '/'
      return user
    } catch (err) {
      console.log('error', err)
    }
  }
}

export function getUser() {
  return async (dispatch, getState) => {
    try {
      const user = await authService.getLoggedinUser()

      const action = {
        type: SET_LOGGEDIN_USER,
        user,
      }
      dispatch(action)
      return user
    } catch (error) {
      console.log('error:', error)
    }
  }
}

export function doLogout(userId) {
  return async (dispatch, getState) => {
    try {
      await authService.logout()
      socketService.logout(userId)
      const action = {
        type: LOGOUT,
      }
      dispatch(action)
    } catch (error) {
      console.log('error:', error)
    }
  }
}
export function loadUsers() {
  return async (dispatch, getState) => {
    try {
      // const loggedInUser = getState().userModule.loggedInUser
      const users = await userService.query()
      const action = {
        type: SET_USERS,
        users,
      }
      dispatch(action)
    } catch (error) {
      console.log('error:', error)
    }
  }
}

export function removeContactFromUser(loggedInUserId, contactId) {
  return async (dispatch, getState) => {
    try {
      await userService.removeContact(loggedInUserId, contactId)
      const action = {
        type: REMOVE_CONTACT,
        contactId,
        loggedInUserId,
      }
      dispatch(action)
    } catch (error) {
      console.log('error:', error)
    }
  }
}

export function clearChat(targetUserId, loggedInUserId) {
  return async (dispatch) => {
    try {
      const updatedUser = await userService.clearChat(targetUserId, loggedInUserId)
      console.log('updatedUser', updatedUser)
      const action = {
        type: CLEAR_CHAT,
        // targetUserId,
        // loggedInUserId,
        updatedUser
      }
      dispatch(action)
    } catch (error) {
      console.log('error:', error)
    }
  }
}

export function addMsg(msgContent, recipientId, senderId, msgType = 'text') {
  return async (dispatch, getState) => {
    try {
      const msg = await msgService.createNewMsg(
        msgContent,
        senderId,
        recipientId,
        msgType
      )

      const type = ADD_MSG
      const action = { type, msg }
      dispatch(action)
    } catch (error) {
      console.log('error:', error)
    }
  }
}

export function setCurrUser(UserId) {
  return async (dispatch, getState) => {
    try {
      const user = await userService.getById(UserId)
      const action = {
        type: SET_USER,
        user,
      }
      dispatch(action)
    } catch (error) {
      console.log('error:', error)
    }
  }
}

export function removeUser(userId) {
  return async (dispatch) => {
    try {
      await userService.remove(userId)
      const action = { type: REMOVE_USER, userId }
      dispatch(action)
      return 'Removed!'
    } catch (error) {
      console.log('error:', error)
    }
  }
}

export function deleteMsg(msgId, senderId, recipientId) {
  return async (dispatch, getState) => {
    try {
      const updatedMsg = {
        id: msgId,
        content: 'Message deleted',
      }
      await msgService.updateMsg(updatedMsg, senderId, recipientId)

      dispatch({ type: UPDATE_MSG_CONTENT, msg: updatedMsg })
    } catch (error) {
      console.log('Error:', error)
    }
  }
}

export function blockUnblockContact(actionType, contactId, loggedInUserId) {
  return async (dispatch, getState) => {
    try {
      const { updatedUser, updatedLoggedInUser } =
        await userService.blockUnblockUser(
          actionType,
          contactId,
          loggedInUserId
        )
      const LoggedInUserAction = {
        type: EDIT_LOGGEDIN_USER,
        user: updatedLoggedInUser,
      }
      dispatch(LoggedInUserAction)
      const userAction = { type: EDIT_USER, user: updatedUser }
      dispatch(userAction)
    } catch (error) {
      console.log('error:', error)
    }
  }
}

export function editUserProfile(user) {
  return async (dispatch) => {
    try {
      const updatedUser = await userService.editProfile(user)
      const action = { type: EDIT_USER, user: updatedUser }
      dispatch(action)
      const action2 = {
        type: SET_LOGGEDIN_USER,
        user,
      }
      dispatch(action2)
      showSuccessMsg(`User updated`)
    } catch (error) {
      showErrorMsg(`Cannot update user`)
    }
  }
}

export function updateUserPref(user) {
  return async (dispatch, getState) => {
    try {
      const updatedUser = await userService.updatePref(user)
      const action = {
        type: EDIT_USER,
        user: updatedUser,
      }
      dispatch(action)
    } catch (error) {
      console.log('error:', error)
    }
  }
}

export function updateLastSeen(user) {
  return async (dispatch) => {
    try {
      const updatedUser = await userService.editLastSeen(user)
      const action = { type: EDIT_USER, user: updatedUser }
      dispatch(action)
      showSuccessMsg(`last seen updated`)
    } catch (error) {
      showErrorMsg(`Cannot update last seen `)
    }
  }
}

export function updateUserStatus(userId, isOnline, lastSeen) {
  return async (dispatch) => {
    try {
      const action = { type: UPDATE_USER_STATUS, userId, isOnline, lastSeen }
      dispatch(action)
    } catch (error) {}
  }
}
