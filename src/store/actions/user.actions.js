import { userService } from '../../services/user.service'
import { authService } from '../../services/auth.service'
import { msgService } from '../../services/msg.service'
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
import { useNavigate } from 'react-router-dom'
import {
  REMOVE_USER,
  // SET_FILTER_BY,
  SET_USERS,
  SET_USER,
  SIGNUP,
  LOGIN,
  LOGOUT,
  SET_LOGGEDIN_USER,
  ADD_MSG,
  LOGIN_ERROR,
  ADD_CONTACT,
  ADD_AUTO_MSG,
  UPDATE_MSG_CONTENT,
  REMOVE_CONTACT,
  EDIT_USER_PROFILE,
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

export function doSignup(userCred) {
  return async (dispatch, getState) => {
    try {
      const user = await authService.signup(userCred)
      console.log('user in actions after back', user)
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
      // const navigate = useNavigate()
      const user = await authService.login(userCred)
      console.log('user', user)
      const action = {
        type: LOGIN,
        user,
      }
      console.log('hi')
      dispatch(action)
      console.log('hi')
      // window.location.href = '/'
      showSuccessMsg('like')
    } catch (err) {
      // const errorMsg = 'username not found please signup'
      // const ErrorAction = {
      //   type: LOGIN_ERROR,
      //   errorMsg,
      // }
      // window.location.href = '/login'
      // dispatch(ErrorAction)
      console.log('erorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr', err)
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

export function doLogout() {
  return async (dispatch, getState) => {
    try {
      await authService.logout()
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

export function setCurrUser(UserId) {
  console.log('UserId', UserId)
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

export function addMsg(
  msgContent,
  recipientId,
  senderId,
  msgType = 'text'
) {
  console.log('msg content from actions', msgContent)
  console.log('senderId actions', senderId)
  console.log('recipientId actions', recipientId)
  return async (dispatch, getState) => {
    try {
      const msg = await msgService.createNewMsg(
        msgContent,
        senderId,
        recipientId,
        msgType
      )

      const loggedInUserId = getState().userModule.loggedInUser._id
      const type = recipientId !== loggedInUserId ? ADD_MSG : ADD_AUTO_MSG
      const action = { type, msg }
      dispatch(action)
    } catch (error) {
      console.log('error:', error)
    }
  }
}

export function deleteMsg(msgId, senderId , recipientId) {
  return async (dispatch, getState) => {
    try {
      const updatedMsg = {
        id: msgId,
        content: 'Message deleted',
      }
      await msgService.updateMsg(updatedMsg, senderId , recipientId)

      dispatch({ type: UPDATE_MSG_CONTENT, msg: updatedMsg })
    } catch (error) {
      console.log('Error:', error)
    }
  }
}

export function blockUnblockContact(actionType,contactId) {
  console.log('contactId', contactId)
  return (dispatch, getState) => {
    try {
      const action = { type: actionType, contactId }
      dispatch(action)
    } catch (error) {
      console.log('error:', error)
    }
  }
}

export function editUserProfile(user) {
  return async (dispatch) => {
    try {
      const updatedUser = await userService.editProfile(user)
      console.log('updatedUser', updatedUser)
      const action = { type: EDIT_USER_PROFILE, user: updatedUser }
      dispatch(action)
      const action2 = {
        type: SET_LOGGEDIN_USER,
        user,
      }
      dispatch(action2)
      showSuccessMsg(`Playlist updated`)
    } catch (error) {
      showErrorMsg(`Cannot update station`)
    }
  }
}
// export function setFilterBy(filterBy) {
//   return (dispatch) => {
//     dispatch({ type: SET_FILTER_BY, filterBy })
//   }
// }
